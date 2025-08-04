// import { notFound, redirect } from 'next/navigation';
// import { revalidatePath } from 'next/cache';
// import PostForm from '@/components/forms/PostForm';
// import { getCurrentUser } from '@/lib/getCurrentUser';

// export default async function EditPostPage({ params }: { params: { id: string } }) {
//   const user = await getCurrentUser();
//   if (!user) {
//     redirect('/sign-in');
//   }

//   const [postResponse, categoriesResponse, tagsResponse] = await Promise.all([
//     fetch(`http://localhost:3000/api/admin/posts/${params.id}`, {
//       headers: { 'Content-Type': 'application/json' },
//     }),
//     fetch('http://localhost:3000/api/admin/categories', {
//       headers: { 'Content-Type': 'application/json' },
//     }),
//     fetch('http://localhost:3000/api/admin/tags', {
//       headers: { 'Content-Type': 'application/json' },
//     }),
//   ]);

//   if (!postResponse.ok) {
//     notFound();
//   }

//   const post = await postResponse.json();
//   const categories = await categoriesResponse.json();
//   const tags = await tagsResponse.json();

//   if (!post || !categories || !tags) {
//     notFound();
//   }

//   async function updatePost(formData: FormData) {
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
//       const response = await fetch(`http://localhost:3000/api/admin/posts/${params.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           title: rawData.title,
//           content: rawData.content,
//           status: rawData.status,
//           category: rawData.category,
//           tags: rawData.tags,
//           coverImage: rawData.coverImage || null,
//           publishedAt: rawData.status === 'published' && !post.publishedAt
//             ? new Date()
//             : rawData.status === 'scheduled' && rawData.publishedAt
//             ? new Date(rawData.publishedAt)
//             : rawData.status === 'draft'
//             ? null
//             : undefined,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         return { success: false, message: errorData.error || 'Failed to update post.' };
//       }

//       const updatedPost = await response.json();
//       revalidatePath('/admin/posts');
//       revalidatePath(`/blog/${updatedPost.post.slug}`);
//       revalidatePath(`/admin/posts/[id]/edit`, 'page');

//       return { success: true, message: 'Post updated successfully.', redirect: '/admin/posts' };
//     } catch (error) {
//       console.error('Error updating post:', error);
//       return { success: false, message: 'An unexpected error occurred while updating the post.' };
//     }
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
//       <PostForm
//         categories={categories}
//         tags={tags}
//         action={updatePost}
//         submitLabel="Update Post"
//         defaultValues={{
//           ...post,
//           category: post.category?._id,
//           tags: post.tags.map((tag: any) => tag._id),
//         }}
//       />
//     </div>
//   );
// }

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import PostForm from '@/components/forms/PostForm';
import { updatePostAction } from '@/lib/actions';

interface PostType {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  coverImage: string | null;
  publishedAt: string | null;
  slug: string;
}

interface CategoryType {
  _id: string;
  name: string;
}

interface TagType {
  _id: string;
  name: string;
}

async function getPostAndCategories(id: string) {
  try {
    await connectToDatabase();
    const [post, categories, tags] = await Promise.all([
      Post.findById(id).select('title content category tags status coverImage publishedAt slug').lean(),
      Category.find({}).select('name _id').lean(),
      Tag.find({}).select('name _id').lean(),
    ]);
    if (!post) {
      return { post: null, categories: [], tags: [], error: 'Post not found.' };
    }
    return {
      post: JSON.parse(JSON.stringify(post)),
      categories: JSON.parse(JSON.stringify(categories)),
      tags: JSON.parse(JSON.stringify(tags)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching post or categories:', error);
    return { post: null, categories: [], tags: [], error: 'Failed to fetch post or categories.' };
  }
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { id } = await params; // Await params to access id
  const { post, categories, tags, error } = await getPostAndCategories(id);

  if (!post || error) {
    redirect('/admin/posts');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <PostForm
          action={updatePostAction.bind(null, id)}
          submitLabel="Update Post"
          categories={categories}
          tags={tags}
          defaultValues={{
            _id: post._id,
            title: post.title,
            content: post.content,
            category: post.category,
            tags: post.tags || [],
            status: post.status,
            coverImage: post.coverImage || '',
            publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
          }}
        />
      )}
    </div>
  );
}