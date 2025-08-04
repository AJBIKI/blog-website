import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import TagForm from '@/components/forms/TagForm';
import { createTagAction } from '@/lib/actions';

export default async function NewTagPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Create New Tag</h1>
      <TagForm action={createTagAction} submitLabel="Create Tag" />
    </div>
  );
}