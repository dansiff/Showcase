# Multi-Portal Platform Architecture

## Overview
**The Fusion Space Platform** - A unified ecosystem supporting three distinct user experiences:

1. **👥 Fan Portal** - Content consumption, creator discovery, subscriptions
2. **🎨 Creator Portal** - Content management, analytics, monetization
3. **🏢 Client Portal** - Website project management, intake, monitoring

---

## Core Concept: Multi-Role Support

Users can have **multiple roles simultaneously**:
- A creator can also be a fan of other creators
- A client can become a creator
- Admins have access to everything

### Database Design
```prisma
model User {
  role       UserRole @default(USER)  // Primary role
  creator    Creator?                  // Has creator profile?
  profile    Profile?                  // Has fan profile?
  // ClientIntake entries link via email (no direct relation needed)
}

enum UserRole {
  USER      // Default fan/consumer
  CREATOR   // Content producer
  ADMIN     // Platform admin
  CLIENT    // Website/service client
}
```

---

## Portal Architecture

### 1. Unified Portal Hub (`/portal`)
**Landing page after login** that shows all available portals for the user.

```
┌─────────────────────────────────────────────┐
│         Welcome back, [Name]!               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   👥     │  │   🎨     │  │   🏢     │ │
│  │   FAN    │  │ CREATOR  │  │  CLIENT  │ │
│  │  PORTAL  │  │  PORTAL  │  │  PORTAL  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│  [Quick Actions Based on Recent Activity]   │
│  [Notifications] [Messages] [Settings]      │
└─────────────────────────────────────────────┘
```

**Features:**
- Auto-detects available portals based on user data
- Shows recent activity across all portals
- Quick action buttons
- Role-specific notifications

---

### 2. Fan Portal (`/fan`)

**Purpose:** Browse, discover, and consume creator content

#### Key Features:

##### 🔍 **Creator Discovery**
- Search creators by name, category, tags
- Browse featured/trending creators
- Filter by content type (photos, videos, blogs)
- Sort by popularity, newest, price

##### 📱 **Content Feed**
- Personalized feed from subscribed creators
- Free preview content
- Locked premium content (subscribe to unlock)
- Like, comment, share functionality

##### 💖 **Subscriptions**
- View active subscriptions
- Manage payment methods
- Subscription history
- Cancel/upgrade options

##### 👤 **Fan Profile**
- Avatar, bio, preferences
- Favorite creators
- Purchase history
- Content collections/bookmarks

##### 🔔 **Notifications**
- New content from subscribed creators
- Exclusive offers
- Creator updates

#### UI Structure:
```
/fan
  /discover          → Creator search & browse
  /feed              → Content from subscriptions
  /subscriptions     → Manage active subs
  /favorites         → Bookmarked content
  /profile           → Fan profile settings
  /history           → Purchase history
```

---

### 3. Creator Portal (`/creator` or `/dashboard`)

**Purpose:** Manage content, subscribers, and earnings

#### Key Features:

##### 📊 **Dashboard Overview**
- Earnings summary (today, week, month)
- Active subscribers count
- Content performance metrics
- Recent activity timeline

##### 📤 **Content Management**
- Upload photos, videos, documents
- Create text posts, blogs
- Set visibility (free, subscribers-only, paid)
- Schedule posts
- Organize into collections/albums

##### 🖼️ **Media Library**
- Grid/list view of all uploads
- Search and filter
- Bulk actions (delete, move, publish)
- Storage usage indicator

##### 🎨 **Creator Page Customization**
- Banner/header image
- Bio and description
- Social links
- Theme colors
- Featured content sections

##### 👥 **Subscriber Management**
- List all subscribers
- View subscriber details
- Send messages/announcements
- Export subscriber data

##### 💰 **Monetization**
- Create/edit subscription plans
- Set pricing tiers
- Manage payouts
- Revenue analytics
- Tax forms/documents

##### 📈 **Analytics**
- Views, likes, engagement
- Subscriber growth
- Revenue trends
- Top performing content

