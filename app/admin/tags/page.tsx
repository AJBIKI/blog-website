//     'use server';


// import  connectToDatabase  from '@/lib/db';
// import Tag from '@/models/Tag';
// import TagForm from '@/components/forms/TagForm';
// import { slugify } from '@/lib/slugify';

// export default async function TagsPage() {
//   await connectToDatabase();

//   // Fetch all tags
//   const tags = await Tag.find().select('name slug').lean();

//   // Handle tag creation
//   async function createTag(formData: FormData) {


//     try {
//       await connectToDatabase();

//       const name = formData.get('name') as string;

//       const newTag = new Tag({
//         name,
//         slug: slugify(name),
//       });

//       await newTag.save();
//       return { success: true, message: 'Tag created successfully' };
//     } catch (error) {
//       console.error('Error creating tag:', error);
//       return { success: false, message: 'Failed to create tag' };
//     }
//   }

//   // Handle tag update
//   async function updateTag(formData: FormData) {
//     'use server';

//     try {
//       await connectToDatabase();

//       const id = formData.get('id') as string;
//       const name = formData.get('name') as string;

//       await Tag.findByIdAndUpdate(id, {
//         name,
//         slug: slugify(name),
//       });

//       return { success: true, message: 'Tag updated successfully' };
//     } catch (error) {
//       console.error('Error updating tag:', error);
//       return { success: false, message: 'Failed to update tag' };
//     }
//   }

//   // Handle tag deletion
//   async function deleteTag(formData: FormData) {
//     'use server';

//     try {
//       await connectToDatabase();

//       const id = formData.get('id') as string;

//       await Tag.findByIdAndDelete(id);
//       return { success: true, message: 'Tag deleted successfully' };
//     } catch (error) {
//       console.error('Error deleting tag:', error);
//       return { success: false, message: 'Failed to delete tag' };
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-gray-800">Manage Tags</h1>

//       {/* Tag Creation Form */}
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Tag</h2>
//         <TagForm action={createTag} submitLabel="Create Tag" />
//       </div>

//       {/* Tags Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
//               <th className="py-3 px-6 text-left">Name</th>
//               <th className="py-3 px-6 text-left">Slug</th>
//               <th className="py-3 px-6 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tags.length > 0 ? (
//               tags.map((tag: any) => (
//                 <tr key={tag._id} className="border-b hover:bg-gray-50">
//                   <td className="py-3 px-6 text-gray-800">{tag.name}</td>
//                   <td className="py-3 px-6 text-gray-600">{tag.slug}</td>
//                   <td className="py-3 px-6 text-center space-x-2">
//                     <TagForm
//                       action={updateTag}
//                       submitLabel="Update"
//                       defaultValues={{ id: tag._id, name: tag.name }}
//                       isEdit
//                     />
//                     <form action={deleteTag} className="inline">
//                       <input type="hidden" name="id" value={tag._id} />
//                       <button
//                         type="submit"
//                         className="text-red-600 hover:underline"
//                         onClick={(e) => {
//                           if (!confirm('Are you sure you want to delete this tag?')) {
//                             e.preventDefault();
//                           }
//                         }}
//                       >
//                         Delete
//                       </button>
//                     </form>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={3} className="py-3 px-6 text-center text-gray-600">
//                   No tags found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

//working but not in deployment

// import Link from 'next/link';
// import { redirect } from 'next/navigation';
// import { getCurrentUser } from '@/lib/getCurrentUser';
// import connectToDatabase from '@/lib/db';
// import Tag from '@/models/Tag';
// import { deleteTagAction } from '@/lib/actions';

// interface TagType {
//   _id: string;
//   name: string;
// }

// async function getTags() {
//   try {
//     await connectToDatabase();
//     const tags = await Tag.find({}).select('name _id').lean();
//     return {
//       tags: JSON.parse(JSON.stringify(tags)),
//       error: null,
//     };
//   } catch (error) {
//     console.error('Error fetching tags:', error);
//     return {
//       tags: [],
//       error: 'Failed to load tags. Please try refreshing the page.',
//     };
//   }
// }

// export default async function TagsPage() {
//   const user = await getCurrentUser();
//   if (!user) {
//     redirect('/sign-in');
//   }

//   const { tags, error } = await getTags();

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Tags</h1>
//         <Link
//           href="/admin/tags/new"
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           Create New Tag
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
//                 {tags.length > 0 ? (
//                   tags.map((tag) => (
//                     <tr key={tag._id} className="border-b hover:bg-gray-50">
//                       <td className="py-4 px-6 font-medium">{tag.name}</td>
//                       <td className="py-4 px-6 text-center space-x-4">
//                         <Link
//                           href={`/admin/tags/${tag._id}/edit`}
//                           className="text-blue-600 hover:underline"
//                         >
//                           Edit
//                         </Link>
//                         <form
//                           action={deleteTagAction.bind(null, tag._id)}
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
//                       No tags found.
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


import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Tag from '@/models/Tag';
import { deleteTagAction } from '@/lib/actions';

// Redefine based on assumed Tag schema and lean() output
interface LeanTagType {
  _id: string;
  name?: string;
  slug?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

async function getTags() {
  try {
    await connectToDatabase();
    const tags :LeanTagType[]=await Tag.find({}).select('name slug _id createdAt updatedAt').lean() as LeanTagType[];
    return {
      tags: JSON.parse(JSON.stringify(tags)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return {
      tags: [],
      error: 'Failed to load tags. Please try refreshing the page.',
    };
  }
}

export default async function TagsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { tags, error } = await getTags();

return (
  <div className="container mx-auto py-8 px-4">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Tags</h1>
      <Link
        href="/admin/tags/new"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Create New Tag
      </Link>
    </div>

    {error && <p className="text-red-500">{error}</p>}

    {!error && (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-600 uppercase text-sm">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {tags.length > 0 ? (
                tags.map((tag: LeanTagType) => (
                  <tr key={tag._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{tag.name}</td>
                    <td className="py-4 px-6 text-center space-x-4">
                      <Link
                        href={`/admin/tags/${tag._id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    <form
  action={deleteTagAction}
  className="inline"
>
  <input type="hidden" name="tagId" value={tag._id} />
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
                  <td colSpan={2} className="py-6 px-6 text-center text-gray-500">
                    No tags found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);
}