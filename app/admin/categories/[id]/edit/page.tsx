import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import CategoryForm from '@/components/forms/CategoryForm';
import { updateCategoryAction } from '@/lib/actions';
import { LeanCategory } from '@/types/database';

async function getCategory(id: string) {
  try {
    await connectToDatabase();
    const categoryResult = await Category.findById(id)
      .select('_id name')
      .lean();

    if (!categoryResult) {
      return { category: null, error: 'Category not found.' };
    }
    
    const category = categoryResult as unknown as LeanCategory;
    return {
      category: JSON.parse(JSON.stringify(category)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { category: null, error: 'Failed to fetch category.' };
  }
}

// export default async function EditCategoryPage({ params }: { params: { id: string } })

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> })

{
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { id } = await params;
const { category, error } = await getCategory(id);
  // const { category, error } = await getCategory(await id);

  if (!category || error) {
    redirect('/admin/categories');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <CategoryForm
          action={updateCategoryAction.bind(null, id)}
          submitLabel="Update Category"
          initialValues={{ name: category.name }}
        />
      )}
    </div>
  );
}