#### UI Structure:
```
/creator
  /dashboard         → Overview & quick stats
  /content
    /upload          → Upload new content
    /library         → All content grid
    /posts           → Manage posts
    /media           → Manage photos/videos
  /page              → Customize creator page
  /subscribers       → Subscriber list & management
  /plans             → Subscription pricing
  /earnings          → Revenue & payouts
  /analytics         → Performance metrics
  /settings          → Creator profile settings
```

---

### 4. Client Portal (`/client`)

**Purpose:** Manage website development projects

#### Key Features:

##### 🏠 **Client Dashboard**
- Active project status
- Upcoming milestones
- Recent updates
- Payment history

##### 📋 **Project Management**
- View project details
- Track progress (phases/milestones)
- Review deliverables
- Approve/request changes

##### 💬 **Communication**
- Message thread with dev team
- File sharing
- Meeting scheduler
- Feedback/revision requests

##### 📊 **Basic Website Analytics** (Post-Launch)
- Visitor count
- Page views
- Geographic data
- Performance metrics

##### 💳 **Billing & Payments**
- View invoices
- Payment history
- Deposit tracking
- Remaining balance

##### 📁 **Files & Assets**
- Access design files
- Download delivered assets
- Brand guidelines
- Documentation

#### UI Structure:
```
/client
  /dashboard         → Project overview
  /projects
    /[id]            → Specific project details
    /timeline        → Project timeline
    /deliverables    → View/download files
  /messages          → Communication center
  /analytics         → Website stats (post-launch)
  /billing           → Invoices & payments
  /requests          → Submit new project requests
  /settings          → Client profile settings
```

---

## Smart Routing Logic

### On Sign-In
```typescript
// After authentication
const user = await fetchUserWithRelations();

// Detect available portals
const availablePortals = {
  fan: true,                           // Everyone is a fan by default
  creator: !!user.creator,             // Has creator profile?
  client: hasClientIntakes(user.email),// Has active projects?
  admin: user.role === 'ADMIN'         // Is admin?
};

// Redirect logic
if (user.role === 'ADMIN') {
  redirect('/admin');
} else if (Object.keys(availablePortals).filter(k => availablePortals[k]).length > 1) {
  redirect('/portal');  // Multiple portals → show hub
} else if (user.creator) {
  redirect('/creator/dashboard');
} else if (hasClientIntakes(user.email)) {
  redirect('/client/dashboard');
} else {
  redirect('/fan/discover');
}
```

---

## Prisma Schema Extensions

### Add Client Model (Optional)
```prisma
model Client {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String   @unique
  company   String?
  phone     String?
  projects  ClientIntake[]
  createdAt DateTime @default(now())
}

model User {
  // ... existing fields
  client    Client?
}
```

### Update ClientIntake
```prisma
model ClientIntake {
  // ... existing fields
  client      Client?  @relation(fields: [clientId], references: [id])
  clientId    String?
  assignedTo  User?    @relation(fields: [assignedToId], references: [id], name: "AssignedProjects")
  assignedToId String?
}
```

---

## Enhanced Features Roadmap

### Phase 1: Core Portals ✅
- Portal hub page
- Basic fan discovery
- Creator content upload
- Client project view

### Phase 2: Advanced Creator Tools
- **Analytics Dashboard**
  - Real-time subscriber count
  - Engagement metrics
  - Revenue forecasting
  - Content performance scoring

- **Content Scheduler**
  - Calendar view
  - Bulk schedule
  - Auto-publish
  - Draft management

- **Subscriber Tiers**
  - Multiple price points
  - Tier-exclusive content
  - Upgrade/downgrade flows
  - Trial periods

- **Collaboration**
  - Co-creator posts
  - Revenue splitting
  - Guest appearances
  - Cross-promotion tools

### Phase 3: Fan Experience
- **Social Features**
  - Follow creators
  - Like/comment/share
  - Creator messaging
  - Fan community forums

- **Content Collections**
  - Custom playlists
  - Bookmarks/favorites
  - Download for offline
  - Gift subscriptions

- **Personalization**
  - AI-powered recommendations
  - Content preferences
  - Notification settings
  - Custom feed algorithms

