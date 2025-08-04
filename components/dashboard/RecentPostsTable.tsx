import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  createdAt: string;
}

interface RecentPostsTableProps {
  posts: Post[];
}

export default function RecentPostsTable({ posts }: RecentPostsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Created Date</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-gray-800">{post.title}</td>
                <td className="py-3 px-6 text-gray-600 capitalize">{post.status}</td>
                <td className="py-3 px-6 text-gray-600">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <Link
                    href={`/admin/posts/${post.slug}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-3 px-6 text-center text-gray-600">
                No recent posts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}