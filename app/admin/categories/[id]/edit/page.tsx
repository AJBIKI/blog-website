import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import CategoryForm from '@/components/forms/CategoryForm';
import { updateCategoryAction } from '@/lib/actions';

interface CategoryType {
  _id: string;
  name: string;
}

async function getCategory(id: string) {
  try {
    await connectToDatabase();
    const category = await Category.findById(id).select('name _id').lean();
    if (!category) {
      return { category: null, error: 'Category not found.' };
    }
    return {
      category: JSON.parse(JSON.stringify(category)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { category: null, error: 'Failed to fetch category.' };
  }
}

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { category, error } = await getCategory(params.id);

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
          action={updateCategoryAction.bind(null, params.id)}
          submitLabel="Update Category"
          initialValues={{ name: category.name }}
        />
      )}
    </div>
  );
}