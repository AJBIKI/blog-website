// import { getAuth } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import connectToDatabase from '@/lib/db';
// import Post from '@/models/Post';
// import { slugify } from '@/lib/slugify';
// import { z } from 'zod';

// const createPostSchema = z.object({
//   title: z.string().min(1, 'Title cannot be empty.'),
//   content: z.string().min(1, 'Content cannot be empty.'),
//   category: z.string().min(1, 'A category must be selected.'),
//   tags: z.array(z.string()).optional(),
//   status: z.enum(['draft', 'published', 'scheduled']),
//   coverImage: z.string().url().optional().or(z.literal('')).nullable(),
//   publishedAt: z.date().nullable(),
// });

// export async function POST(req: Request) {
//   const { userId } = getAuth();
//   if (!userId) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     await connectToDatabase();
//     const body = await req.json();
//     const validationResult = createPostSchema.safeParse(body);

//     if (!validationResult.success) {
//       return NextResponse.json(
//         { error: validationResult.error.flatten().fieldErrors },
//         { status: 400 }
//       );
//     }

//     const { title, content, status, category, tags, coverImage, publishedAt } = validationResult.data;

//     const post = new Post({
//       title,
//       slug: slugify(title),
//       content,
//       status,
//       category,
//       tags: tags || [],
//       coverImage: coverImage || null,
//       author: userId,
//       publishedAt,
//     });

//     await post.save();

//     return NextResponse.json(
//       { message: 'Post created successfully', post },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error('Error creating post:', error);
//     if (error.code === 11000) {
//       return NextResponse.json(
//         { error: 'A post with this title already exists. Please choose a different title.' },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
//   }
// }

// export async function GET(req: Request) {
//   const { userId } = auth();
//   if (!userId) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     await connectToDatabase();
//     const posts = await Post.find({ author: userId })
//       .populate('category', 'name')
//       .select('title status category createdAt slug _id')
//       .sort({ createdAt: -1 })
//       .lean();
//     return NextResponse.json(posts, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
//   }
// }




import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import { slugify } from '@/lib/slugify';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty.'),
  content: z.string().min(1, 'Content cannot be empty.'),
  category: z.string().min(1, 'A category must be selected.'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  coverImage: z.string().url().optional().or(z.literal('')).nullable(),
  publishedAt: z.date().nullable().optional(),
});

export async function POST(req: Request) {
  const { userId } = await auth(); // ✅ Use `auth()` in App Router
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await req.json();
    const validationResult = createPostSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, content, status, category, tags, coverImage, publishedAt } = validationResult.data;

    const post = new Post({
      title,
      slug: slugify(title),
      content,
      status,
      category,
      tags: tags || [],
      coverImage: coverImage || null,
      author: userId,
      publishedAt: publishedAt || (status === 'published' ? new Date() : null),
    });

    await post.save();

    return NextResponse.json(
      { message: 'Post created successfully', post },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating post:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A post with this title already exists. Please choose a different title.' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function GET() {
  const { userId } =await  auth(); // ✅ Same here
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const posts = await Post.find({ author: userId })
      .populate('category', 'name')
      .select('title status category createdAt slug _id')
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
