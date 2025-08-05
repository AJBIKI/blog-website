// // 'use server';

// // import { getCurrentUser } from '@/lib/getCurrentUser';
// // import connectToDatabase from '@/lib/db';
// // import Post from '@/models/Post';

// // export async function deletePostAction(postId: string) {
// //   const user = await getCurrentUser();
// //   if (!user) {
// //     return { success: false, message: 'Unauthorized: You must be logged in.' };
// //   }

// //   try {
// //     await connectToDatabase();
// //     const deletedPost = await Post.findOneAndDelete({ _id: postId, author: user.id });

// //     if (!deletedPost) {
// //       return { success: false, message: 'Post not found or unauthorized.' };
// //     }

// //     return { success: true, message: 'Post deleted successfully.' };
// //   } catch (error) {
// //     console.error('Error deleting post:', error);
// //     return { success: false, message: 'An unexpected error occurred while deleting the post.' };
// //   }
// // }


// 'use server';
// import { getCurrentUser } from '@/lib/getCurrentUser';
// import connectToDatabase from '@/lib/db';
// import Post from '@/models/Post';
// import { revalidatePath } from 'next/cache';
// export async function deletePostAction(postId: string) {
// const user = await getCurrentUser();
// if (!user) {
// return { success: false, message: 'Unauthorized: You must be logged in.' };
// }
// try {
// await connectToDatabase();
// const deletedPost = await Post.findOneAndDelete({ _id: postId, author: user.id });
// if (!deletedPost) {
// return { success: false, message: 'Post not found or unauthorized.' };
// }
// revalidatePath('/admin/posts');
// return { success: true, message: 'Post deleted successfully.' };
// } catch (error) {
// console.error('Error deleting post:', error);
// return { success: false, message: 'An unexpected error occurred while deleting the post.' };
// }
// }
// export async function createPostAction(formData: FormData) {
// const user = await getCurrentUser();
// if (!user) {
// return { success: false, message: 'Unauthorized: You must be logged in.' };
// }
// try {
// await connectToDatabase();
// const postData = {
// title: formData.get('title') as string,
// content: formData.get('content') as string,
// category: formData.get('category') as string,
// tags: formData.getAll('tags') as string[],
// status: formData.get('status') as 'draft' | 'published' | 'scheduled',
// coverImage: formData.get('coverImage') as string | null,
// publishedAt:
// (formData.get('status') as string) === 'published'
// ? new Date()
// : (formData.get('status') as string) === 'scheduled' && formData.get('publishedAt')
// ? new Date(formData.get('publishedAt') as string)
// : null,
// author: user.id,
// slug: (formData.get('title') as string)
// .toLowerCase()
// .replace(/[^a-z0-9]+/g, '-')
// .replace(/(^-|-$)/g, ''),
// createdAt: new Date(),
// updatedAt: new Date(),
// };
// const post = await Post.create(postData);
// revalidatePath('/admin/posts');
// revalidatePath('/blog');
// return { success: true, message: 'Post created successfully.', postId: post._id };
// } catch (error) {
// console.error('Error creating post:', error);
// return { success: false, message: 'An unexpected error occurred while creating the post.' };
// }
// }

//working fully



// 'use server';

// import { getCurrentUser } from '@/lib/getCurrentUser';
// import connectToDatabase from '@/lib/db';
// import Post from '@/models/Post';
// import Category from '@/models/Category';
// import Tag from '@/models/Tag';
// import { revalidatePath } from 'next/cache';

// export async function deletePostAction(postId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedPost = await Post.findOneAndDelete({ _id: postId, author: user.id });

//     if (!deletedPost) {
//       return { success: false, message: 'Post not found or unauthorized.' };
//     }

//     revalidatePath('/admin/posts');
//     return { success: true, message: 'Post deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the post.' };
//   }
// }

// export async function createPostAction(formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const postData = {
//       title: formData.get('title') as string,
//       content: formData.get('content') as string,
//       category: formData.get('category') as string,
//       tags: formData.getAll('tags') as string[],
//       status: formData.get('status') as 'draft' | 'published' | 'scheduled',
//       coverImage: formData.get('coverImage') as string | null,
//       publishedAt:
//         (formData.get('status') as string) === 'published'
//           ? new Date()
//           : (formData.get('status') as string) === 'scheduled' && formData.get('publishedAt')
//           ? new Date(formData.get('publishedAt') as string)
//           : null,
//       author: user.id,
//       slug: (formData.get('title') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const post = await Post.create(postData);
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return { success: true, message: 'Post created successfully.', postId: post._id };
//   } catch (error) {
//     console.error('Error creating post:', error);
//     return { success: false, message: 'An unexpected error occurred while creating the post.' };
//   }
// }