### Phase 4: Client Portal
- **Project Collaboration**
  - Kanban board
  - Task assignments
  - Deadline tracking
  - Progress milestones

- **Design Approval System**
  - Mockup reviews
  - Annotation tools
  - Version history
  - Approval workflows

- **Website Analytics**
  - Google Analytics integration
  - SEO performance
  - Uptime monitoring
  - Performance scores

### Phase 5: Advanced Platform
- **Mobile Apps**
  - iOS & Android apps
  - Push notifications
  - Offline mode
  - Camera integration

- **API & Integrations**
  - Public API
  - Zapier integration
  - Webhooks
  - OAuth for third-party apps

- **AI Features**
  - Content moderation
  - Automatic tagging
  - Smart cropping
  - Caption generation

- **Marketplace**
  - Creator templates
  - Premium themes
  - Third-party plugins
  - Services marketplace

---

## Navigation Structure

### Global Header
```
[Logo] [Portal Selector ▼] [Search] [Notifications] [Profile ▼]

Portal Selector Dropdown:
  • 👥 Fan Portal
  • 🎨 Creator Portal      (if creator)
  • 🏢 Client Portal       (if has projects)
  • ⚙️ Admin Panel         (if admin)
```

### Portal-Specific Sidebars

**Fan Portal:**
- 🏠 Home Feed
- 🔍 Discover
- ⭐ Favorites
- 💳 Subscriptions
- 👤 Profile

**Creator Portal:**
- 📊 Dashboard
- 📤 Upload
- 📁 Library
- 🎨 My Page
- 👥 Subscribers
- 💰 Earnings
- 📈 Analytics

**Client Portal:**
- 🏠 Dashboard
- 📋 Projects
- 💬 Messages
- 📊 Analytics
- 💳 Billing
- ⚙️ Settings

---

## Technical Recommendations

### 1. State Management
Use **React Context** for portal switching:
```typescript
const PortalContext = createContext({
  currentPortal: 'fan' | 'creator' | 'client',
  availablePortals: string[],
  switchPortal: (portal: string) => void
});
```

### 2. Route Protection
Middleware to check portal access:
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const user = await getUser(request);
  const portal = getPortalFromPath(request.nextUrl.pathname);
  
  if (portal === 'creator' && !user.creator) {
    return NextResponse.redirect('/portal');
  }
  // ... similar checks
}
```

### 3. Component Library
Create portal-specific component sets:
- `components/fan/*`
- `components/creator/*`
- `components/client/*`
- `components/shared/*`

### 4. API Architecture
Organize APIs by portal:
```
/api/fan/*        → Fan-specific endpoints
/api/creator/*    → Creator-specific endpoints
/api/client/*     → Client-specific endpoints
/api/shared/*     → Cross-portal endpoints
```

### 5. Database Optimization
- Add indexes for common queries
- Use database views for complex joins
- Implement caching (Redis) for hot data
- Background jobs for heavy operations

---

## Implementation Priority

### Week 1: Portal Hub & Routing
1. Create `/portal` hub page
2. Implement smart routing logic
3. Update sign-in/signup flows
4. Add portal switcher in header

### Week 2: Creator Portal Core
1. Content upload UI
2. Media library grid
3. Basic analytics dashboard
4. Creator page customization

### Week 3: Fan Portal Core
1. Creator discovery page
2. Content feed
3. Subscription management
4. Fan profile page

### Week 4: Client Portal Core
1. Project dashboard
2. Project detail view
3. File downloads
4. Basic analytics

### Week 5: Polish & Integration
1. Cross-portal navigation
2. Notifications system
3. Search functionality
4. Mobile responsiveness

---

## Success Metrics

### Fan Portal
- Daily active users
- Creator discovery rate
- Subscription conversion %
- Content engagement (likes, views)

### Creator Portal
- Content upload frequency
- Subscriber retention
- Revenue per creator
- Platform stickiness

### Client Portal
- Project completion time
- Client satisfaction score
- Payment success rate
- Repeat client rate

---

This architecture provides a solid foundation for a robust, scalable multi-portal platform. Ready to start implementing! 🚀
