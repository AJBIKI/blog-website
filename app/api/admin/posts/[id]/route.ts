import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import { slugify } from '@/lib/slugify';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty.'),
  content: z.string().min(1, 'Content cannot be empty.'),
  category: z.string().min(1, 'A category must be selected.'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  coverImage: z.string().url().optional().or(z.literal('')).nullable(),
  publishedAt: z.date().nullable(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }>}) {
  const { userId } =await  auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const {id}=await params

  try {
    await connectToDatabase();
    const post = await Post.findOne({ _id:id, author: userId })
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .lean();

    if (!post) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } =await  auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
    const {id}=await params

  try {
    await connectToDatabase();
    const body = await req.json();
    const validationResult = postSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, content, status, category, tags, coverImage, publishedAt } = validationResult.data;

    const updatePayload: any = {
      title,
      slug: slugify(title),
      content,
      status,
      category,
      tags: tags || [],
      coverImage: coverImage || null,
      publishedAt,
    };

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, author: userId },
      updatePayload,
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Post updated successfully', post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
    const {id}=await params

  try {
    await connectToDatabase();
    const deletedPost = await Post.findOneAndDelete({ _id:id, author: userId });

    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}