// export async function deleteCategoryAction(categoryId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedCategory = await Category.findOneAndDelete({ _id: categoryId });

//     if (!deletedCategory) {
//       return { success: false, message: 'Category not found.' };
//     }

//     await Post.updateMany({ category: categoryId }, { $set: { category: null } });

//     revalidatePath('/admin/categories');
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return { success: true, message: 'Category deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting category:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the category.' };
//   }
// }

// export async function deleteTagAction(tagId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedTag = await Tag.findOneAndDelete({ _id: tagId });

//     if (!deletedTag) {
//       return { success: false, message: 'Tag not found.' };
//     }

//     // Remove tag from posts
//     await Post.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

//     revalidatePath('/admin/tags');
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return { success: true, message: 'Tag deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting tag:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the tag.' };
//   }
// }



//full fully working

// 'use server';

// import { getCurrentUser } from '@/lib/getCurrentUser';
// import connectToDatabase from '@/lib/db';
// import Post from '@/models/Post';
// import Category from '@/models/Category';
// import Tag from '@/models/Tag';
// import { revalidatePath } from 'next/cache';

// export async function deletePostAction(postId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedPost = await Post.findOneAndDelete({ _id: postId, author: user.id });

//     if (!deletedPost) {
//       return { success: false, message: 'Post not found or unauthorized.' };
//     }

//     revalidatePath('/admin/posts');
//     return { success: true, message: 'Post deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the post.' };
//   }
// }

