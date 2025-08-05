// import { connectToDatabase } from '@/lib/db';
// import Post from '@/models/Post';
// import { notFound } from 'next/navigation';
// import { marked } from 'marked';
// import { Metadata } from 'next';
// import Link from 'next/link';

// export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
//   await connectToDatabase();

//   const post = await Post.findOne({ slug: params.slug })
//     .populate('category', 'name')
//     .populate('tags', 'name')
//     .lean();

//   if (!post) {
//     return {
//       title: 'Post Not Found',
//       description: 'The requested blog post could not be found.',
//     };
//   }

//   return {
//     title: post.title,
//     description: post.content.slice(0, 160),
//     openGraph: {
//       title: post.title,
//       description: post.content.slice(0, 160),
//       type: 'article',
//       publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
//       images: post.coverImage ? [{ url: post.coverImage }] : undefined,
//     },
//   };
// }

// export default async function BlogPostPage({ params }: { params: { slug: string } }) {
//   await connectToDatabase();

//   const post = await Post.findOne({ slug: params.slug })
//     .populate('category', 'name slug')
//     .populate('tags', 'name slug')
//     .lean();

//   if (!post) {
//     notFound();
//   }

//   // Parse markdown content to HTML
//   const htmlContent = marked(post.content);

//   return (
//     <article className="max-w-3xl mx-auto p-6">
//       {post.coverImage && (
//         <img
//           src={post.coverImage}
//           alt={post.title}
//           className="w-full h-64 object-cover rounded-lg mb-6"
//         />
//       )}
//       <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
//       <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
//         <p>
//           Published on {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
//         </p>
//         <p>
//           Category: <Link href={`/blog?category=${post.category._id}`} className="text-blue-600 hover:underline">
//             {post.category.name}
//           </Link>
//         </p>
//         {post.tags.length > 0 && (
//           <p>
//             Tags:{' '}
//             {post.tags.map((tag: any) => (
//               <Link
//                 key={tag._id}
//                 href={`/blog?tag=${tag._id}`}
//                 className="text-blue-600 hover:underline mr-2"
//               >
//                 {tag.name}
//               </Link>
//             ))}
//           </p>
//         )}
//       </div>
//       <div
//         className="prose prose-lg max-w-none"
//         dangerouslySetInnerHTML={{ __html: htmlContent }}
//       />
//     </article>
//   );
// }



import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { Metadata } from 'next';
import Link from 'next/link';
// FIX: Import a sanitizer to prevent XSS attacks from user-generated markdown content.
import DOMPurify from 'isomorphic-dompurify';

// FIX: Define a clear type for the populated post to use throughout the component.
interface PopulatedPost {
    _id: string;
    title: string;
    content: string;
    slug: string;
    status: string;
    coverImage?: string;
    publishedAt?: Date;
    createdAt: Date;
    category: { _id: string; name: string; slug: string };
    tags: { _id: string; name: string; slug: string }[];
}


// --- Data Fetching Function ---
// FIX: Centralize data fetching to avoid querying the database twice.
async function getPost(slug: string): Promise<PopulatedPost | null> {
    try {
        await connectToDatabase();
        const post = await Post.findOne({ 
            slug: slug,
            // FIX: Ensure only published posts are publicly visible.
            status: 'published' 
        })
        .populate('category', 'name slug')
        .populate('tags', 'name slug')
        .lean();

        if (!post) {
            return null;
        }
        // FIX: Ensure the returned object matches the defined type.
        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        console.error("Database error fetching post:", error);
        return null; // Return null on database error.
    }
}


// --- Metadata Generation ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    
    
     const {slug}=await params
    const post = await getPost(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
            description: 'The requested blog post could not be found.',
        };
    }

    // FIX: Create a plain text description by stripping markdown for better SEO.
    const description = post.content.replace(/(\*\*|__|\*|_|`|#+\s?)/g, '').substring(0, 160);

    return {
        title: post.title,
        description: description,
        openGraph: {
            title: post.title,
            description: description,
            type: 'article',
            publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
            images: post.coverImage ? [{ url: post.coverImage }] : [], // FIX: Ensure images is an array.
        },
    };
}


// --- Main Page Component ---
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
     const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    // FIX: Sanitize the HTML content after parsing from Markdown to prevent XSS.
    const htmlContent = await marked(post.content);
    const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);

    return (
        <article className="bg-white dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <header>
                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-8 shadow-lg"
                        />
                    )}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">{post.title}</h1>
                    <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-8 gap-x-4 gap-y-2">
                        <span>
                            Published on {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </span>
                        {/* FIX: Add a check to ensure category exists before rendering. */}
                        {post.category && (
                             <span>
                                In <Link href={`/blog/category/${post.category.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                    {post.category.name}
                                </Link>
                            </span>
                        )}
                    </div>
                </header>

                <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }}
                />

                {/* FIX: Add a check for tags and render them in a visually distinct section. */}
                {post.tags && post.tags.length > 0 && (
                    <footer className="mt-12 pt-6 border-t dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag._id}
                                    href={`/blog/tag/${tag.slug}`} // FIX: Use slug for tag links for better SEO.
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    # {tag.name}
                                </Link>
                            ))}
                        </div>
                    </footer>
                )}
            </div>
        </article>
    );
}
