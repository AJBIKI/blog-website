// import { redirect } from 'next/navigation';
// import { revalidatePath } from 'next/cache';
// import PostForm from '@/components/forms/PostForm';
// import { getCurrentUser } from '@/lib/getCurrentUser';

// export default async function NewPostPage() {
//   const user = await getCurrentUser();
//   if (!user) {
//     redirect('/sign-in');
//   }

//   const [categoriesResponse, tagsResponse] = await Promise.all([
//     fetch('http://localhost:3000/api/admin/categories', {
//       headers: { 'Content-Type': 'application/json' },
//     }),
//     fetch('http://localhost:3000/api/admin/tags', {
//       headers: { 'Content-Type': 'application/json' },
//     }),
//   ]);

//   if (!categoriesResponse.ok || !tagsResponse.ok) {
//     throw new Error('Failed to fetch categories or tags');
//   }

//   const categories = await categoriesResponse.json();
//   const tags = await tagsResponse.json();

//   async function createPost(formData: FormData) {
//     'use server';

//     const user = await getCurrentUser();
//     if (!user) {
//       return { success: false, message: 'Unauthorized: You must be logged in.' };
//     }

//     const rawData = {
//       title: formData.get('title') as string,
//       content: formData.get('content') as string,
//       category: formData.get('category') as string,
//       tags: formData.getAll('tags') as string[],
//       status: formData.get('status') as string,
//       coverImage: formData.get('coverImage') as string,
//       publishedAt: formData.get('publishedAt') as string,
//     };

//     try {
//       const response = await fetch('http://localhost:3000/api/admin/posts', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           title: rawData.title,
//           content: rawData.content,
//           status: rawData.status,
//           category: rawData.category,
//           tags: rawData.tags,
//           coverImage: rawData.coverImage || null,
//           publishedAt: rawData.status === 'published'
//             ? new Date()
//             : rawData.status === 'scheduled' && rawData.publishedAt
//             ? new Date(rawData.publishedAt)
//             : null,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         return { success: false, message: errorData.error || 'Failed to create post.' };
//       }

//       revalidatePath('/admin/posts');
//       revalidatePath('/blog');

//       return { success: true, message: 'Post created successfully.', redirect: '/admin/posts' };
//     } catch (error) {
//       console.error('Error creating post:', error);
//       return { success: false, message: 'An unexpected error occurred while creating the post.' };
//     }
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
//       <PostForm
//         categories={categories}
//         tags={tags}
//         action={createPost}
//         submitLabel="Create Post"
//       />
//     </div>
//   );
// }

//fully working

// import { redirect } from 'next/navigation';
// import { getCurrentUser } from '@/lib/getCurrentUser';
// import connectToDatabase from '@/lib/db';
// import Category from '@/models/Category';
// import Tag from '@/models/Tag';
// import PostForm from '@/components/forms/PostForm';
// import { createPostAction } from '@/lib/actions';

// interface CategoryType {
//   _id: string;
//   name: string;
// }

// interface TagType {
//   _id: string;
//   name: string;
// }

// async function getCategoriesAndTags() {
//   try {
//     await connectToDatabase();
//     const [categories, tags] = await Promise.all([
//       Category.find({}).select('name _id').lean(),
//       Tag.find({}).select('name _id').lean(),
//     ]);
//     return {
//       categories: JSON.parse(JSON.stringify(categories)),
//       tags: JSON.parse(JSON.stringify(tags)),
//       error: null,
//     };
//   } catch (error) {
//     console.error('Error fetching categories or tags:', error);
//     return {
//       categories: [],
//       tags: [],
//       error: 'Failed to fetch categories or tags. Please try refreshing the page.',
//     };
//   }
// }

// export default async function NewPostPage() {
//   const user = await getCurrentUser();
//   if (!user) {
//     redirect('/sign-in');
//   }

//   const { categories, tags, error } = await getCategoriesAndTags();

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
//       {error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <PostForm
//           categories={categories}
//           tags={tags}
//           action={createPostAction}
//           submitLabel="Create Post"
//         />
//       )}
//     </div>
//   );
// }




import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import PostForm from '@/components/forms/PostForm';
import { createPostAction } from '@/lib/actions';
import { PostFormCategory, PostFormTag } from '@/types/database';

async function getCategoriesAndTags() {
  try {
    await connectToDatabase();
    const [categoriesResult, tagsResult] = await Promise.all([
      Category.find({}).select('_id name').lean(),
      Tag.find({}).select('_id name').lean(),
    ]);
    
    const categories = categoriesResult as unknown as PostFormCategory[];
    const tags = tagsResult as unknown as PostFormTag[];
    
    return {
      categories: JSON.parse(JSON.stringify(categories)),
      tags: JSON.parse(JSON.stringify(tags)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching categories or tags:', error);
    return {
      categories: [] as PostFormCategory[],
      tags: [] as PostFormTag[],
      error: 'Failed to fetch categories or tags. Please try refreshing the page.',
    };
  }
}

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { categories, tags, error } = await getCategoriesAndTags();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <PostForm
          categories={categories}
          tags={tags}
          action={createPostAction}
          submitLabel="Create Post"
        />
      )}
    </div>
  );
}