// export async function createPostAction(formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const postData = {
//       title: formData.get('title') as string,
//       content: formData.get('content') as string,
//       category: formData.get('category') as string,
//       tags: formData.getAll('tags') as string[],
//       status: formData.get('status') as 'draft' | 'published' | 'scheduled',
//       coverImage: formData.get('coverImage') as string | null,
//       publishedAt:
//         (formData.get('status') as string) === 'published'
//           ? new Date()
//           : (formData.get('status') as string) === 'scheduled' && formData.get('publishedAt')
//           ? new Date(formData.get('publishedAt') as string)
//           : null,
//       author: user.id,
//       slug: (formData.get('title') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const post = await Post.create(postData);
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return {
//       success: true,
//       message: 'Post created successfully.',
//       postId: post._id.toString(), // Convert ObjectId to string
//     };
//   } catch (error) {
//     console.error('Error creating post:', error);
//     return { success: false, message: 'An unexpected error occurred while creating the post.' };
//   }
// }

// export async function deleteCategoryAction(categoryId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedCategory = await Category.findOneAndDelete({ _id: categoryId });

//     if (!deletedCategory) {
//       return { success: false, message: 'Category not found.' };
//     }

//     await Post.updateMany({ category: categoryId }, { $set: { category: null } });

//     revalidatePath('/admin/categories');
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return { success: true, message: 'Category deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting category:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the category.' };
//   }
// }

// export async function deleteTagAction(tagId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedTag = await Tag.findOneAndDelete({ _id: tagId });

//     if (!deletedTag) {
//       return { success: false, message: 'Tag not found.' };
//     }

//     await Post.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

//     revalidatePath('/admin/tags');
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return { success: true, message: 'Tag deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting tag:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the tag.' };
//   }
// }

//fully working
// 'use server';

// import { getCurrentUser } from '@/lib/getCurrentUser';
// import connectToDatabase from '@/lib/db';
// import Post from '@/models/Post';
// import Category from '@/models/Category';
// import Tag from '@/models/Tag';
// import { revalidatePath } from 'next/cache';

// export async function deletePostAction(postId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedPost = await Post.findOneAndDelete({ _id: postId, author: user.id });

//     if (!deletedPost) {
//       return { success: false, message: 'Post not found or unauthorized.' };
//     }

//     revalidatePath('/admin/posts');
//     return { success: true, message: 'Post deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the post.' };
//   }
// }

// export async function createPostAction(formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const postData = {
//       title: formData.get('title') as string,
//       content: formData.get('content') as string,
//       category: formData.get('category') as string,
//       tags: formData.getAll('tags') as string[],
//       status: formData.get('status') as 'draft' | 'published' | 'scheduled',
//       coverImage: formData.get('coverImage') as string | null,
//       publishedAt:
//         (formData.get('status') as string) === 'published'
//           ? new Date()
//           : (formData.get('status') as string) === 'scheduled' && formData.get('publishedAt')
//           ? new Date(formData.get('publishedAt') as string)
//           : null,
//       author: user.id,
//       slug: (formData.get('title') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const post = await Post.create(postData);
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return {
//       success: true,
//       message: 'Post created successfully.',
//       postId: post._id.toString(),
//     };
//   } catch (error) {
//     console.error('Error creating post:', error);
//     return { success: false, message: 'An unexpected error occurred while creating the post.' };
//   }
// }

// export async function deleteCategoryAction(categoryId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedCategory = await Category.findOneAndDelete({ _id: categoryId });

//     if (!deletedCategory) {
//       return { success: false, message: 'Category not found.' };
//     }

//     await Post.updateMany({ category: categoryId }, { $set: { category: null } });

//     revalidatePath('/admin/categories');
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return { success: true, message: 'Category deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting category:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the category.' };
//   }
// }

// export async function updateCategoryAction(categoryId: string, formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const categoryData = {
//       name: formData.get('name') as string,
//       slug: (formData.get('name') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       updatedAt: new Date(),
//     };

//     const category = await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
//     if (!category) {
//       return { success: false, message: 'Category not found.' };
//     }

//     revalidatePath('/admin/categories');
//     revalidatePath('/admin/posts/new');
//     return {
//       success: true,
//       message: 'Category updated successfully.',
//       categoryId: category._id.toString(),
//     };
//   } catch (error) {
//     console.error('Error updating category:', error);
//     return { success: false, message: 'An unexpected error occurred while updating the category.' };
//   }
// }

// export async function createCategoryAction(formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const categoryData = {
//       name: formData.get('name') as string,
//       slug: (formData.get('name') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const category = await Category.create(categoryData);
//     revalidatePath('/admin/categories');
//     revalidatePath('/admin/posts/new');
//     return {
//       success: true,
//       message: 'Category created successfully.',
//       categoryId: category._id.toString(),
//     };
//   } catch (error: any) {
//     console.error('Error creating category:', error);
//     if (error.name === 'ValidationError') {
//       return { success: false, message: `Validation failed: ${error.message}` };
//     }
//     return { success: false, message: 'An unexpected error occurred while creating the category.' };
//   }
// }

// export async function createTagAction(formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const tagData = {
//       name: formData.get('name') as string,
//       slug: (formData.get('name') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const tag = await Tag.create(tagData);
//     revalidatePath('/admin/tags');
//     revalidatePath('/admin/posts/new');
//     return {
//       success: true,
//       message: 'Tag created successfully.',
//       tagId: tag._id.toString(),
//     };
//   } catch (error: any) {
//     console.error('Error creating tag:', error);
//     if (error.name === 'ValidationError') {
//       return { success: false, message: `Validation failed: ${error.message}` };
//     }
//     return { success: false, message: 'An unexpected error occurred while creating the tag.' };
//   }
// }

// export async function deleteTagAction(tagId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedTag = await Tag.findOneAndDelete({ _id: tagId });

//     if (!deletedTag) {
//       return { success: false, message: 'Tag not found.' };
//     }

//     await Post.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

//     revalidatePath('/admin/tags');
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return { success: true, message: 'Tag deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting tag:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the tag.' };
//   }
// }

// export async function updateTagAction(tagId: string, formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const tagData = {
//       name: formData.get('name') as string,
//       slug: (formData.get('name') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       updatedAt: new Date(),
//     };

//     const tag = await Tag.findByIdAndUpdate(tagId, tagData, { new: true });
//     if (!tag) {
//       return { success: false, message: 'Tag not found.' };
//     }

//     revalidatePath('/admin/tags');
//     revalidatePath('/admin/posts/new');
//     return {
//       success: true,
//       message: 'Tag updated successfully.',
//       tagId: tag._id.toString(),
//     };
//   } catch (error) {
//     console.error('Error updating tag:', error);
//     return { success: false, message: 'An unexpected error occurred while updating the tag.' };
//   }
// }


//addUpdate post 

// 'use server';

// import { getCurrentUser } from '@/lib/getCurrentUser';
// import connectToDatabase from '@/lib/db';
// import Post from '@/models/Post';
// import Category from '@/models/Category';
// import Tag from '@/models/Tag';
// import mongoose from 'mongoose';
// import { revalidatePath } from 'next/cache';

// export async function deletePostAction(postId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedPost = await Post.findOneAndDelete({ _id: postId, author: user.id });

//     if (!deletedPost) {
//       return { success: false, message: 'Post not found or unauthorized.' };
//     }

//     revalidatePath('/admin/posts');
//     return { success: true, message: 'Post deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the post.' };
//   }
// }

// export async function createPostAction(formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const categoryId = formData.get('category') as string;
//     if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
//       return { success: false, message: 'Invalid or missing category.' };
//     }
//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return { success: false, message: 'Category not found.' };
//     }

//     const postData = {
//       title: formData.get('title') as string,
//       content: formData.get('content') as string,
//       category: categoryId,
//       tags: (formData.getAll('tags') as string[]).filter((tag) => mongoose.isValidObjectId(tag)),
//       status: formData.get('status') as 'draft' | 'published' | 'scheduled',
//       coverImage: formData.get('coverImage') as string | null,
//       publishedAt:
//         (formData.get('status') as string) === 'published'
//           ? new Date()
//           : (formData.get('status') as string) === 'scheduled' && formData.get('publishedAt')
//           ? new Date(formData.get('publishedAt') as string)
//           : null,
//       author: user.id,
//       slug: (formData.get('title') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const existingPost = await Post.findOne({ slug: postData.slug });
//     if (existingPost) {
//       return { success: false, message: 'A post with this title already exists.' };
//     }

//     const post = await Post.create(postData);
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return {
//       success: true,
//       message: 'Post created successfully.',
//       postId: post._id.toString(),
//     };
//   } catch (error: any) {
//     console.error('Error creating post:', error);
//     if (error.name === 'ValidationError') {
//       return { success: false, message: `Validation failed: ${error.message}` };
//     }
//     return { success: false, message: 'An unexpected error occurred while creating the post.' };
//   }
// }

// export async function updatePostAction(postId: string, formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const categoryId = formData.get('category') as string;
//     if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
//       return { success: false, message: 'Invalid or missing category.' };
//     }
//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return { success: false, message: 'Category not found.' };
//     }

//     const postData = {
//       title: formData.get('title') as string,
//       content: formData.get('content') as string,
//       category: categoryId,
//       tags: (formData.getAll('tags') as string[]).filter((tag) => mongoose.isValidObjectId(tag)),
//       status: formData.get('status') as 'draft' | 'published' | 'scheduled',
//       coverImage: formData.get('coverImage') as string | null,
//       publishedAt:
//         (formData.get('status') as string) === 'published'
//           ? new Date()
//           : (formData.get('status') as string) === 'scheduled' && formData.get('publishedAt')
//           ? new Date(formData.get('publishedAt') as string)
//           : null,
//       slug: (formData.get('title') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       updatedAt: new Date(),
//     };

//     const existingPost = await Post.findOne({ slug: postData.slug, _id: { $ne: postId } });
//     if (existingPost) {
//       return { success: false, message: 'A post with this title already exists.' };
//     }

//     const post = await Post.findOneAndUpdate({ _id: postId, author: user.id }, postData, { new: true });
//     if (!post) {
//       return { success: false, message: 'Post not found or unauthorized.' };
//     }

//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return {
//       success: true,
//       message: 'Post updated successfully.',
//       postId: post._id.toString(),
//     };
//   } catch (error: any) {
//     console.error('Error updating post:', error);
//     if (error.name === 'ValidationError') {
//       return { success: false, message: `Validation failed: ${error.message}` };
//     }
//     return { success: false, message: 'An unexpected error occurred while updating the post.' };
//   }
// }

// export async function deleteCategoryAction(categoryId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedCategory = await Category.findOneAndDelete({ _id: categoryId });

//     if (!deletedCategory) {
//       return { success: false, message: 'Category not found.' };
//     }

//     await Post.updateMany({ category: categoryId }, { $set: { category: null } });

//     revalidatePath('/admin/categories');
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return { success: true, message: 'Category deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting category:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the category.' };
//   }
// }

// export async function createCategoryAction(formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const categoryData = {
//       name: formData.get('name') as string,
//       slug: (formData.get('name') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const existingCategory = await Category.findOne({ slug: categoryData.slug });
//     if (existingCategory) {
//       return { success: false, message: 'A category with this name already exists.' };
//     }

//     const category = await Category.create(categoryData);
//     revalidatePath('/admin/categories');
//     revalidatePath('/admin/posts/new');
//     return {
//       success: true,
//       message: 'Category created successfully.',
//       categoryId: category._id.toString(),
//     };
//   } catch (error: any) {
//     console.error('Error creating category:', error);
//     if (error.name === 'ValidationError') {
//       return { success: false, message: `Validation failed: ${error.message}` };
//     }
//     return { success: false, message: 'An unexpected error occurred while creating the category.' };
//   }
// }

// export async function updateCategoryAction(categoryId: string, formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const categoryData = {
//       name: formData.get('name') as string,
//       slug: (formData.get('name') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       updatedAt: new Date(),
//     };

//     const existingCategory = await Category.findOne({ slug: categoryData.slug, _id: { $ne: categoryId } });
//     if (existingCategory) {
//       return { success: false, message: 'A category with this name already exists.' };
//     }

//     const category = await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
//     if (!category) {
//       return { success: false, message: 'Category not found.' };
//     }

//     revalidatePath('/admin/categories');
//     revalidatePath('/admin/posts/new');
//     return {
//       success: true,
//       message: 'Category updated successfully.',
//       categoryId: category._id.toString(),
//     };
//   } catch (error: any) {
//     console.error('Error updating category:', error);
//     if (error.name === 'ValidationError') {
//       return { success: false, message: `Validation failed: ${error.message}` };
//     }
//     return { success: false, message: 'An unexpected error occurred while updating the category.' };
//   }
// }

// export async function createTagAction(formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const tagData = {
//       name: formData.get('name') as string,
//       slug: (formData.get('name') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const existingTag = await Tag.findOne({ slug: tagData.slug });
//     if (existingTag) {
//       return { success: false, message: 'A tag with this name already exists.' };
//     }

//     const tag = await Tag.create(tagData);
//     revalidatePath('/admin/tags');
//     revalidatePath('/admin/posts/new');
//     return {
//       success: true,
//       message: 'Tag created successfully.',
//       tagId: tag._id.toString(),
//     };
//   } catch (error: any) {
//     console.error('Error creating tag:', error);
//     if (error.name === 'ValidationError') {
//       return { success: false, message: `Validation failed: ${error.message}` };
//     }
//     return { success: false, message: 'An unexpected error occurred while creating the tag.' };
//   }
// }

// export async function deleteTagAction(tagId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedTag = await Tag.findOneAndDelete({ _id: tagId });

//     if (!deletedTag) {
//       return { success: false, message: 'Tag not found.' };
//     }

//     await Post.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

//     revalidatePath('/admin/tags');
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return { success: true, message: 'Tag deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting tag:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the tag.' };
//   }
// }

// export async function updateTagAction(tagId: string, formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const tagData = {
//       name: formData.get('name') as string,
//       slug: (formData.get('name') as string)
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, ''),
//       updatedAt: new Date(),
//     };

//     const existingTag = await Tag.findOne({ slug: tagData.slug, _id: { $ne: tagId } });
//     if (existingTag) {
//       return { success: false, message: 'A tag with this name already exists.' };
//     }

//     const tag = await Tag.findByIdAndUpdate(tagId, tagData, { new: true });
//     if (!tag) {
//       return { success: false, message: 'Tag not found.' };
//     }

//     revalidatePath('/admin/tags');
//     revalidatePath('/admin/posts/new');
//     return {
//       success: true,
//       message: 'Tag updated successfully.',
//       tagId: tag._id.toString(),
//     };
//   } catch (error: any) {
//     console.error('Error updating tag:', error);
//     if (error.name === 'ValidationError') {
//       return { success: false, message: `Validation failed: ${error.message}` };
//     }
//     return { success: false, message: 'An unexpected error occurred while updating the tag.' };
//   }
// }


'use server';

import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

export async function deletePostAction(postId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Unauthorized: You must be logged in.' };
  }

  try {
    await connectToDatabase();
    const deletedPost = await Post.findOneAndDelete({ _id: postId, author: user.id });

    if (!deletedPost) {
      return { success: false, message: 'Post not found or unauthorized.' };
    }

    revalidatePath('/admin/posts');
    return { success: true, message: 'Post deleted successfully.' };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, message: 'An unexpected error occurred while deleting the post.' };
  }
}

