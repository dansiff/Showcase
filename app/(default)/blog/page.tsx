import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - The Fusion Space Inc',
  description: 'Insights, updates, and stories from our team.'
};

const blogPosts = [
  {
    id: 'walking-with-christ-game',
    title: 'Walking with Christ: A New Way to Learn Biblical Teachings Through Gaming',
    excerpt: 'Discover how an innovative educational game is bringing Jesus\' parables and teachings to life for modern learners through interactive storytelling and gameplay.',
    date: 'December 29, 2025',
    author: 'Dan Sandoval',
    category: 'Game Development',
    readTime: '5 min read',
    image: '🕊️',
  },
];

export default function BlogIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-lg text-gray-400">
          Insights, updates, and stories from our team about technology, faith, and innovation.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6 transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                {post.category}
              </span>
              <span>{post.readTime}</span>
            </div>

            <div className="mb-4 text-5xl">{post.image}</div>

            <h2 className="mb-3 text-xl font-bold leading-tight group-hover:text-indigo-400 transition-colors">
              {post.title}
            </h2>

            <p className="mb-4 flex-grow text-sm text-gray-400 line-clamp-3">
              {post.excerpt}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-gray-800 pt-4 text-sm">
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-gray-500">{post.date}</div>
              </div>
              <Link
                href={`/blog/${post.id}`}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
