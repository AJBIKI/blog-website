// import connectToDatabase from '@/lib/db';
// import Post from '@/models/Post';
// import Category from '@/models/Category';
// import Tag from '@/models/Tag';
// import Link from 'next/link';
// import BlogFilters from '@/components/blog/BlogFilters';
// // FIX: Import mongoose to validate ObjectIDs from search params.
// import mongoose from 'mongoose';

// // FIX: Define a clear type for the post data to ensure type safety.
// interface PostCardType {
//   _id: string;
//   title: string;
//   slug: string;
//   content: string;
//   coverImage?: string;
//   publishedAt: string;
//   category: {
//     _id: string;
//     name: string;
//     slug: string;
//   } | null;
// }

// // FIX: Create a dedicated PostCard component for better structure and readability.
// function PostCard({ post }: { post: PostCardType }) {
//   // FIX: A more robust function to generate a plain text excerpt from Markdown content.
//   const generateExcerpt = (markdown: string, length = 150) => {
//     // Remove Markdown headers, lists, links, images, and other syntax.
//     const plainText = markdown
//       .replace(/^#+\s/gm, '') // Headers
//       .replace(/(\*\*|__)/g, '') // Bold
//       .replace(/(\*|_)/g, '') // Italic
//       .replace(/!\[.*?\]\(.*?\)/g, '') // Images
//       .replace(/\[.*?\]\(.*?\)/g, '') // Links
//       .replace(/`{1,3}[\s\S]*?`{1,3}/g, '') // Code blocks
//       .replace(/(\r\n|\n|\r)/gm, ' ') // Newlines
//       .trim();
    
//     if (plainText.length <= length) return plainText;
//     return plainText.substring(0, length) + '...';
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
//       <Link href={`/blog/${post.slug}`} aria-label={post.title}>
//         <img
//           src={post.coverImage || `https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(post.title)}`}
//           alt={post.title}
//           className="w-full h-48 object-cover"
//           onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found`; }}
//         />
//       </Link>
//       <div className="p-6">
//         {post.category && (
//             <Link href={`/blog?category=${post.category._id}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
//                 {post.category.name}
//             </Link>
//         )}
//         <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3">
//           <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
//             {post.title}
//           </Link>
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
//           {generateExcerpt(post.content)}
//         </p>
//         <div className="flex justify-between items-center mt-4">
//             <span className="text-xs text-gray-500 dark:text-gray-500">
//                 {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
//             </span>
//             <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
//                 Read More &rarr;
//             </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


// export default async function BlogPage({ searchParams }: { searchParams: { category?: string; tag?: string } }) {
//   let posts: PostCardType[] = [];
//   let categories: any[] = [];
//   let tags: any[] = [];
//   let activeFilterName: string | null = null;
//   let error: string | null = null;

//   try {
//     await connectToDatabase();

//     // FIX: Construct a dynamic filter query safely.
//     const filter: { status: string; category?: string; tags?: string } = { status: 'published' };
    
//     if (searchParams.category && mongoose.Types.ObjectId.isValid(searchParams.category)) {
//       filter.category = searchParams.category;
//     }
//     if (searchParams.tag && mongoose.Types.ObjectId.isValid(searchParams.tag)) {
//       filter.tags = searchParams.tag;
//     }

//     // Fetch all data in parallel.
//     const [fetchedCategories, fetchedTags, fetchedPosts] = await Promise.all([
//       Category.find().select('name slug _id').lean(),
//       Tag.find().select('name slug _id').lean(),
//       Post.find(filter)
//         .populate('category', 'name slug')
//         .select('title slug content coverImage publishedAt category')
//         .sort({ publishedAt: -1 })
//         .lean(),
//     ]);

//     categories = fetchedCategories;
//     tags = fetchedTags;
//     posts = fetchedPosts as PostCardType[];

//     // FIX: Determine the name of the active filter for display.
//     if (filter.category) {
//         const cat = categories.find(c => c._id.toString() === filter.category);
//         if (cat) activeFilterName = `Category: ${cat.name}`;
//     } else if (filter.tags) {
//         const tag = tags.find(t => t._id.toString() === filter.tags);
//         if (tag) activeFilterName = `Tag: ${tag.name}`;
//     }

