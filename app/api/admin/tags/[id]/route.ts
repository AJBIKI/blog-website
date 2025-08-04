import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import  connectToDatabase  from '@/lib/db';
import Tag from '@/models/Tag';
import { slugify } from '@/lib/slugify';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId } =await  auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const body = await req.json();
    const { name } = body;

    // Validate required field
    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    // Check for existing tag with same name
    const existingTag = await Tag.findOne({ name, _id: { $ne: params.id } });
    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag name already exists' },
        { status: 409 }
      );
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      params.id,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );

    if (!updatedTag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Tag updated successfully', tag: updatedTag },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const deletedTag = await Tag.findByIdAndDelete(params.id);

    if (!deletedTag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Tag deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}