export async function createPostAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Unauthorized: You must be logged in.' };
  }

  try {
    await connectToDatabase();
    const categoryId = formData.get('category') as string;
    if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
      return { success: false, message: 'Invalid or missing category.' };
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return { success: false, message: 'Category not found.' };
    }

    const postData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: categoryId,
      tags: (formData.getAll('tags') as string[]).filter((tag) => mongoose.isValidObjectId(tag)),
      status: formData.get('status') as 'draft' | 'published' | 'scheduled',
      coverImage: formData.get('coverImage') as string | null,
      publishedAt:
        (formData.get('status') as string) === 'published'
          ? new Date()
          : (formData.get('status') as string) === 'scheduled' && formData.get('publishedAt')
          ? new Date(formData.get('publishedAt') as string)
          : null,
      author: user.id,
      slug: (formData.get('title') as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existingPost = await Post.findOne({ slug: postData.slug });
    if (existingPost) {
      return { success: false, message: 'A post with this title already exists.' };
    }

    const post = await Post.create(postData);
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    return {
      success: true,
      message: 'Post created successfully.',
      postId: post._id.toString(),
      redirect: '/admin/posts',
    };
  } catch (error: any) {
    console.error('Error creating post:', error);
    if (error.name === 'ValidationError') {
      return { success: false, message: `Validation failed: ${error.message}` };
    }
    return { success: false, message: 'An unexpected error occurred while creating the post.' };
  }
}

