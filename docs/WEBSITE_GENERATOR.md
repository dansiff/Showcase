# AI Website Generator

A professional, modular website generation system that creates custom sites based on user requirements.

## Features

### Form Sections (Modular & Expandable)

1. **Basic Information**
   - Business name, tagline, industry
   - Site type selection (business, ecommerce, portfolio, blog, landing, SaaS, restaurant, nonprofit)

2. **Branding & Design**
   - Color scheme presets (modern, professional, vibrant, minimal, dark, elegant, playful, custom)
   - Custom color picker for primary/secondary colors
   - Layout style selection (classic, modern, magazine, minimal, split, sidebar, fullwidth)
   - Brand keywords for AI content generation

3. **Content & Goals**
   - Target audience definition
   - Main business goals
   - Key services/products
   - About business description

4. **Features & Functionality**
   - Contact form
   - Newsletter signup
   - Blog system
   - E-commerce
   - Booking system
   - Photo gallery
   - Testimonials
   - Team section
   - FAQ
   - Live chat
   - Analytics
   - SEO optimization

5. **Pages & Structure**
   - Predefined page selection (Home, About, Services, Contact, etc.)
   - Custom page addition

6. **SEO & Marketing**
   - SEO keywords
   - Meta descriptions (with character counter)
   - Social media links (Facebook, Twitter, Instagram, LinkedIn, YouTube)

7. **Technical Settings**
   - Hosting preference (Vercel, Netlify, AWS, Other)
   - Custom domain configuration
   - Analytics IDs (Google Analytics, Facebook Pixel, Hotjar)

## Technical Architecture

### Frontend
- **Form Component**: `components/generator/WebsiteGeneratorForm.tsx`
  - Collapsible sections for better UX
  - Real-time validation
  - Dynamic array management (keywords, services, goals)
  - Multi-select options

- **Page**: `app/(default)/generator/page.tsx`
  - Themed header/footer integration
  - Responsive layout

- **Preview Page**: `app/(default)/generator/preview/[id]/page.tsx`
  - Real-time generation status
  - Preview, code view, and deploy tabs
  - Download and deployment options

### Backend
- **API Endpoint**: `app/api/generator/create/route.ts`
  - POST: Creates new generation request
  - GET: Checks generation status
  - Validates input
  - Stores configuration in database

### Database
- **Prisma Model**: `GeneratedSite`
  ```prisma
  model GeneratedSite {
    id           String   @id @default(cuid())
    businessName String
    tagline      String?
    industry     String?
    siteType     String[]
    colorScheme  String
    layoutStyle  String
    config       Json     // Full configuration
    status       String   // generating, completed, failed, deployed
    deployUrl    String?
    previewUrl   String?
    sourceCode   String?
    userId       String?
    createdAt    DateTime
    updatedAt    DateTime
    deployedAt   DateTime?
  }
  ```

## Expandability

The system is designed to be modular and easy to expand:

### Adding New Sections
1. Add new section to `FormData` interface
2. Create section component with `SectionHeader`
3. Add toggle logic to `expandedSections`
4. Implement section UI and state management

### Adding New Features
1. Add feature key to `features` object in `FormData`
2. Add to `defaultFeatures` array with label and description
3. Feature automatically appears in UI with toggle functionality

### Adding New Site Types
1. Add type to `SiteType` union
2. Add to `siteTypeOptions` array with icon and description
3. Type becomes selectable in UI

### Integration Points
- **AI Content Generation**: Hook into OpenAI/Anthropic APIs for content
- **Code Generation**: Template system for component generation
- **Deployment**: CI/CD pipeline integration (Vercel, Netlify, AWS)
- **Version Control**: GitHub repo creation and management
- **Asset Management**: Image optimization and CDN integration

## Usage

1. Navigate to `/generator`
2. Fill out the form sections (only business name and site type required)
3. Click "Generate My Website"
4. Wait ~30 seconds for generation
5. Preview, download, or deploy your site

## Future Enhancements

- [ ] Real-time preview rendering
- [ ] AI-powered content generation
- [ ] Component library selection
- [ ] Advanced SEO tools
- [ ] A/B testing setup
- [ ] Multi-language support
- [ ] Theme marketplace
- [ ] Plugin system
- [ ] Version history
- [ ] Collaborative editing
- [ ] White-label options
- [ ] API access for programmatic generation

## API

### Create Site
```typescript
POST /api/generator/create
Body: FormData object
Response: { siteId, previewUrl, estimatedTime }
```

### Check Status
```typescript
GET /api/generator/create?siteId=xxx
Response: { siteId, status, previewUrl, downloadUrl }
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Prisma)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)
