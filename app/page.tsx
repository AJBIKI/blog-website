// 'use client';

// import { useEffect } from 'react';
// import Link from 'next/link';
// import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

// // --- Header Component with Clerk Integration ---
// // This component shows different links based on the user's authentication state.
// const Header = () => {
//     useEffect(() => {
//         const header = document.getElementById('header');
//         if (!header) return;

//         const handleScroll = () => {
//             if (window.scrollY > 10) {
//                 header.classList.add('bg-gray-900/80', 'backdrop-blur-sm', 'shadow-lg');
//             } else {
//                 header.classList.remove('bg-gray-900/80', 'backdrop-blur-sm', 'shadow-lg');
//             }
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     return (
//         <header id="header" className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
//             <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//                 <Link href="/" className="text-2xl font-bold text-white">
//                     NexusCMS
//                 </Link>
//                 <nav className="hidden md:flex items-center space-x-8">
//                     {/* FIX: Added link to the main blog listing page */}
//                     <Link href="/blog" className="text-gray-300 hover:text-white transition">Blog</Link>
//                     <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
//                     <a href="#testimonials" className="text-gray-300 hover:text-white transition">Testimonials</a>
//                 </nav>
//                 <div className="flex items-center space-x-4">
//                     {/* FIX: Clerk's SignedOut component only shows content to logged-out users. */}
//                     <SignedOut>
//                         <Link href="/sign-in" className="text-gray-300 hover:text-white transition font-medium">
//                             Sign In
//                         </Link>
//                         <Link href="/sign-up" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg transition-transform transform hover:scale-105">
//                             Get Started
//                         </Link>
//                     </SignedOut>
//                     {/* FIX: Clerk's SignedIn component only shows content to logged-in users. */}
//                     <SignedIn>
//                         <Link href="/admin/dashboard" className="text-gray-300 hover:text-white transition font-medium">
//                             Dashboard
//                         </Link>
//                         <UserButton afterSignOutUrl="/" />
//                     </SignedIn>
//                 </div>
//             </div>
//         </header>
//     );
// };


// // --- Main Page Component ---
// export default function LandingPage() {
//     useEffect(() => {
//         // Scroll Animations
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('is-visible');
//                 }
//             });
//         }, { threshold: 0.1 });

//         document.querySelectorAll('.animate-on-scroll').forEach(el => {
//             observer.observe(el);
//         });

//         // Cleanup observer on component unmount
//         return () => observer.disconnect();
//     }, []);

//     return (
//         <>
//             {/* The CSS from the original <style> tag is assumed to be in a global CSS file (e.g., app/globals.css) */}
//             <Header />

//             <main className="pt-24">
//                 {/* Hero Section */}
//                 <section className="hero-bg py-20 md:py-32">
//                     <div className="container mx-auto px-6 text-center">
//                         <div className="animate-fade-in-up">
//                             <span className="inline-block bg-gray-800 text-indigo-400 text-sm font-semibold px-4 py-1 rounded-full mb-4">
//                                 The Future of Content Management is Here
//                             </span>
//                             <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
//                                 Publish Content <span className="gradient-text">Effortlessly</span>
//                             </h1>
//                             <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-10">
//                                 NexusCMS provides a powerful, developer-friendly platform with a beautiful admin dashboard to manage your blog and content with ease. Focus on creating, we'll handle the rest.
//                             </p>
//                             <div className="flex justify-center items-center space-x-4">
//                                 <Link href="/sign-up" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transition-transform transform hover:scale-105">
//                                     Start for Free
//                                 </Link>
//                                 <a href="#features" className="border-2 border-gray-700 hover:bg-gray-800 text-white font-bold text-lg px-8 py-4 rounded-xl transition">
//                                     Learn More
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Features Section */}
//                 <section id="features" className="py-20 bg-gray-900">
//                     <div className="container mx-auto px-6">
//                         <div className="text-center mb-16">
//                             <h2 className="text-4xl font-bold text-white">Everything You Need to Succeed</h2>
//                             <p className="text-lg text-gray-400 mt-4">A powerful toolkit designed for modern content creators.</p>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                             {/* Feature Cards... (content is unchanged) */}
//                             <div className="animate-on-scroll bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 shadow-lg">
//                                 <div className="bg-indigo-600/20 text-indigo-400 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
//                                 </div>
//                                 <h3 className="text-2xl font-bold text-white mb-3">Effortless Publishing</h3>
//                                 <p className="text-gray-400">Create, edit, and schedule posts with a beautiful Markdown editor and a seamless workflow.</p>
//                             </div>
//                             <div className="animate-on-scroll bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 shadow-lg" style={{transitionDelay: '100ms'}}>
//                                 <div className="bg-indigo-600/20 text-indigo-400 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
//                                 </div>
//                                 <h3 className="text-2xl font-bold text-white mb-3">Powerful Dashboard</h3>
//                                 <p className="text-gray-400">Get a complete overview of your content, manage posts, and view key stats all in one place.</p>
//                             </div>
//                             <div className="animate-on-scroll bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 shadow-lg" style={{transitionDelay: '200ms'}}>
//                                 <div className="bg-indigo-600/20 text-indigo-400 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
//                                 </div>
//                                 <h3 className="text-2xl font-bold text-white mb-3">SEO Optimized</h3>
//                                 <p className="text-gray-400">Automatic sitemaps, clean URLs, and metadata tools to help you rank higher in search results.</p>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
                
