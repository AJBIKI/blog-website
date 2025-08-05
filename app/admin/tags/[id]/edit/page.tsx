import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Tag from '@/models/Tag';
import TagForm from '@/components/forms/TagForm';
import { updateTagAction } from '@/lib/actions';
import { LeanTag } from '@/types/database';

async function getTag(id: string) {
  try {
    await connectToDatabase();
    const tagResult = await Tag.findById(id).select('_id name').lean();
    if (!tagResult) {
      return { tag: null, error: 'Tag not found.' };
    }
    
    const tag = tagResult as unknown as LeanTag;
    return {
      tag: JSON.parse(JSON.stringify(tag)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching tag:', error);
    return { tag: null, error: 'Failed to fetch tag.' };
  }
}

// export default async function EditTagPage({ params }: { params: { id: string } })

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> })

{
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

   const { id } = await params;
  const { tag, error } = await getTag(id);

  if (!tag || error) {
    redirect('/admin/tags');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Tag</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <TagForm
          action={updateTagAction.bind(null, id)}
          submitLabel="Update Tag"
          initialValues={{ name: tag.name }}
        />
      )}
    </div>
  );
}