//   } catch (e) {
//     console.error("Failed to fetch blog data:", e);
//     error = "Could not load blog posts. Please try again later.";
//   }

//   return (
//     <div className="bg-gray-50 dark:bg-gray-950">
//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <header className="text-center mb-12">
//           <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">Our Blog</h1>
//           <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
//             Insights, tutorials, and updates from our team.
//           </p>
//         </header>

//         <aside className="mb-12">
//           <BlogFilters 
//             categories={JSON.parse(JSON.stringify(categories))} 
//             tags={JSON.parse(JSON.stringify(tags))} 
//             selectedCategory={searchParams.category} 
//             selectedTag={searchParams.tag} 
//           />
//         </aside>

//         {activeFilterName && (
//             <div className="mb-8 flex justify-between items-center">
//                 <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{activeFilterName}</h2>
//                 <Link href="/blog" className="text-sm text-blue-600 hover:underline">Clear Filter</Link>
//             </div>
//         )}

//         {error && <p className="text-red-500 text-center">{error}</p>}

//         {!error && (
//             posts.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {posts.map((post) => (
//                         <PostCard key={post._id} post={post} />
//                     ))}
//                 </div>
//             ) : (
//                 <div className="text-center py-16">
//                     <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No Posts Found</h3>
//                     <p className="mt-2 text-gray-500 dark:text-gray-400">
//                         There are no posts matching your current filters. Try clearing them to see all posts.
//                     </p>
//                 </div>
//             )
//         )}
//       </div>
//     </div>
//   );
// }


// import connectToDatabase from '@/lib/db';
// import Post from '@/models/Post';
// import Category from '@/models/Category';
// import Tag from '@/models/Tag';
// import Link from 'next/link';
// import BlogFilters from '@/components/blog/BlogFilters';
// import mongoose from 'mongoose';
// import { Suspense } from 'react';

// // --- Type Definitions (Unchanged) ---
// interface PostCardType {
//   _id: string;
//   title: string;
//   slug: string;
//   content: string;
//   coverImage?: string;
//   publishedAt: string;
//   category: {
//     _id: string;
//     name: string;
//     slug: string;
//   } | null;
// }

// // --- PostCard Component (Unchanged) ---
// function PostCard({ post }: { post: PostCardType }) {
//   const generateExcerpt = (markdown: string, length = 150) => {
//     const plainText = markdown
//       .replace(/^#+\s/gm, '')
//       .replace(/(\*\*|__)/g, '')
//       .replace(/(\*|_)/g, '')
//       .replace(/!\[.*?\]\(.*?\)/g, '')
//       .replace(/\[.*?\]\(.*?\)/g, '')
//       .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
//       .replace(/(\r\n|\n|\r)/gm, ' ')
//       .trim();
//     if (plainText.length <= length) return plainText;
//     return plainText.substring(0, length) + '...';
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
//       <Link href={`/blog/${post.slug}`} aria-label={post.title}>
//         <img
//           src={post.coverImage || `https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(post.title)}`}
//           alt={post.title}
//           className="w-full h-48 object-cover"
//           onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found`; }}
//         />
//       </Link>
//       <div className="p-6">
//         {post.category && (
//             <Link href={`/blog?category=${post.category._id}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
//                 {post.category.name}
//             </Link>
//         )}
//         <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3">
//           <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
//             {post.title}
//           </Link>
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
//           {generateExcerpt(post.content)}
//         </p>
//         <div className="flex justify-between items-center mt-4">
//             <span className="text-xs text-gray-500 dark:text-gray-500">
//                 {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
//             </span>
//             <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
//                 Read More &rarr;
//             </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- FIX: New Asynchronous Component to Handle All Dynamic Content ---
// // This component fetches all data (posts, categories, tags) and renders the dynamic parts of the page.
// async function BlogContent({ category, tag }: { category?: string; tag?: string }) {
//   let posts: PostCardType[] = [];
//   let categories: any[] = [];
//   let tags: any[] = [];
//   let activeFilterName: string | null = null;
//   let error: string | null = null;

