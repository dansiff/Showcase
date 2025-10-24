# LinkTree-Style Social Links Pages

I've created 3 different LinkTree-style pages for you! No login required, fully customizable.

## 📍 Live URLs

- **Colorful Theme**: `http://localhost:3000/links`
- **Dark Theme**: `http://localhost:3000/links/dark`
- **Minimal Theme**: `http://localhost:3000/links/minimal`

## 🎨 Customization Guide

### 1. Update Your Profile Info

In each file, edit the `profile` object:

```typescript
const profile = {
  name: 'Your Name',                    // Your display name
  bio: 'Your bio here',                 // Short description
  avatar: '/images/avatar.jpg',         // Path to your profile picture
};
```

### 2. Add Your Profile Picture

**Option A: Use a local image**
1. Place your image in `public/images/avatar.jpg`
2. Set `avatar: '/images/avatar.jpg'`

**Option B: Use an external URL**
```typescript
avatar: 'https://example.com/your-image.jpg'
```

**Option C: Use a fallback letter avatar**
- If image doesn't load, it shows your first initial in a colored circle

### 3. Customize Your Links

Edit the `links` array:

```typescript
const links = [
  {
    title: '🌐 Website',                    // Button text
    url: 'https://yourwebsite.com',        // Link destination
    description: 'Visit my main website',  // Optional subtitle
  },
  // Add more links...
];
```

**Common Links to Add:**
- Instagram: `https://instagram.com/yourusername`
- TikTok: `https://tiktok.com/@yourusername`
- YouTube: `https://youtube.com/@yourchannel`
- Twitter/X: `https://twitter.com/yourusername`
- LinkedIn: `https://linkedin.com/in/yourprofile`
- Twitch: `https://twitch.tv/yourusername`
- Discord: `https://discord.gg/yourinvite`
- Patreon: `https://patreon.com/yourname`
- Email: `mailto:your@email.com`
- Phone: `tel:+1234567890`
- WhatsApp: `https://wa.me/1234567890`

### 4. Emojis for Icons

Add emojis to your link titles for visual appeal:
- 🌐 Website
- 📱 Instagram
- 🎥 YouTube/TikTok
- 🐦 Twitter
- 💼 LinkedIn
- 🎮 Gaming/Twitch
- 💬 Discord
- 📧 Email
- 📞 Phone
- 🛍️ Shop/Store
- 💰 Support/Donate
- 📚 Blog
- 🎵 Music/Spotify
- 📷 Photography

## 🎨 Theme Differences

### Colorful Theme (`/links`)
- Vibrant gradient background (purple → pink → orange)
- White cards with shadows
- Best for: Creative professionals, influencers

### Dark Theme (`/links/dark`)
- Dark gradient with purple accents
- Glass-morphism effect
- Best for: Tech creators, gamers, developers

### Minimal Theme (`/links/minimal`)
- Clean white background
- Black borders, simple design
- Best for: Professionals, minimalists

## 📝 Files to Edit

1. **Colorful**: `app/links/page.tsx`
2. **Dark**: `app/links/dark/page.tsx`
3. **Minimal**: `app/links/minimal/page.tsx`

## 🚀 Quick Start

1. Choose your favorite theme
2. Edit the file with your info
3. Add your profile picture to `public/images/`
4. Update the links array with your URLs
5. Visit the page in your browser!

## 💡 Tips

- **Keep it short**: 5-10 links work best
- **Order matters**: Put most important links first
- **Test links**: Click each button to verify they work
- **Mobile friendly**: All themes are responsive
- **No login needed**: Perfect for sharing with anyone
- **SEO friendly**: Each page has proper metadata

## 🔗 Sharing Your Page

Once deployed, share your link:
- `https://yourdomain.com/links`
- `https://yourdomain.com/links/dark`
- `https://yourdomain.com/links/minimal`

Perfect for:
- Instagram bio
- TikTok bio
- Twitter bio
- YouTube channel description
- Business cards
- Email signatures

## 🎯 Advanced Customization

### Change Colors

Edit the Tailwind classes in the files:
- Background: `bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400`
- Buttons: `bg-white/95 hover:bg-white`
- Text: `text-white`, `text-gray-900`

### Add Analytics

Add tracking to each link:
```typescript
onClick={() => {
  // Track click with your analytics tool
  gtag('event', 'click', { link: link.title });
}}
```

### Add Social Icons

Replace emoji with icon libraries like:
- React Icons
- Heroicons
- Font Awesome

Enjoy your new link page! 🎉
