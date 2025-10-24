// app/links/minimal/page.tsx
// LinkTree-style social links page - Minimal Theme

import Image from 'next/image';

export const metadata = {
  title: 'Links — The Fusion Space',
  description: 'All my important links in one place',
};

// Customize your profile here
const profile = {
  name: 'Your Name',
  bio: 'Content Creator | Entrepreneur | Innovator',
  avatar: '/images/avatar.jpg', // Place your image in public/images/
};

// Customize your links here
const links = [
  {
    title: 'Website',
    url: 'https://yourwebsite.com',
    icon: '🌐',
  },
  {
    title: 'Instagram',
    url: 'https://instagram.com/yourusername',
    icon: '📱',
  },
  {
    title: 'YouTube',
    url: 'https://youtube.com/@yourchannel',
    icon: '🎥',
  },
  {
    title: 'Twitter',
    url: 'https://twitter.com/yourusername',
    icon: '🐦',
  },
  {
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/yourprofile',
    icon: '💼',
  },
  {
    title: 'Email',
    url: 'mailto:your@email.com',
    icon: '📧',
  },
  {
    title: 'Shop',
    url: 'https://yourshop.com',
    icon: '🛍️',
  },
];

export default function LinksMinimalPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Profile Section */}
        <div className="text-center mb-12">
          {/* Avatar */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              {profile.avatar.startsWith('http') || profile.avatar.startsWith('/') ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {profile.name}
          </h1>

          {/* Bio */}
          <p className="text-gray-600 text-base">
            {profile.bio}
          </p>
        </div>

        {/* Links Section */}
        <div className="space-y-3">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200 rounded-lg p-4 group"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">{link.icon}</span>
                <span className="text-lg font-semibold">
                  {link.title}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>
    </div>
  );
}
