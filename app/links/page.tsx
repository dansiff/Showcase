// app/links/page.tsx
// LinkTree-style social links page

import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Links — The Fusion Space',
  description: 'All my important links in one place',
};

// Customize your profile here
const profile = {
  name: 'Your Name',
  bio: 'Content Creator | Entrepreneur | Innovator',
  avatar: '/images/avatar.jpg', // Place your image in public/images/
  // Or use a URL directly:
  // avatar: 'https://your-image-url.com/avatar.jpg',
};

// Customize your links here
const links = [
  {
    title: '🌐 Website',
    url: 'https://yourwebsite.com',
    description: 'Visit my main website',
  },
  {
    title: '📱 Instagram',
    url: 'https://instagram.com/yourusername',
    description: 'Follow me on Instagram',
  },
  {
    title: '🎥 YouTube',
    url: 'https://youtube.com/@yourchannel',
    description: 'Subscribe to my channel',
  },
  {
    title: '🐦 Twitter',
    url: 'https://twitter.com/yourusername',
    description: 'Follow me on Twitter',
  },
  {
    title: '💼 LinkedIn',
    url: 'https://linkedin.com/in/yourprofile',
    description: 'Connect on LinkedIn',
  },
  {
    title: '📧 Email',
    url: 'mailto:your@email.com',
    description: 'Send me an email',
  },
  {
    title: '🛍️ Shop',
    url: 'https://yourshop.com',
    description: 'Check out my store',
  },
];

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              {profile.avatar.startsWith('http') || profile.avatar.startsWith('/') ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            {profile.name}
          </h1>

          {/* Bio */}
          <p className="text-white/90 text-lg max-w-md mx-auto drop-shadow">
            {profile.bio}
          </p>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white/95 backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-2xl p-6 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {link.title}
                  </h3>
                  {link.description && (
                    <p className="text-sm text-gray-600">
                      {link.description}
                    </p>
                  )}
                </div>
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/80 text-sm">
            Made with ❤️ using{' '}
            <Link href="/" className="underline hover:text-white transition-colors">
              The Fusion Space
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
