import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CategoryModel from '@/models/CategoryModel';
import ListingModel from '@/models/ListingModel';
import { IListing, Facet, FacetOption, SearchResults, IAttributeSchema } from '@/types';
import mongoose, { PipelineStage } from 'mongoose';


export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const q = searchParams.get('q') || '';
    const categorySlug = searchParams.get('category');
    const filtersString = searchParams.get('filters');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!categorySlug) {
      return NextResponse.json({ error: 'Category slug is required' }, { status: 400 });
    }

    const category = await CategoryModel.findOne({ slug: categorySlug });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    let parsedFilters: Record<string, string | string[]> = {};
    if (filtersString) {
      try {
        parsedFilters = JSON.parse(filtersString);
      } catch (error) {
        return NextResponse.json({ error: 'Invalid filters format' }, { status: 400 });
      }
    }
    
    const matchStage: PipelineStage.Match = { category: category._id };

    if (q) {
      matchStage.$text = { $search: q };
    }

    for (const key in parsedFilters) {
      const filterValue = parsedFilters[key];
      if (filterValue) {
         matchStage[`attributes.${key}`] = Array.isArray(filterValue) ? { $in: filterValue } : filterValue;
      }
    }

    const countPipeline: PipelineStage[] = [{ $match: matchStage }, { $count: 'totalResults' }];
    const totalResultsArr = await ListingModel.aggregate(countPipeline).exec();
    const totalResults = totalResultsArr.length > 0 ? totalResultsArr[0].totalResults : 0;
    const totalPages = Math.ceil(totalResults / limit);


    const resultsPipeline: PipelineStage[] = [{ $match: matchStage }];
    if (q) {
        resultsPipeline.push({ $sort: { score: { $meta: 'textScore' } } as any });
    } else {
        resultsPipeline.push({ $sort: { createdAt: -1 } });
    }
    resultsPipeline.push({ $skip: (page - 1) * limit });
    resultsPipeline.push({ $limit: limit });
    
    const results = await ListingModel.aggregate(resultsPipeline).exec() as IListing[];


    const facetPipeline: Record<string, PipelineStage[]> = {};
    category.attributeSchema.forEach((attrSchema: IAttributeSchema) => {
        const facetMatchStage = { ...matchStage };
        
        const otherFilters: Record<string, any> = {};
        for (const key in parsedFilters) {
            if (key !== attrSchema.attributeKey) {
                otherFilters[`attributes.${key}`] = parsedFilters[key];
            }
        }
        const currentFacetMatch = { ...matchStage };
        delete currentFacetMatch[`attributes.${attrSchema.attributeKey}`];


        facetPipeline[attrSchema.attributeKey] = [
            { $match: currentFacetMatch },
            { $group: { _id: `$attributes.${attrSchema.attributeKey}`, count: { $sum: 1 } } },
            { $project: { _id: 0, value: '$_id', count: '$count' } },
            { $sort: { count: -1, value: 1 } } 
        ];
    });
    
    let facetsData: Record<string, { value: any; count: number }[]> = {};
    if (Object.keys(facetPipeline).length > 0) {
        facetsData = await ListingModel.aggregate([{ $facet: facetPipeline }]).then(res => res[0]);
    }


    const responseFacets: Facet[] = category.attributeSchema.map((attrSchema: IAttributeSchema) => {
      const options: FacetOption[] = (facetsData[attrSchema.attributeKey] || [])
        .filter(opt => opt.value !== null && opt.value !== undefined) 
        .map(opt => ({
          value: opt.value,
          label: String(opt.value),
          count: opt.count,
          selected: parsedFilters[attrSchema.attributeKey] === opt.value || 
                      (Array.isArray(parsedFilters[attrSchema.attributeKey]) && (parsedFilters[attrSchema.attributeKey] as string[]).includes(String(opt.value)))

        }));
      return {
        name: attrSchema.name,
        attributeKey: attrSchema.attributeKey,
        type: attrSchema.type,
        options: options,
      };
    });

    const responsePayload: SearchResults = {
      results,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        limit,
      },
      facets: responseFacets,
    };

    return NextResponse.json({ data: responsePayload });

  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}