//   try {
//     await connectToDatabase();
//     const filter: { status: string; category?: string; tags?: string } = { status: 'published' };
    
//     if (category && mongoose.Types.ObjectId.isValid(category)) {
//       filter.category = category;
//     }
//     if (tag && mongoose.Types.ObjectId.isValid(tag)) {
//       filter.tags = tag;
//     }

//     [categories, tags, posts] = await Promise.all([
//       Category.find().select('name slug _id').lean(),
//       Tag.find().select('name slug _id').lean(),
//       Post.find(filter)
//         .populate('category', 'name slug')
//         .select('title slug content coverImage publishedAt category')
//         .sort({ publishedAt: -1 })
//         .lean() as Promise<PostCardType[]>,
//     ]);

//     if (category) {
//         const cat = categories.find(c => c._id.toString() === category);
//         if (cat) activeFilterName = `Category: ${cat.name}`;
//     } else if (tag) {
//         const t = tags.find(t => t._id.toString() === tag);
//         if (t) activeFilterName = `Tag: ${t.name}`;
//     }
//   } catch (e) {
//     console.error("Failed to fetch blog data:", e);
//     error = "Could not load blog content. Please try again later.";
//   }

//   if (error) {
//     return <p className="text-red-500 text-center">{error}</p>;
//   }

//   return (
//     <>
//       <aside className="mb-12">
//         <BlogFilters 
//           categories={JSON.parse(JSON.stringify(categories))} 
//           tags={JSON.parse(JSON.stringify(tags))} 
//           selectedCategory={category} 
//           selectedTag={tag} 
//         />
//       </aside>

//       {activeFilterName && (
//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{activeFilterName}</h2>
//           <Link href="/blog" className="text-sm text-blue-600 hover:underline">Clear Filter</Link>
//         </div>
//       )}

//       {posts.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {posts.map((post) => (
//             <PostCard key={post._id} post={post} />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-16">
//           <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No Posts Found</h3>
//           <p className="mt-2 text-gray-500 dark:text-gray-400">
//             There are no posts matching your current filters.
//           </p>
//         </div>
//       )}
//     </>
//   );
// }

// // --- Loading Skeleton Component (Unchanged) ---
// function BlogContentSkeleton() {
//     return (
//         <>
//             <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-12"></div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {Array.from({ length: 6 }).map((_, i) => (
//                     <div key={i} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl animate-pulse">
//                         <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
//                         <div className="p-6">
//                             <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
//                             <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
//                             <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
//                             <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </>
//     );
// }

// // --- Main Blog Page Component (Refactored) ---
// // This component is now very simple. It only renders the static layout and the Suspense boundary.
// export default function BlogPage({ searchParams }: { searchParams: { category?: string; tag?: string } }) {
//   return (
//     <div className="bg-gray-50 dark:bg-gray-950">
//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <header className="text-center mb-12">
//           <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">Our Blog</h1>
//           <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
//             Insights, tutorials, and updates from our team.
//           </p>
//         </header>
        
//         <Suspense fallback={<BlogContentSkeleton />}>
//           <BlogContent category={searchParams.category} tag={searchParams.tag} />
//         </Suspense>

//       </div>
//     </div>
//   );
// }



//working

// import connectToDatabase from '@/lib/db';
// import Post from '@/models/Post';
// import Category from '@/models/Category';
// import Tag from '@/models/Tag';
// import Link from 'next/link';
// import BlogFilters from '@/components/blog/BlogFilters';
// import mongoose from 'mongoose';
// import { Suspense } from 'react';

// // --- Type Definitions (Unchanged) ---
// interface PostCardType {
//   _id: string;
//   title: string;
//   slug: string;
//   content: string;
//   coverImage?: string;
//   publishedAt: string;
//   category: {
//     _id: string;
//     name: string;
//     slug: string;
//   } | null;
// }

