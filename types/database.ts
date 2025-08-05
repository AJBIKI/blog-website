import { Types } from 'mongoose';

// Base lean query result types (what .lean() returns from MongoDB)
export interface LeanCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface LeanTag {
  _id: string;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface LeanUser {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface LeanPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string | null;
  status: 'draft' | 'published' | 'scheduled';
  author: string;
  category: string | LeanCategory; // Can be populated
  tags: string[] | LeanTag[];      // Can be populated
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

// PostForm specific types (minimal required fields for form components)
export interface PostFormCategory {
  _id: string;
  name: string;
}

export interface PostFormTag {
  _id: string;
  name: string;
}

// Populated query result types
export interface PopulatedPost extends Omit<LeanPost, 'category' | 'tags'> {
  category: LeanCategory;
  tags: LeanTag[];
}

// Admin page specific types (for consistency with existing implementations)
export interface AdminCategoryType {
  _id: string;
  name?: string;
  slug?: string;
  description?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminTagType {
  _id: string;
  name?: string;
  slug?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPostType {
  _id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  category: {
    _id: string;
    name: string;
  };
  createdAt: Date;
}

// Utility types for database operations
export type CategorySelectFields = '_id' | 'name' | 'slug' | 'description' | 'createdAt' | 'updatedAt';
export type TagSelectFields = '_id' | 'name' | 'slug' | 'createdAt' | 'updatedAt';
export type PostSelectFields = '_id' | 'title' | 'slug' | 'content' | 'status' | 'category' | 'tags' | 'coverImage' | 'publishedAt' | 'createdAt' | 'updatedAt';