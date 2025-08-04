export const metadata = {
  title: 'Blog',
  description: 'Your blog powered by Next.js',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}