// // --- PostCard Component (Unchanged) ---
// function PostCard({ post }: { post: PostCardType }) {
//   const generateExcerpt = (markdown: string, length = 150) => {
//     const plainText = markdown
//       .replace(/^#+\s/gm, '')
//       .replace(/(\*\*|__)/g, '')
//       .replace(/(\*|_)/g, '')
//       .replace(/!\[.*?\]\(.*?\)/g, '')
//       .replace(/\[.*?\]\(.*?\)/g, '')
//       .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
//       .replace(/(\r\n|\n|\r)/gm, ' ')
//       .trim();
//     if (plainText.length <= length) return plainText;
//     return plainText.substring(0, length) + '...';
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
//       <Link href={`/blog/${post.slug}`} aria-label={post.title}>
//         <img
//           src={post.coverImage || `https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(post.title)}`}
//           alt={post.title}
//           className="w-full h-48 object-cover"
//           onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found`; }}
//         />
//       </Link>
//       <div className="p-6">
//         {post.category && (
//             <Link href={`/blog?category=${post.category._id}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
//                 {post.category.name}
//             </Link>
//         )}
//         <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3">
//           <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
//             {post.title}
//           </Link>
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
//           {generateExcerpt(post.content)}
//         </p>
//         <div className="flex justify-between items-center mt-4">
//             <span className="text-xs text-gray-500 dark:text-gray-500">
//                 {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
//             </span>
//             <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
//                 Read More &rarr;
//             </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- FIX: New Asynchronous Component to Handle All Dynamic Content ---
// // This component fetches all data (posts, categories, tags) and renders the dynamic parts of the page.
// async function BlogContent({ category, tag }: { category?: string; tag?: string }) {
//   let posts: PostCardType[] = [];
//   let categories: any[] = [];
//   let tags: any[] = [];
//   let activeFilterName: string | null = null;
//   let error: string | null = null;

//   try {
//     await connectToDatabase();
//     const filter: { status: string; category?: string; tags?: string } = { status: 'published' };
    
//     if (category && mongoose.Types.ObjectId.isValid(category)) {
//       filter.category = category;
//     }
//     if (tag && mongoose.Types.ObjectId.isValid(tag)) {
//       filter.tags = tag;
//     }

//     [categories, tags, posts] = await Promise.all([
//       Category.find().select('name slug _id').lean(),
//       Tag.find().select('name slug _id').lean(),
//       Post.find(filter)
//         .populate('category', 'name slug')
//         .select('title slug content coverImage publishedAt category')
//         .sort({ publishedAt: -1 })
//         .lean() as Promise<PostCardType[]>,
//     ]);

//     if (category) {
//         const cat = categories.find(c => c._id.toString() === category);
//         if (cat) activeFilterName = `Category: ${cat.name}`;
//     } else if (tag) {
//         const t = tags.find(t => t._id.toString() === tag);
//         if (t) activeFilterName = `Tag: ${t.name}`;
//     }
//   } catch (e) {
//     console.error("Failed to fetch blog data:", e);
//     error = "Could not load blog content. Please try again later.";
//   }

//   if (error) {
//     return <p className="text-red-500 text-center">{error}</p>;
//   }

//   return (
//     <>
//       <aside className="mb-12">
//         <BlogFilters 
//           categories={JSON.parse(JSON.stringify(categories))} 
//           tags={JSON.parse(JSON.stringify(tags))} 
//           selectedCategory={category} 
//           selectedTag={tag} 
//         />
//       </aside>

//       {activeFilterName && (
//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{activeFilterName}</h2>
//           <Link href="/blog" className="text-sm text-blue-600 hover:underline">Clear Filter</Link>
//         </div>
//       )}

//       {posts.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {posts.map((post) => (
//             <PostCard key={post._id} post={post} />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-16">
//           <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No Posts Found</h3>
//           <p className="mt-2 text-gray-500 dark:text-gray-400">
//             There are no posts matching your current filters.
//           </p>
//         </div>
//       )}
//     </>
//   );
// }

// // --- Loading Skeleton Component (Unchanged) ---
// function BlogContentSkeleton() {
//     return (
//         <>
//             <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-12"></div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {Array.from({ length: 6 }).map((_, i) => (
//                     <div key={i} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl animate-pulse">
//                         <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
//                         <div className="p-6">
//                             <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
//                             <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
//                             <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
//                             <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </>
//     );
// }

