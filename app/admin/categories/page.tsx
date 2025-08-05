//  'use server';


// import connectToDatabase from '@/lib/db';
// import Category from '@/models/Category';
// import CategoryForm from '@/components/forms/CategoryForm';
// import { slugify } from '@/lib/slugify';

// export default async function CategoriesPage() {
//   await connectToDatabase();

//   // Fetch all categories with sorting
//   const categories = await Category.find()
//     .select('name slug createdAt')
//     .sort({ createdAt: -1 })
//     .lean();

//   // Handle category creation
//   async function createCategory(formData: FormData) {
   

//     try {
//       await connectToDatabase();

//       const name = formData.get('name') as string;

   

//       const newCategory = new Category({
//         name,
//         slug: slugify(name),
//       });

//       await newCategory.save();
//       return { success: true, message: 'Category created successfully' };
//     } catch (error) {
//       console.error('Error creating category:', error);
//       return { success: false, message: 'Failed to create category' };
//     }
//   }

//   // Handle category update
//   async function updateCategory(formData: FormData) {
//     'use server';

//     try {
//       await connectToDatabase();

//       const id = formData.get('id') as string;
//       const name = formData.get('name') as string;

//       await Category.findByIdAndUpdate(id, {
//         name,
//         slug: slugify(name),
//       });
//       return { success: true, message: 'Category updated successfully' };
//     } catch (error) {
//       console.error('Error updating category:', error);
//       return { success: false, message: 'Failed to update category' };
//     }
//   }

//   // Handle category deletion
//   async function deleteCategory(formData: FormData) {
//     'use server';

//     try {
//       await connectToDatabase();

//       const id = formData.get('id') as string;

//       await Category.findByIdAndDelete(id);
//       return { success: true, message: 'Category deleted successfully' };
//     } catch (error) {
//       console.error('Error deleting category:', error);
//       return { success: false, message: 'Failed to delete category' };
//     }
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-white">Manage Categories</h1>
//           <p className="text-gray-400 mt-2">
//             Create and manage categories for your blog posts
//           </p>
//         </div>
//         <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-600">
//           <span className="text-gray-300 text-sm">Total Categories: </span>
//           <span className="text-white font-semibold">{categories.length}</span>
//         </div>
//       </div>

//       {/* Category Creation Form */}
//       <div className="bg-gray-900 shadow-xl rounded-lg p-6 border border-gray-700">
//         <div className="flex items-center mb-6">
//           <div className="bg-blue-600 p-2 rounded-lg mr-3">
//             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-semibold text-white">Add New Category</h2>
//         </div>
//         <CategoryForm action={createCategory} submitLabel="Create Category" />
//       </div>

//       {/* Categories Table */}
//       <div className="bg-gray-900 shadow-xl rounded-lg border border-gray-700 overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-700">
//           <h3 className="text-lg font-semibold text-white flex items-center">
//             <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//             </svg>
//             All Categories
//           </h3>
//         </div>
        
//         {categories.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr className="bg-gray-800 text-gray-300 uppercase text-sm border-b border-gray-700">
//                   <th className="py-4 px-6 text-left font-semibold">Name</th>
//                   <th className="py-4 px-6 text-left font-semibold">Slug</th>
//                   <th className="py-4 px-6 text-left font-semibold">Created</th>
//                   <th className="py-4 px-6 text-center font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700">
//                 {categories.map((category: any, index: number) => (
//                   <tr 
//                     key={category._id} 
//                     className={`hover:bg-gray-800 transition-colors duration-150 ${
//                       index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'
//                     }`}
//                   >
//                     <td className="py-4 px-6">
//                       <div className="flex items-center">
//                         <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
//                         <span className="text-white font-medium">{category.name}</span>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="text-gray-400 font-mono text-sm bg-gray-800 px-2 py-1 rounded">
//                         {category.slug}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="text-gray-400 text-sm">
//                         {new Date(category.createdAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'short',
//                           day: 'numeric'
//                         })}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center justify-center space-x-3">
//                         <CategoryForm
//                           action={updateCategory}
//                           submitLabel="Update"
//                           defaultValues={{ id: category._id, name: category.name }}
//                           isEdit
//                         />
//                         <form action={deleteCategory} className="inline">
//                           <input type="hidden" name="id" value={category._id} />
//                           <button
//                             type="submit"
//                             className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
//                             onClick={(e) => {
//                               if (!confirm(`Are you sure you want to delete "${category.name}" category? This action cannot be undone.`)) {
//                                 e.preventDefault();
//                               }
//                             }}
//                           >
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                             Delete
//                           </button>
//                         </form>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//             </svg>
//             <h3 className="text-lg font-medium text-gray-400 mb-2">No categories found</h3>
//             <p className="text-gray-500">Create your first category to get started.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


