import { Types } from 'mongoose';

export interface IAttributeSchema {
  name: string;
  attributeKey: string;
  type: 'checkbox' | 'dropdown' | 'text'; 
}

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  attributeSchema: IAttributeSchema[];
}

export interface IListingAttributes {
  [key: string]: string | number | boolean;
}

export interface IListing extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  location?: string;
  category: Types.ObjectId;
  attributes: IListingAttributes;
  createdAt: Date;
  updatedAt: Date;
}

export interface FacetOption {
  value: string | number;
  label: string;
  count: number;
  selected: boolean;
}

export interface Facet {
  name: string;
  attributeKey: string;
  type: string;
  options: FacetOption[];
}

export interface SearchResults {
  results: IListing[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
  };
  facets: Facet[];
}