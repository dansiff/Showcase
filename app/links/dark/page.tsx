// app/links/dark/page.tsx
// LinkTree-style social links page - Dark Theme

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

export default function LinksDarkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-2xl shadow-purple-500/50">
              {profile.avatar.startsWith('http') || profile.avatar.startsWith('/') ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold">
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
          <p className="text-gray-300 text-lg max-w-md mx-auto">
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
              className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-purple-500 hover:scale-105 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-purple-500/50 p-6 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                    {link.title}
                  </h3>
                  {link.description && (
                    <p className="text-sm text-gray-400">
                      {link.description}
                    </p>
                  )}
                </div>
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all"
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
          <p className="text-gray-400 text-sm">
            Made with ❤️ using{' '}
            <Link href="/" className="text-purple-400 underline hover:text-purple-300 transition-colors">
              The Fusion Space
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
