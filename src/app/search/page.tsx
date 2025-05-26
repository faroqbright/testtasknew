import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import ProductList from '@/components/ProductList';
import { SearchResults, ICategory } from '@/types';
import CategoryModel from '@/models/CategoryModel';
import dbConnect from '@/lib/db';

async function fetchCategories(): Promise<ICategory[]> {
  await dbConnect();
  const categories = await CategoryModel.find().lean();
  return JSON.parse(JSON.stringify(categories));
}

async function fetchSearchResults(searchParams: URLSearchParams): Promise<SearchResults | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/search?${searchParams.toString()}`, { cache: 'no-store' });
  if (!response.ok) {
    console.error("Failed to fetch search results:", await response.text());
    return null;
  }
  const data = await response.json();
  return data.data;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const queryParams = new URLSearchParams();
  if (searchParams.q) queryParams.set('q', String(searchParams.q));
  if (searchParams.category) queryParams.set('category', String(searchParams.category));
  if (searchParams.filters) queryParams.set('filters', String(searchParams.filters));
  if (searchParams.page) queryParams.set('page', String(searchParams.page));

  const categories = await fetchCategories();
  const searchResults = searchParams.category ? await fetchSearchResults(queryParams) : null;

  const currentCategorySlug = String(searchParams.category || categories[0]?.slug || '');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Product Search</h1>
      <SearchBar categories={categories} currentCategorySlug={currentCategorySlug} />
      
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {searchResults && searchResults.facets.length > 0 && (
          <div className="w-full md:w-1/4">
            <FilterPanel facets={searchResults.facets} />
          </div>
        )}
        <div className={searchResults && searchResults.facets.length > 0 ? "w-full md:w-3/4" : "w-full"}>
          {searchResults ? (
            <ProductList results={searchResults.results} pagination={searchResults.pagination} />
          ) : (
            currentCategorySlug ? <p>Loading results or no results found...</p> : <p>Please select a category to see products.</p>
          )}
        </div>
      </div>
    </div>
  );
}