export async function updatePostAction(postId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Unauthorized: You must be logged in.' };
  }

  try {
    await connectToDatabase();
    const categoryId = formData.get('category') as string;
    if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
      return { success: false, message: 'Invalid or missing category.' };
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return { success: false, message: 'Category not found.' };
    }

    const postData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: categoryId,
      tags: (formData.getAll('tags') as string[]).filter((tag) => mongoose.isValidObjectId(tag)),
      status: formData.get('status') as 'draft' | 'published' | 'scheduled',
      coverImage: formData.get('coverImage') as string | null,
      publishedAt:
        (formData.get('status') as string) === 'published'
          ? new Date()
          : (formData.get('status') as string) === 'scheduled' && formData.get('publishedAt')
          ? new Date(formData.get('publishedAt') as string)
          : null,
      slug: (formData.get('title') as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      updatedAt: new Date(),
    };

    const existingPost = await Post.findOne({ slug: postData.slug, _id: { $ne: postId } });
    if (existingPost) {
      return { success: false, message: 'A post with this title already exists.' };
    }

    const post = await Post.findOneAndUpdate({ _id: postId, author: user.id }, postData, { new: true });
    if (!post) {
      return { success: false, message: 'Post not found or unauthorized.' };
    }

    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    return {
      success: true,
      message: 'Post updated successfully.',
      postId: post._id.toString(),
      redirect: '/admin/posts',
    };
  } catch (error: any) {
    console.error('Error updating post:', error);
    if (error.name === 'ValidationError') {
      return { success: false, message: `Validation failed: ${error.message}` };
    }
    return { success: false, message: 'An unexpected error occurred while updating the post.' };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Unauthorized: You must be logged in.' };
  }

  try {
    await connectToDatabase();
    const deletedCategory = await Category.findOneAndDelete({ _id: categoryId });

    if (!deletedCategory) {
      return { success: false, message: 'Category not found.' };
    }

    await Post.updateMany({ category: categoryId }, { $set: { category: null } });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    return { success: true, message: 'Category deleted successfully.' };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, message: 'An unexpected error occurred while deleting the category.' };
  }
}