//                 {/* Testimonials Section */}
//                 <section id="testimonials" className="py-20 bg-gray-900">
//                     <div className="container mx-auto px-6">
//                         <div className="text-center mb-16">
//                             <h2 className="text-4xl font-bold text-white">Loved by Creators Worldwide</h2>
//                             <p className="text-lg text-gray-400 mt-4">Don't just take our word for it. Here's what people are saying.</p>
//                         </div>
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                            {/* Testimonial Cards... (content is unchanged) */}
//                            <div className="animate-on-scroll bg-gray-800 p-8 rounded-2xl border border-gray-700/50">
//                                 <p className="text-gray-300 mb-6">"NexusCMS has completely transformed my blogging workflow. The dashboard is intuitive and the performance is incredible. I can finally focus on writing."</p>
//                                 <div className="flex items-center">
//                                     <img className="w-12 h-12 rounded-full mr-4" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Avatar of Jane Doe" />
//                                     <div>
//                                         <p className="font-bold text-white">Jane Doe</p>
//                                         <p className="text-sm text-indigo-400">Tech Blogger</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="animate-on-scroll bg-gray-800 p-8 rounded-2xl border border-gray-700/50" style={{transitionDelay: '150ms'}}>
//                                 <p className="text-gray-300 mb-6">"As a developer, I appreciate how easy it is to customize and extend. The code is clean and the Next.js foundation is solid. Highly recommended!"</p>
//                                 <div className="flex items-center">
//                                     <img className="w-12 h-12 rounded-full mr-4" src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="Avatar of John Smith" />
//                                     <div>
//                                         <p className="font-bold text-white">John Smith</p>
//                                         <p className="text-sm text-indigo-400">Software Engineer</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="animate-on-scroll bg-gray-800 p-8 rounded-2xl border border-gray-700/50" style={{transitionDelay: '300ms'}}>
//                                 <p className="text-gray-300 mb-6">"The best CMS I've ever used. It's fast, beautiful, and has all the features I need without the bloat of other platforms. A game-changer."</p>
//                                 <div className="flex items-center">
//                                     <img className="w-12 h-12 rounded-full mr-4" src="https://i.pravatar.cc/150?u=a042581f4e29026704f" alt="Avatar of Sarah Lee" />
//                                     <div>
//                                         <p className="font-bold text-white">Sarah Lee</p>
//                                         <p className="text-sm text-indigo-400">Marketing Director</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* CTA Section */}
//                 <section id="pricing" className="py-20">
//                     <div className="container mx-auto px-6">
//                         <div className="bg-gradient-to-r from-indigo-700 to-purple-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
//                             <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Start Publishing?</h2>
//                             <p className="text-lg text-indigo-200 mb-8 max-w-2xl mx-auto">
//                                 Join thousands of creators building their futures on NexusCMS. Get started today for free. No credit card required.
//                             </p>
//                             <Link href="/sign-up" className="bg-white text-indigo-600 font-bold text-lg px-10 py-4 rounded-xl shadow-lg transition-transform transform hover:scale-105">
//                                 Create Your Blog Now
//                             </Link>
//                         </div>
//                     </div>
//                 </section>
//             </main>

//             {/* Footer */}
//             <footer className="bg-gray-900 border-t border-gray-800">
//                 <div className="container mx-auto px-6 py-8">
//                     <div className="flex flex-col md:flex-row justify-between items-center">
//                         <p className="text-gray-400">&copy; 2025 NexusCMS. All rights reserved.</p>
//                         <div className="flex space-x-6 mt-4 md:mt-0">
//                             <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
//                             <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
//                         </div>
//                     </div>
//                 </div>
//             </footer>
//         </>
//     );
// }

















