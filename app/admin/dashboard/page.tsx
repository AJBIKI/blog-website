// import  connectToDatabase  from '@/lib/db';
// import Post from '@/models/Post';
// import Category from '@/models/Category';
// import Tag from '@/models/Tag';
// import  RecentPostsTable  from '@/components/dashboard/RecentPostsTable';
// import { StatCard } from '@/components/dashboard/StatCard';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// // FIX: Using common icons for a consistent and professional look.
// import { BookOpen, Tag as TagIcon, Layers3, FileText, CheckCircle2, Clock } from 'lucide-react';
// import Link from 'next/link';

// // --- Data Fetching ---
// // FIX: A more comprehensive data fetching function to gather all dashboard stats in one go.
// async function getDashboardStats() {
//     try {
//         await connectToDatabase();

//         const [
//             publishedCount,
//             draftCount,
//             scheduledCount,
//             categoryCount,
//             tagCount,
//             recentPosts
//         ] = await Promise.all([
//             Post.countDocuments({ status: 'published' }),
//             Post.countDocuments({ status: 'draft' }),
//             Post.countDocuments({ status: 'scheduled' }),
//             Category.countDocuments(),
//             Tag.countDocuments(),
//             Post.find({})
//                 .sort({ createdAt: -1 })
//                 .limit(5)
//                 .select('title slug status createdAt')
//                 .lean(),
//         ]);

//         const totalPosts = publishedCount + draftCount + scheduledCount;

//         return {
//             totalPosts,
//             publishedCount,
//             draftCount,
//             scheduledCount,
//             categoryCount,
//             tagCount,
//             recentPosts: JSON.parse(JSON.stringify(recentPosts)),
//             error: null,
//         };
//     } catch (error) {
//         console.error("Error fetching dashboard stats:", error);
//         // FIX: Return a structured error object for graceful handling in the UI.
//         return {
//             totalPosts: 0,
//             publishedCount: 0,
//             draftCount: 0,
//             scheduledCount: 0,
//             categoryCount: 0,
//             tagCount: 0,
//             recentPosts: [],
//             error: "Could not load dashboard data. Please refresh the page.",
//         };
//     }
// }


// // --- Main Dashboard Page Component ---
// export default async function DashboardPage() {
//     const {
//         totalPosts,
//         publishedCount,
//         draftCount,
//         scheduledCount,
//         categoryCount,
//         tagCount,
//         recentPosts,
//         error
//     } = await getDashboardStats();

//     // FIX: A dedicated component for the page header for better structure.
//     const DashboardHeader = () => (
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
//                 <p className="mt-1 text-gray-600 dark:text-gray-400">A quick overview of your blog's content and activity.</p>
//             </div>
//             <Link
//                 href="/admin/posts/new"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
//             >
//                 Create New Post
//             </Link>
//         </div>
//     );

//     if (error) {
//         return (
//             <div className="text-center py-10">
//                 <h1 className="text-2xl font-bold text-red-600">An Error Occurred</h1>
//                 <p className="text-gray-600 mt-2">{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-8">
//             <DashboardHeader />
            
//             {/* --- Stats Grid --- */}
//             {/* FIX: A more detailed and visually appealing grid of statistics. */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <StatCard 
//                     title="Total Posts" 
//                     value={totalPosts} 
//                     icon={<FileText className="text-blue-500" />} 
//                     color="blue"
//                 />
//                 <StatCard 
//                     title="Published" 
//                     value={publishedCount} 
//                     icon={<CheckCircle2 className="text-green-500" />} 
//                     color="green"
//                 />
//                 <StatCard 
//                     title="Drafts" 
//                     value={draftCount} 
//                     icon={<BookOpen className="text-yellow-500" />} 
//                     color="yellow"
//                 />
//                 <StatCard 
//                     title="Scheduled" 
//                     value={scheduledCount} 
//                     icon={<Clock className="text-purple-500" />} 
//                     color="purple"
//                 />
//                 <StatCard 
//                     title="Categories" 
//                     value={categoryCount} 
//                     icon={<Layers3 className="text-indigo-500" />} 
//                     color="indigo"
//                 />
//                 <StatCard 
//                     title="Tags" 
//                     value={tagCount} 
//                     icon={<TagIcon className="text-pink-500" />} 
//                     color="pink"
//                 />
//             </div>

//             {/* --- Recent Posts Table --- */}
//             {/* FIX: Encapsulated the recent posts list in a styled card for better visual hierarchy. */}
//             <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl">
//                 <div className="p-6 border-b dark:border-gray-700">
//                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Posts</h2>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                         Here are the latest posts you've been working on.
//                     </p>
//                 </div>
//                 <RecentPostsTable posts={recentPosts} />
//             </div>
//         </div>
//     );
// }





import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import RecentPostsTable from '@/components/dashboard/RecentPostsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Icons for consistent and professional look
import { BookOpen, Tag as TagIcon, Layers3, FileText, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

// --- Data Fetching ---
async function getDashboardStats() {
    try {
        await connectToDatabase();

        const [
            publishedCount,
            draftCount,
            scheduledCount,
            categoryCount,
            tagCount,
            recentPosts
        ] = await Promise.all([
            Post.countDocuments({ status: 'published' }),
            Post.countDocuments({ status: 'draft' }),
            Post.countDocuments({ status: 'scheduled' }),
            Category.countDocuments(),
            Tag.countDocuments(),
            Post.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title slug status createdAt')
                .lean(),
        ]);

        const totalPosts = publishedCount + draftCount + scheduledCount;

        return {
            totalPosts,
            publishedCount,
            draftCount,
            scheduledCount,
            categoryCount,
            tagCount,
            recentPosts: JSON.parse(JSON.stringify(recentPosts)),
            error: null,
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            totalPosts: 0,
            publishedCount: 0,
            draftCount: 0,
            scheduledCount: 0,
            categoryCount: 0,
            tagCount: 0,
            recentPosts: [],
            error: "Could not load dashboard data. Please refresh the page.",
        };
    }
}

// --- Main Dashboard Page Component ---
export default async function DashboardPage() {
    // Auth check - redirect if not signed in
    const { userId } = await auth();
    
    if (!userId) {
        redirect('/sign-in');
    }

    const {
        totalPosts,
        publishedCount,
        draftCount,
        scheduledCount,
        categoryCount,
        tagCount,
        recentPosts,
        error
    } = await getDashboardStats();

    // Dashboard Header Component
    const DashboardHeader = () => (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">A quick overview of your blog's content and activity.</p>
            </div>
            <Link
                href="/admin/posts/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
                Create New Post
            </Link>
        </div>
    );

    if (error) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold text-red-600">An Error Occurred</h1>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            <DashboardHeader />
            
            {/* Stats Grid using shadcn/ui Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPosts}</div>
                        <p className="text-xs text-muted-foreground">
                            All posts in your blog
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{publishedCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Live on your website
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <BookOpen className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{draftCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Work in progress
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                        <Clock className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{scheduledCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Ready to publish
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categories</CardTitle>
                        <Layers3 className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{categoryCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Content categories
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tags</CardTitle>
                        <TagIcon className="h-4 w-4 text-pink-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tagCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Content tags
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Posts Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Posts</CardTitle>
                    <CardDescription>
                        Here are the latest posts you've been working on.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RecentPostsTable posts={recentPosts} />
                </CardContent>
            </Card>
        </div>
    );
}