export async function createCategoryAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Unauthorized: You must be logged in.' };
  }

  try {
    await connectToDatabase();
    const categoryData = {
      name: formData.get('name') as string,
      slug: (formData.get('name') as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existingCategory = await Category.findOne({ slug: categoryData.slug });
    if (existingCategory) {
      return { success: false, message: 'A category with this name already exists.' };
    }

    const category = await Category.create(categoryData);
    revalidatePath('/admin/categories');
    revalidatePath('/admin/posts/new');
    return {
      success: true,
      message: 'Category created successfully.',
      categoryId: category._id.toString(),
      redirect: '/admin/categories',
    };
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.name === 'ValidationError') {
      return { success: false, message: `Validation failed: ${error.message}` };
    }
    return { success: false, message: 'An unexpected error occurred while creating the category.' };
  }
}

export async function updateCategoryAction(categoryId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Unauthorized: You must be logged in.' };
  }

  try {
    await connectToDatabase();
    const categoryData = {
      name: formData.get('name') as string,
      slug: (formData.get('name') as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      updatedAt: new Date(),
    };

    const existingCategory = await Category.findOne({ slug: categoryData.slug, _id: { $ne: categoryId } });
    if (existingCategory) {
      return { success: false, message: 'A category with this name already exists.' };
    }

    const category = await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
    if (!category) {
      return { success: false, message: 'Category not found.' };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin/posts/new');
    return {
      success: true,
      message: 'Category updated successfully.',
      categoryId: category._id.toString(),
      redirect: '/admin/categories',
    };
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.name === 'ValidationError') {
      return { success: false, message: `Validation failed: ${error.message}` };
    }
    return { success: false, message: 'An unexpected error occurred while updating the category.' };
  }
}

