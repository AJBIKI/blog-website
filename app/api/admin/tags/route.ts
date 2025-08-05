import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Tag from '@/models/Tag';
import { slugify } from '@/lib/slugify';

export async function POST(req: Request) {
  const { userId } =await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }

    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return NextResponse.json({ error: 'Tag name already exists' }, { status: 409 });
    }

    const tag = new Tag({
      name,
      slug: slugify(name),
    });

    await tag.save();

    return NextResponse.json(
      { message: 'Tag created successfully', tag },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { userId } =await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const tags = await Tag.find().select('name slug').lean();
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}