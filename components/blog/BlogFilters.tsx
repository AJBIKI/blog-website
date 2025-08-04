'use client';

import { useRouter } from 'next/navigation';

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type Tag = {
  _id: string;
  name: string;
  slug: string;
};

type BlogFiltersProps = {
  categories: Category[];
  tags: Tag[];
  selectedCategory?: string;
  selectedTag?: string;
};

export default function BlogFilters({ 
  categories, 
  tags, 
  selectedCategory, 
  selectedTag 
}: BlogFiltersProps) {
  const router = useRouter();
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    if (e.target.value) {
      url.searchParams.set('category', e.target.value);
    } else {
      url.searchParams.delete('category');
    }
    router.push(url.pathname + url.search);
  };
  
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    if (e.target.value) {
      url.searchParams.set('tag', e.target.value);
    } else {
      url.searchParams.delete('tag');
    }
    router.push(url.pathname + url.search);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Filter by Category
        </label>
        <select
          id="category"
          name="category"
          className="mt-1 block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
          defaultValue={selectedCategory || ''}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
          Filter by Tag
        </label>
        <select
          id="tag"
          name="tag"
          className="mt-1 block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
          defaultValue={selectedTag || ''}
          onChange={handleTagChange}
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}