export async function createTagAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Unauthorized: You must be logged in.' };
  }

  try {
    await connectToDatabase();
    const tagData = {
      name: formData.get('name') as string,
      slug: (formData.get('name') as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existingTag = await Tag.findOne({ slug: tagData.slug });
    if (existingTag) {
      return { success: false, message: 'A tag with this name already exists.' };
    }

    const tag = await Tag.create(tagData);
    revalidatePath('/admin/tags');
    revalidatePath('/admin/posts/new');
    return {
      success: true,
      message: 'Tag created successfully.',
      tagId: tag._id.toString(),
      redirect: '/admin/tags',
    };
  } catch (error: any) {
    console.error('Error creating tag:', error);
    if (error.name === 'ValidationError') {
      return { success: false, message: `Validation failed: ${error.message}` };
    }
    return { success: false, message: 'An unexpected error occurred while creating the tag.' };
  }
}

// export async function deleteTagAction(tagId: string) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false, message: 'Unauthorized: You must be logged in.' };
//   }

//   try {
//     await connectToDatabase();
//     const deletedTag = await Tag.findOneAndDelete({ _id: tagId });

//     if (!deletedTag) {
//       return { success: false, message: 'Tag not found.' };
//     }

//     await Post.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

//     revalidatePath('/admin/tags');
//     revalidatePath('/admin/posts');
//     revalidatePath('/blog');
//     return { success: true, message: 'Tag deleted successfully.' };
//   } catch (error) {
//     console.error('Error deleting tag:', error);
//     return { success: false, message: 'An unexpected error occurred while deleting the tag.' };
//   }
// }


export async function deleteTagAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    console.error('Unauthorized: You must be logged in.');
    return;
  }

  const tagId = formData.get('tagId') as string;

  try {
    await connectToDatabase();
    const deletedTag = await Tag.findOneAndDelete({ _id: tagId });

    if (!deletedTag) {
      console.error('Tag not found.');
      return;
    }

    await Post.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

    revalidatePath('/admin/tags');
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
  } catch (error) {
    console.error('Error deleting tag:', error);
  }
}

export async function updateTagAction(tagId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Unauthorized: You must be logged in.' };
  }

  try {
    await connectToDatabase();
    const tagData = {
      name: formData.get('name') as string,
      slug: (formData.get('name') as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      updatedAt: new Date(),
    };

    const existingTag = await Tag.findOne({ slug: tagData.slug, _id: { $ne: tagId } });
    if (existingTag) {
      return { success: false, message: 'A tag with this name already exists.' };
    }

    const tag = await Tag.findByIdAndUpdate(tagId, tagData, { new: true });
    if (!tag) {
      return { success: false, message: 'Tag not found.' };
    }

    revalidatePath('/admin/tags');
    revalidatePath('/admin/posts/new');
    return {
      success: true,
      message: 'Tag updated successfully.',
      tagId: tag._id.toString(),
      redirect: '/admin/tags',
    };
  } catch (error: any) {
    console.error('Error updating tag:', error);
    if (error.name === 'ValidationError') {
      return { success: false, message: `Validation failed: ${error.message}` };
    }
    return { success: false, message: 'An unexpected error occurred while updating the tag.' };
  }
}