// // --- Main Blog Page Component (Fixed for Next.js 15) ---
// // Now properly awaits searchParams before accessing its properties
// export default async function BlogPage({ 
//   searchParams 
// }: { 
//   searchParams: Promise<{ category?: string; tag?: string }> 
// }) {
//   // Await searchParams before accessing its properties
//   const resolvedSearchParams = await searchParams;
  
//   return (
//     <div className="bg-gray-50 dark:bg-gray-950">
//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <header className="text-center mb-12">
//           <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">Our Blog</h1>
//           <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
//             Insights, tutorials, and updates from our team.
//           </p>
//         </header>
        
//         <Suspense fallback={<BlogContentSkeleton />}>
//           <BlogContent 
//             category={resolvedSearchParams.category} 
//             tag={resolvedSearchParams.tag} 
//           />
//         </Suspense>

//       </div>
//     </div>
//   );
// }


// //working 1
// import connectToDatabase from '@/lib/db';
// import Post from '@/models/Post';
// import Category from '@/models/Category';
// import Tag from '@/models/Tag';
// import Link from 'next/link';
// import BlogFilters from '@/components/blog/BlogFilters';
// import mongoose from 'mongoose';
// import { Suspense } from 'react';

// // --- Type Definitions (Unchanged) ---
// interface PostCardType {
//   _id: string;
//   title: string;
//   slug: string;
//   content: string;
//   coverImage?: string;
//   publishedAt: string;
//   category: {
//     _id: string;
//     name: string;
//     slug: string;
//   } | null;
// }

// // --- Professional PostCard Component ---
// function PostCard({ post }: { post: PostCardType }) {
//   const generateExcerpt = (markdown: string, length = 150) => {
//     const plainText = markdown
//       .replace(/^#+\s/gm, '')
//       .replace(/(\*\*|__)/g, '')
//       .replace(/(\*|_)/g, '')
//       .replace(/!\[.*?\]\(.*?\)/g, '')
//       .replace(/\[.*?\]\(.*?\)/g, '')
//       .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
//       .replace(/(\r\n|\n|\r)/gm, ' ')
//       .trim();
//     if (plainText.length <= length) return plainText;
//     return plainText.substring(0, length) + '...';
//   };

//   return (
//     <article className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 ease-in-out">
//       <div className="relative overflow-hidden">
//         <Link href={`/blog/${post.slug}`} aria-label={post.title} className="block">
//           <img
//             src={post.coverImage || `https://placehold.co/600x400/F8FAFC/64748B?text=${encodeURIComponent(post.title)}`}
//             alt={post.title}
//             className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
//             onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400/F8FAFC/64748B?text=Image+Not+Found`; }}
//           />
//         </Link>
//         <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//       </div>
      
//       <div className="p-7">
//         {post.category && (
//           <div className="mb-3">
//             <Link 
//               href={`/blog?category=${post.category._id}`} 
//               className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
//             >
//               {post.category.name}
//             </Link>
//           </div>
//         )}
        
//         <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
//           <Link 
//             href={`/blog/${post.slug}`} 
//             className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2"
//           >
//             {post.title}
//           </Link>
//         </h2>
        
//         <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
//           {generateExcerpt(post.content)}
//         </p>
        
//         <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
//           <time 
//             dateTime={post.publishedAt}
//             className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wide"
//           >
//             {new Date(post.publishedAt).toLocaleDateString('en-US', { 
//               year: 'numeric', 
//               month: 'short', 
//               day: 'numeric' 
//             })}
//           </time>
//           <Link 
//             href={`/blog/${post.slug}`} 
//             className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group"
//           >
//             Read Article
//             <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// }

// // --- FIX: New Asynchronous Component to Handle All Dynamic Content ---
// // This component fetches all data (posts, categories, tags) and renders the dynamic parts of the page.
// async function BlogContent({ category, tag }: { category?: string; tag?: string }) {
//   let posts: PostCardType[] = [];
//   let categories: any[] = [];
//   let tags: any[] = [];
//   let activeFilterName: string | null = null;
//   let error: string | null = null;

