import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import CategoryForm from '@/components/forms/CategoryForm';
import { createCategoryAction } from '@/lib/actions';

export default async function NewCategoryPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Create New Category</h1>
      <CategoryForm action={createCategoryAction} submitLabel="Create Category" />
    </div>
  );
}