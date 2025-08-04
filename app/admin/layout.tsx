// import { auth } from '@clerk/nextjs/server';
// import { redirect } from 'next/navigation';
// import Link from 'next/link';
// import { ReactNode } from 'react';

// export default async function AdminLayout({ children }: { children: ReactNode }) {
//   const { userId } = await auth();

//   if (!userId) {
//     redirect('/sign-in');
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md">
//         <div className="p-4">
//           <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
//         </div>
//         <nav className="mt-4">
//           <ul>
//             <li>
//               <Link
//                 href="/admin/dashboard"
//                 className="block px-4 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
//               >
//                 Dashboard
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/admin/posts"
//                 className="block px-4 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
//               >
//                 Posts
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/admin/categories"
//                 className="block px-4 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
//               >
//                 Categories
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/admin/tags"
//                 className="block px-4 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
//               >
//                 Tags
//               </Link>
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         {children}
//       </main>
//     </div>
//   );
// }


import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="flex min-h-screen bg-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 shadow-xl">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                href="/admin/dashboard"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 border-l-4 border-transparent hover:border-blue-500"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/posts"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 border-l-4 border-transparent hover:border-blue-500"
              >
                Posts
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categories"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 border-l-4 border-transparent hover:border-blue-500"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/admin/tags"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 border-l-4 border-transparent hover:border-blue-500"
              >
                Tags
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-700">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}