//working just deployment problem


// import Link from 'next/link';
// import { redirect } from 'next/navigation';
// import { getCurrentUser } from '@/lib/getCurrentUser';
// import connectToDatabase from '@/lib/db';
// import Category from '@/models/Category';
// import { deleteCategoryAction } from '@/lib/actions';

// interface CategoryType {
//   _id: string;
//   name: string;
//   slug: string;
// }

// async function getCategories() {
//   try {
//   await connectToDatabase();
//   const categories: CategoryType[] = await Category.find().lean(); // Add type annotation
//     return {
//       categories: JSON.parse(JSON.stringify(categories)),
//       error: null,
//     };
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return {
//       categories: [],
//       error: 'Failed to load categories. Please try refreshing the page.',
//     };
//   }
// }

// export default async function CategoriesPage() {
//   const user = await getCurrentUser();
//   if (!user) {
//     redirect('/sign-in');
//   }

//   const { categories, error } = await getCategories();

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Categories</h1>
//         <Link
//           href="/admin/categories/new"
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           Create New Category
//         </Link>
//       </div>

//       {error && <p className="text-red-500">{error}</p>}

//       {!error && (
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead className="bg-gray-50 border-b">
//                 <tr className="text-gray-600 uppercase text-sm">
//                   <th className="py-3 px-6 text-left">Name</th>
//                   <th className="py-3 px-6 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="text-gray-700">
//                 {categories.length > 0 ? (
//                   categories.map((category) => (
//                     <tr key={category._id} className="border-b hover:bg-gray-50">
//                       <td className="py-4 px-6 font-medium">{category.name}</td>
//                       <td className="py-4 px-6 text-center space-x-4">
//                         <Link
//                           href={`/admin/categories/${category._id}/edit`}
//                           className="text-blue-600 hover:underline"
//                         >
//                           Edit
//                         </Link>
//                         <form
//                           action={deleteCategoryAction.bind(null, category._id)}
//                           className="inline"
//                         >
//                           <button
//                             type="submit"
//                             className="text-red-600 hover:underline disabled:text-gray-400"
//                           >
//                             Delete
//                           </button>
//                         </form>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={2} className="py-6 px-6 text-center text-gray-500">
//                       No categories found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import { getCurrentUser } from '@/lib/getCurrentUser';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import Post from '@/models/Post';

// Redefine based on ICategory from app/models/Category.ts
interface LeanCategoryType {
  _id: string;
  name?: string;
  slug?: string;
  description?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  await connectToDatabase();
  const categoriesData = await Category.find().select('name slug description createdAt updatedAt').lean();
  const categories: LeanCategoryType[] = JSON.parse(JSON.stringify(categoriesData));

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
      <Link
        href="/admin/categories/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Add New Category
      </Link>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{category.name}</td>
                <td className="py-4 px-6 text-center space-x-4">
                  <Link
                    href={`/admin/categories/${category._id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <form
                    action={async (formData: FormData) => {
                      'use server';
                      const user = await getCurrentUser();
                      if (!user) {
                        return;
                      }

                      try {
                        await connectToDatabase();
                        const deletedCategory = await Category.findOneAndDelete({ _id: category._id });

                        if (deletedCategory) {
                          // Update posts that reference this category to have null category
                          await Post.updateMany({ category: category._id }, { $set: { category: null } });
                        }

                        revalidatePath('/admin/categories');
                        revalidatePath('/admin/posts');
                        revalidatePath('/blog');
                      } catch (error) {
                        console.error('Error deleting category:', error);
                      }
                    }}
                    className="inline"
                  >
                    <button
                      type="submit"
                      className="text-red-600 hover:underline disabled:text-gray-400"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="py-4 px-6 text-center">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}