'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-white">
                    NexusCMS
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
                    <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                    <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
                </nav>
                <div className="flex items-center space-x-4">
                    <SignedOut>
                        <Link href="/sign-in" className="text-gray-300 hover:text-white transition-colors font-medium">
                            Sign In
                        </Link>
                        <Link href="/sign-up" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg transition-colors">
                            Get Started
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/admin/dashboard" className="text-gray-300 hover:text-white transition-colors font-medium">
                            Dashboard
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 py-20 md:py-32">
                    <div className="container mx-auto px-6 text-center">
                        <span className="inline-block bg-gray-800 text-indigo-400 text-sm font-semibold px-4 py-1 rounded-full mb-6">
                            The Future of Content Management is Here
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                            Publish Content{' '}
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Effortlessly
                            </span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-10">
                            NexusCMS provides a powerful, developer-friendly platform with a beautiful admin dashboard to manage your blog and content with ease. Focus on creating, we'll handle the rest.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link href="/sign-up" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transition-all duration-200 hover:scale-105">
                                Start for Free
                            </Link>
                            <a href="#features" className="border-2 border-gray-600 hover:bg-gray-800 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200">
                                Learn More
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-gray-900">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
                            <p className="text-lg text-gray-400">A powerful toolkit designed for modern content creators.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 shadow-lg hover:shadow-xl hover:border-gray-600 transition-all">
                                <div className="bg-indigo-600/20 text-indigo-400 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Effortless Publishing</h3>
                                <p className="text-gray-400">Create, edit, and schedule posts with a beautiful Markdown editor and a seamless workflow.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 shadow-lg hover:shadow-xl hover:border-gray-600 transition-all">
                                <div className="bg-indigo-600/20 text-indigo-400 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Powerful Dashboard</h3>
                                <p className="text-gray-400">Get a complete overview of your content, manage posts, and view key stats all in one place.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 shadow-lg hover:shadow-xl hover:border-gray-600 transition-all">
                                <div className="bg-indigo-600/20 text-indigo-400 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">SEO Optimized</h3>
                                <p className="text-gray-400">Automatic sitemaps, clean URLs, and metadata tools to help you rank higher in search results.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 bg-gray-800">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">Loved by Creators Worldwide</h2>
                            <p className="text-lg text-gray-400">Don't just take our word for it. Here's what people are saying.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Testimonial 1 */}
                            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700/50">
                                <p className="text-gray-300 mb-6">"NexusCMS has completely transformed my blogging workflow. The dashboard is intuitive and the performance is incredible."</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
                                        <span className="text-white font-bold">JD</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Jane Doe</p>
                                        <p className="text-sm text-indigo-400">Tech Blogger</p>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial 2 */}
                            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700/50">
                                <p className="text-gray-300 mb-6">"As a developer, I appreciate how easy it is to customize and extend. The code is clean and the Next.js foundation is solid."</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                                        <span className="text-white font-bold">JS</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">John Smith</p>
                                        <p className="text-sm text-indigo-400">Software Engineer</p>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial 3 */}
                            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700/50">
                                <p className="text-gray-300 mb-6">"The best CMS I've ever used. It's fast, beautiful, and has all the features I need without the bloat of other platforms."</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center mr-4">
                                        <span className="text-white font-bold">SL</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Sarah Lee</p>
                                        <p className="text-sm text-indigo-400">Marketing Director</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gray-900">
                    <div className="container mx-auto px-6">
                        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
                            <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Start Publishing?</h2>
                            <p className="text-lg text-indigo-200 mb-8 max-w-2xl mx-auto">
                                Join thousands of creators building their futures on NexusCMS. Get started today for free. No credit card required.
                            </p>
                            <Link href="/sign-up" className="bg-white text-indigo-600 font-bold text-lg px-10 py-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 inline-block">
                                Create Your Blog Now
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400">&copy; 2025 NexusCMS. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}


// import { SignedIn, SignedOut } from '@clerk/nextjs';

// export default function TestClerk() {
//   return (
//     <div className="min-h-screen bg-blue-500 text-white p-8">
//       <h1 className="text-4xl font-bold">CLERK TEST</h1>
//       <SignedOut>
//         <p>You are signed out</p>
//       </SignedOut>
//       <SignedIn>
//         <p>You are signed in</p>
//       </SignedIn>
//     </div>
//   )
// }