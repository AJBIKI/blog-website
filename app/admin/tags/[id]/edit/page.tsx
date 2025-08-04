import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Tag from '@/models/Tag';
import TagForm from '@/components/forms/TagForm';
import { updateTagAction } from '@/lib/actions';

interface TagType {
  _id: string;
  name: string;
}

async function getTag(id: string) {
  try {
    await connectToDatabase();
    const tag = await Tag.findById(id).select('name _id').lean();
    if (!tag) {
      return { tag: null, error: 'Tag not found.' };
    }
    return {
      tag: JSON.parse(JSON.stringify(tag)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching tag:', error);
    return { tag: null, error: 'Failed to fetch tag.' };
  }
}

export default async function EditTagPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { tag, error } = await getTag(params.id);

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
          action={updateTagAction.bind(null, params.id)}
          submitLabel="Update Tag"
          initialValues={{ name: tag.name }}
        />
      )}
    </div>
  );
}