//   try {
//     await connectToDatabase();
//     const filter: { status: string; category?: string; tags?: string } = { status: 'published' };
    
//     if (category && mongoose.Types.ObjectId.isValid(category)) {
//       filter.category = category;
//     }
//     if (tag && mongoose.Types.ObjectId.isValid(tag)) {
//       filter.tags = tag;
//     }

//     [categories, tags, posts] = await Promise.all([
//       Category.find().select('name slug _id').lean(),
//       Tag.find().select('name slug _id').lean(),
//       Post.find(filter)
//         .populate('category', 'name slug')
//         .select('title slug content coverImage publishedAt category')
//         .sort({ publishedAt: -1 })
//         .lean() as Promise<PostCardType[]>,
//     ]);

//     if (category) {
//         const cat = categories.find(c => c._id.toString() === category);
//         if (cat) activeFilterName = `Category: ${cat.name}`;
//     } else if (tag) {
//         const t = tags.find(t => t._id.toString() === tag);
//         if (t) activeFilterName = `Tag: ${t.name}`;
//     }
//   } catch (e) {
//     console.error("Failed to fetch blog data:", e);
//     error = "Could not load blog content. Please try again later.";
//   }

//   if (error) {
//     return <p className="text-red-500 text-center">{error}</p>;
//   }

//   return (
//     <>
//       <aside className="mb-16">
//         <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
//           <BlogFilters 
//             categories={JSON.parse(JSON.stringify(categories))} 
//             tags={JSON.parse(JSON.stringify(tags))} 
//             selectedCategory={category} 
//             selectedTag={tag} 
//           />
//         </div>
//       </aside>

//       {activeFilterName && (
//         <div className="mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-8 border-b border-gray-200 dark:border-gray-800">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{activeFilterName}</h2>
//             <p className="text-gray-600 dark:text-gray-400">
//               {posts.length} {posts.length === 1 ? 'article' : 'articles'} found
//             </p>
//           </div>
//           <Link 
//             href="/blog" 
//             className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
//           >
//             <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//             Clear Filters
//           </Link>
//         </div>
//       )}

//       {posts.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//           {posts.map((post) => (
//             <PostCard key={post._id} post={post} />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-24">
//           <div className="max-w-md mx-auto">
//             <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No Articles Found</h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               We couldn't find any articles matching your current filters. Try adjusting your search criteria or browse all articles.
//             </p>
//             <Link 
//               href="/blog" 
//               className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
//             >
//               View All Articles
//             </Link>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// // --- Professional Loading Skeleton Component ---
// function BlogContentSkeleton() {
//     return (
//         <>
//             {/* Filter Skeleton */}
//             <div className="mb-16">
//               <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
//                 <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
//               </div>
//             </div>
            
//             {/* Posts Grid Skeleton */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//                 {Array.from({ length: 6 }).map((_, i) => (
//                     <article key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden animate-pulse">
//                         <div className="w-full h-56 bg-gray-200 dark:bg-gray-800"></div>
//                         <div className="p-7">
//                             <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-20 mb-4"></div>
//                             <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-4/5 mb-3"></div>
//                             <div className="space-y-2 mb-6">
//                                 <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
//                                 <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
//                             </div>
//                             <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
//                                 <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
//                                 <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
//                             </div>
//                         </div>
//                     </article>
//                 ))}
//             </div>
//         </>
//     );
// }

// // --- Main Blog Page Component (Fixed for Next.js 15) ---
// // Now properly awaits searchParams before accessing its properties
// export default async function BlogPage({ 
//   searchParams 
// }: { 
//   searchParams: Promise<{ category?: string; tag?: string }> 
// }) {
//   // Await searchParams before accessing its properties
//   const resolvedSearchParams = await searchParams;
  
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
//       <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
//         {/* Professional Header */}
//         <header className="text-center mb-20">
//           <div className="max-w-3xl mx-auto">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
//               Knowledge Hub
//             </h1>
//             <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
//               Discover insights, industry trends, and expert perspectives to help you stay ahead in your field.
//             </p>
//           </div>
//           <div className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
//         </header>
        
