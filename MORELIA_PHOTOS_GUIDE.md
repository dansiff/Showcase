# Morelia Restaurant - Photo Guide

## 📸 Photo Strategy for Your Website

### Where to Put Photos

All restaurant photos should go in: **`public/images/morelia/`**

This makes them accessible at: `https://yoursite.com/images/morelia/[filename]`

---

## 🎯 Recommended Photos & Placement

### 1. **Hero Section** (Top of page - Most Important!)
**What to photograph:**
- Your **signature birria dish** in beautiful lighting
- **Consomé** (dipping broth) in foreground, tacos in background
- Shot from 45° angle, steam rising from the dish
- Professional food styling with garnishes visible

**Recommended specs:**
- Size: 1920x1080px (landscape)
- Format: `.jpg` or `.webp`
- File name: `hero-birria.jpg`

**Where it shows:** Top banner of the website when visitors first arrive

---

### 2. **About Us Section** (Story/Culture)
**What to photograph:**
- Family photos (owners, chef preparing food)
- Behind-the-scenes kitchen action
- The restaurant exterior/sign
- Traditional cooking equipment (comal, pots)

**Recommended specs:**
- Size: 800x600px
- Format: `.jpg`
- File names: `family.jpg`, `kitchen.jpg`, `exterior.jpg`

---

### 3. **Menu Section** (Individual Dishes)
**What to photograph:**
- Each signature dish:
  - Birria tacos (close-up)
  - Quesabirria (cheese pull shot!)
  - Mulitas
  - Tortas
  - Consomé bowl
  - Horchata/drinks

**Recommended specs:**
- Size: 600x600px (square) or 800x600px
- Format: `.jpg` or `.webp`
- File names: `birria-tacos.jpg`, `quesabirria.jpg`, etc.

**Pro tip:** Take photos with **natural daylight** or soft lighting. Use a plain white/dark background.

---

### 4. **Location Section** (Atmosphere)
**What to photograph:**
- Interior dining area
- Customers enjoying food (with permission)
- Street view of the restaurant
- Parking area

**Recommended specs:**
- Size: 800x600px
- Format: `.jpg`

---

## 📏 Photo Specifications

### Best Formats:
1. **`.jpg`** - Best for photos (smaller file size)
2. **`.webp`** - Modern format (even smaller, great for web)
3. **`.png`** - Only if you need transparency

### Optimal Sizes:
| Usage | Dimensions | Max File Size |
|-------|-----------|---------------|
| Hero banner | 1920x1080px | 500KB |
| Menu items | 600x600px | 200KB |
| Gallery | 800x600px | 300KB |
| Icons/logos | 400x400px | 100KB |

### Image Optimization:
Use free tools to compress photos:
- **TinyPNG** (tinypng.com)
- **Squoosh** (squoosh.app)
- **ImageOptim** (Mac)

---

## 🛠️ How to Add Photos to Your Website

### Step 1: Prepare Your Photos
1. Take high-quality photos with good lighting
2. Crop/edit photos (remove backgrounds if needed)
3. Compress to reduce file size
4. Rename files clearly: `birria-tacos.jpg`, `hero-banner.jpg`

### Step 2: Add to Project
1. Copy photos to: **`public/images/morelia/`**
2. Use descriptive file names (lowercase, dashes instead of spaces)

### Step 3: Update Components

#### Example: Add Hero Image
Edit `components/morelia/MoreliaHero.tsx`:

```tsx
// Add background image
<div 
  className="absolute inset-0 bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/morelia/hero-birria.jpg')",
    opacity: 0.3
  }}
/>
```

#### Example: Add Menu Item Photos
Edit `components/morelia/MoreliaMenu.tsx`:

```tsx
// Add photo to menu item display
<div className="relative h-48 overflow-hidden rounded-lg">
  <img 
    src="/images/morelia/birria-tacos.jpg" 
    alt="Birria Tacos"
    className="w-full h-full object-cover"
  />
</div>
```

---

## 📱 Photo Best Practices

### Lighting:
- ✅ Natural daylight (best)
- ✅ Soft indoor lighting
- ❌ Harsh overhead lights
- ❌ Flash photography

### Composition:
- ✅ 45° angle for food (not directly overhead)
- ✅ Show texture and steam
- ✅ Include garnishes (cilantro, onions, lime)
- ✅ Use props (wooden boards, colorful plates)

### Quality:
- ✅ High resolution (at least 1200px wide)
- ✅ Sharp focus
- ✅ Good color saturation
- ❌ Blurry or pixelated
- ❌ Over-edited/filters

---

## 🎨 Example Photo Layout

### Hero Section (Full Width Banner):
```
+------------------------------------------+
|                                          |
|    TAQUERIA Y BIRRIERA MORELIA #2       |
|    [Large birria photo background]      |
|    "Authentic Birria Since 1995"        |
|                                          |
+------------------------------------------+
```

### Menu Items (Grid):
```
+------------+  +------------+  +------------+
| [Photo]    |  | [Photo]    |  | [Photo]    |
| Birria     |  | Quesabirria|  | Mulitas    |
| $12.99     |  | $14.99     |  | $11.99     |
+------------+  +------------+  +------------+
```

---

## 🔗 Photo Link You Mentioned

You mentioned "here is a link to a photo" but I didn't see the link in your message. Please share the link and I can:
- Download it for you
- Optimize it
- Place it in the correct location
- Update the website code to use it

**Send me:**
1. The photo URL/link
2. What this photo shows (birria, exterior, family, etc.)
3. Where you want it displayed (hero, menu, about section)

---

## ✅ Quick Checklist

Before launching:
- [ ] Hero image added (public/images/morelia/hero-birria.jpg)
- [ ] At least 5 menu item photos
- [ ] Restaurant exterior photo
- [ ] Family/team photo (optional but recommended)
- [ ] All photos compressed under 500KB
- [ ] Photos are .jpg or .webp format
- [ ] File names are lowercase with dashes

---

## 🎯 Next Steps

1. **Take photos** of your dishes and restaurant
2. **Save them** to `public/images/morelia/`
3. **Tell me** which sections need photos updated
4. **I'll add** the code to display them

Let me know once you have photos ready and I'll integrate them into the website!
