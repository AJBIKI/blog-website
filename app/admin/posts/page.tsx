

// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useAuth } from '@clerk/nextjs';
// // import { getAuth } from '@clerk/nextjs/server'; // Correct import for client-side
// // import { getToken } from '@clerk/nextjs'

// interface PostType {
//   _id: string;
//   title: string;
//   status: 'draft' | 'published' | 'scheduled';
//   category: {
//     name: string;
//     slug?: string;
//   } | null;
//   createdAt: string;
//   slug: string;
// }

// async function deletePostAction(postId: string): Promise<{ success: boolean; message: string }> {
//   if (!postId) {
//     return { success: false, message: 'Post ID is required.' };
//   }

//   try {
//     // const response = await fetch(`/api/admin/posts/${postId}`, {
//     //   method: 'DELETE',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     // });
//     const { getToken } = useAuth();


// const token = await getToken();

// const response = await fetch(`/api/admin/posts/${postId}`, {
//   method: 'DELETE',
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });



//     if (!response.ok) {
//       const errorData = await response.json();
//       return { success: false, message: errorData.error || 'Failed to delete post.' };
//     }

//     return { success: true, message: 'Post deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     return { success: false, message: 'Failed to delete post.' };
//   }
// }

// function DeletePostButton({ postId, onPostDeleted }: { postId: string; onPostDeleted: (id: string) => void }) {
//   const [isConfirming, setIsConfirming] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleDelete = async () => {
//     setIsDeleting(true);
//     setError(null);
//     const result = await deletePostAction(postId);
//     if (result.success) {
//       onPostDeleted(postId);
//       setIsConfirming(false);
//     } else {
//       setError(result.message);
//     }
//     setIsDeleting(false);
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsConfirming(true)}
//         className="text-red-600 hover:underline disabled:text-gray-400"
//         disabled={isDeleting}
//       >
//         Delete
//       </button>

//       {isConfirming && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 shadow-xl">
//             <h3 className="text-lg font-bold">Are you sure?</h3>
//             <p className="my-2 text-gray-600">This action cannot be undone.</p>
//             {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//             <div className="flex justify-end space-x-4 mt-4">
//               <button
//                 onClick={() => setIsConfirming(false)}
//                 className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//                 disabled={isDeleting}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400"
//                 disabled={isDeleting}
//               >
//                 {isDeleting ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default function PostsPage() {
//   const [posts, setPosts] = useState<PostType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//    const { getToken } = useAuth();

//   const fetchPosts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
     
//       const token = await getToken();
//       const response = await fetch('/api/admin/posts', {
//          credentials: 'include',
//         // headers: {
//         //   Authorization: `Bearer ${token}`,
//         // },
//       });
// if (!response.ok) {
//   const errorText = await response.text(); // Get raw response for debugging
//   console.error('Fetch posts failed:', response.status, errorText);
//   throw new Error(`Failed to fetch posts: ${response.status} ${errorText}`);
// }
// const postsData = await response.json();
//       setPosts(postsData);
//     } catch (e) {
//       console.error('Failed to fetch posts:', e);
//       setError('Could not load posts. Please try refreshing the page.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const handlePostDeleted = (deletedPostId: string) => {
//     setPosts((prevPosts) => prevPosts.filter((post) => post._id !== deletedPostId));
//   };

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Posts</h1>
//         <Link
//           href="/admin/posts/new"
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           Create New Post
//         </Link>
//       </div>

//       {loading && <p>Loading posts...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && !error && (
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead className="bg-gray-50 border-b">
//                 <tr className="text-gray-600 uppercase text-sm">
//                   <th className="py-3 px-6 text-left">Title</th>
//                   <th className="py-3 px-6 text-left">Status</th>
//                   <th className="py-3 px-6 text-left">Category</th>
//                   <th className="py-3 px-6 text-left">Created Date</th>
//                   <th className="py-3 px-6 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="text-gray-700">
//                 {posts.length > 0 ? (
//                   posts.map((post) => (
//                     <tr key={post._id} className="border-b hover:bg-gray-50">
//                       <td className="py-4 px-6 font-medium">{post.title}</td>
//                       <td className="py-4 px-6 capitalize">{post.status}</td>
//                       <td className="py-4 px-6">{post.category?.name || 'Uncategorized'}</td>
//                       <td className="py-4 px-6">{new Date(post.createdAt).toLocaleDateString()}</td>
//                       <td className="py-4 px-6 text-center space-x-4">
//                         <Link href={`/admin/posts/${post._id}/edit`} className="text-blue-600 hover:underline">
//                           Edit
//                         </Link>
//                         <DeletePostButton postId={post._id} onPostDeleted={handlePostDeleted} />
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="py-6 px-6 text-center text-gray-500">
//                       No posts found.
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
import Post from '@/models/Post';
import { revalidatePath } from 'next/cache';

interface PostType {
  _id: string;
  title: string;
  status: 'draft' | 'published' | 'scheduled';
  category: {
    name: string;
    slug?: string;
  } | null;
  createdAt: string;
  slug: string;
}

async function getPosts(userId: string) {
  try {
    await connectToDatabase();
    const posts = await Post.find({ author: userId })
      .populate('category', 'name')
      .select('title status category createdAt slug _id')
      .sort({ createdAt: -1 })
      .lean();
    return {
      posts: JSON.parse(JSON.stringify(posts)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      posts: [],
      error: 'Could not load posts. Please try refreshing the page.',
    };
  }
}

export default async function PostsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { posts, error } = await getPosts(user.id);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create New Post
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-600 uppercase text-sm">
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Created Date</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {posts.length > 0 ? (
                  posts.map((post: PostType) => (
                    <tr key={post._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{post.title}</td>
                      <td className="py-4 px-6 capitalize">{post.status}</td>
                      <td className="py-4 px-6">{post.category?.name || 'Uncategorized'}</td>
                      <td className="py-4 px-6">{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-center space-x-4">
                        <Link href={`/admin/posts/${post._id}/edit`} className="text-blue-600 hover:underline">
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
                              await Post.findOneAndDelete({ _id: post._id, author: user.id });
                              revalidatePath('/admin/posts');
                            } catch (error) {
                              console.error('Error deleting post:', error);
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
                    <td colSpan={5} className="py-6 px-6 text-center text-gray-500">
                      No posts found.
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