//         <Suspense fallback={<BlogContentSkeleton />}>
//           <BlogContent 
//             category={resolvedSearchParams.category} 
//             tag={resolvedSearchParams.tag} 
//           />
//         </Suspense>

//       </div>
//     </div>
//   );
// }



// import connectToDatabase from '@/lib/db';
// import Post from '@/models/Post';

// interface PostType {
//   _id: string;
//   title: string;
//   content: string;
//   coverImage: string | null;
//   slug: string;
//   createdAt: string;
// }

// async function getPosts() {
//   try {
//     await connectToDatabase();
//     const posts = await Post.find({ status: 'published' })
//       .select('title content coverImage slug createdAt')
//       .sort({ createdAt: -1 })
//       .lean();
//     return {
//       posts: JSON.parse(JSON.stringify(posts)),
//       error: null,
//     };
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     return {
//       posts: [],
//       error: 'Failed to load posts. Please try refreshing the page.',
//     };
//   }
// }

// export default async function BlogPage() {
//   const { posts, error } = await getPosts();

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <h1 className="text-3xl font-bold mb-6">Blog</h1>
//       {error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <div className="space-y-8">
//           {posts.length > 0 ? (
//             posts.map((post) => (
//               <div key={post._id} className="border-b pb-4">
//                 {post.coverImage && (
//                   <img
//                     src={post.coverImage}
//                     alt={post.title}
//                     className="w-full h-64 object-cover mb-4"
//                   />
//                 )}
//                 <h2 className="text-2xl font-semibold">{post.title}</h2>
//                 <p className="text-gray-600">{post.content.slice(0, 200)}...</p>
//                 <a href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
//                   Read More
//                 </a>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No posts found.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';

interface PostType {
  _id: string;
  title: string;
  content: string;
  coverImage: string | null;
  slug: string;
  createdAt: string;
}

async function getPosts() {
  try {
    await connectToDatabase();
    const posts = await Post.find({ status: 'published' })
      .select('title content coverImage slug createdAt')
      .sort({ createdAt: -1 })
      .lean();
    return {
      posts: JSON.parse(JSON.stringify(posts)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      posts: [],
      error: 'Failed to load posts. Please try refreshing the page.',
    };
  }
}

export default async function BlogPage() {
  const { posts, error } = await getPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Our Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Discover insights, stories, and ideas that matter
            </p>
            <div className="w-24 h-1 bg-white mx-auto rounded-full opacity-80"></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        {error ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {posts.length > 0 ? (
              <>
                {/* Stats Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{posts.length}</div>
                        <div className="text-sm text-gray-500 uppercase tracking-wide">Articles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">∞</div>
                        <div className="text-sm text-gray-500 uppercase tracking-wide">Ideas</div>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center text-gray-400">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-sm">Knowledge Base</span>
                    </div>
                  </div>
                </div>

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post: PostType, index: number) => (
                    <article 
                      key={post._id} 
                      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300 ${
                        index === 0 ? 'md:col-span-2 lg:col-span-3' : ''
                      }`}
                    >
                      {/* Featured Post Layout */}
                      {index === 0 ? (
                        <div className="md:flex">
                          {post.coverImage && (
                            <div className="md:w-1/2">
                              <div className="relative h-64 md:h-full overflow-hidden">
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4">
                                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Featured
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className={`p-8 ${post.coverImage ? 'md:w-1/2' : 'w-full'} flex flex-col justify-center`}>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                              {post.title}
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                              {post.content.slice(0, 300)}...
                            </p>
                            <a 
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group/link"
                            >
                              Read Full Article
                              <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      ) : (
                        /* Regular Post Layout */
                        <>
                          {post.coverImage && (
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                              {post.content.slice(0, 150)}...
                            </p>
                            <a 
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group/link"
                            >
                              Read More
                              <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </a>
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Posts Yet</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We're working on creating amazing content for you. Check back soon for our latest articles and insights!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}