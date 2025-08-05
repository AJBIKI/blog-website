import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import  connectToDatabase  from '@/lib/db';
import Post from '@/models/Post';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import PostForm from '@/components/forms/PostForm';
import { slugify } from '@/lib/slugify';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { PostFormCategory, PostFormTag, PopulatedPost } from '@/types/database';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user is admin
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }

  await connectToDatabase();

  const {id}=await params

  // Fetch post, categories, and tags
  const [postResult, categoriesResult, tagsResult] = await Promise.all([
    Post.findOne({ slug: id })
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .lean(),
    Category.find().select('_id name').lean(),
    Tag.find().select('_id name').lean(),
  ]);

  const post = postResult as unknown as PopulatedPost | null;
  const categories = categoriesResult as unknown as PostFormCategory[];
  const tags = tagsResult as unknown as PostFormTag[];

  if (!post) {
    notFound();
  }

  // Handle form submission
  async function updatePost(formData: FormData) {
    'use server';

    try {
      await connectToDatabase();

      const title = formData.get('title') as string;
      const content = formData.get('content') as string;
      const status = formData.get('status') as string;
      const category = formData.get('category') as string;
      const tags = formData.getAll('tags') as string[];
      const coverImage = formData.get('coverImage') as string | null;

      const updatedPost = await Post.findOneAndUpdate(
        { slug:id },
        {
          title,
          slug: slugify(title),
          content,
          status,
          category,
          tags,
          coverImage: coverImage || null,
          publishedAt: status === 'published' ? new Date() : undefined,
        },
        { new: true }
      );

      if (!updatedPost) {
        return { success: false, message: 'Post not found' };
      }

      // Redirect to posts list on success
      redirect('/admin/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, message: 'Failed to update post' };
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Edit Post</h1>
      <PostForm
        categories={categories}
        tags={tags}
        action={updatePost}
        submitLabel="Update Post"
        defaultValues={{
          title: post.title,
          content: post.content,
          status: post.status,
          category: post.category?._id.toString(),
          tags: post.tags.map((tag: any) => tag._id.toString()),
          coverImage: post.coverImage || '',
        }}
      />
    </div>
  );
}