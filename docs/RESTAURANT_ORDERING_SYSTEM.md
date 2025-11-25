# Restaurant Ordering System - MVP Guide

## Overview
Feature-rich restaurant ordering system for taco pickup orders with admin management, real-time tracking, and customer-facing interfaces.

## Core Features

### Customer Features
- **Menu Browsing**: Category-based menu with descriptions, pricing, allergen info
- **Customization**: Per-item customization options (toppings, preferences)
- **Smart Cart**: Automatic grouping of identical items with customizations
- **Pricing Transparency**: Subtotal, tax (8.5%), tip options (0%, 10%, 15%, 20%)
- **Pickup Scheduling**: Date/time picker with estimated ready times
- **Special Instructions**: Order-level and item-level notes
- **Order Tracking**: Phone-based order lookup with real-time status

### Admin Features
- **Order Dashboard**: Live view of all orders with status filtering
- **Status Management**: Update orders through workflow (pending → confirmed → preparing → ready → completed)
- **Quick Stats**: Active orders, upcoming pickups, revenue totals
- **Order Details**: Expandable view with full breakdown, customer info, timeline
- **Batch Actions**: Quick status change buttons for efficient workflow

### Technical Features
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Notifications**: Email/Slack/Discord webhooks for new orders
- **Audit Trail**: Full status history with timestamps and notes
- **Phone Search**: Customer order lookup by phone number
- **Responsive Design**: Mobile-optimized for kitchen tablets and customer phones

## Database Schema

### Core Models
- **MenuCategory**: Menu organization (Tacos, Bowls, Sides)
- **MenuItem**: Products with pricing, allergens, prep times
- **CustomizationOption**: Per-item add-ons and modifications
- **Order**: Customer orders with status, pricing breakdown, timestamps
- **OrderItem**: Line items with snapshots and customizations
- **OrderStatusHistory**: Audit trail for status changes

### Order Status Flow
1. **pending** - Initial order submission
2. **confirmed** - Restaurant acknowledges order
3. **preparing** - Food being prepared
4. **ready** - Ready for customer pickup
5. **completed** - Order picked up
6. **cancelled** - Order cancelled

## Setup Instructions

### 1. Run Database Migration
```powershell
npx prisma migrate dev --name add_restaurant_features
```

### 2. Seed Menu Data
```powershell
npx tsx scripts/seed-menu.ts
```

This creates:
- 3 categories (Tacos, Bowls, Sides & Drinks)
- 6 taco varieties (Carne Asada, Pollo, Carnitas, Al Pastor, Veggie, Fish)
- 3 bowl options
- 6 sides/drinks
- Customization options for each item

### 3. Environment Variables
Add to `.env`:
```env
# Notifications (optional)
ADMIN_EMAIL=your@email.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/WEBHOOK/URL

# SMTP for email notifications (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
```

### 4. Update Taco Page
Replace the old TacoOrder component with the enhanced version:

```tsx
// app/(default)/taco/page.tsx
import TacoOrderEnhanced from '@/components/TacoOrderEnhanced'

export default function TacoPage() {
  return (
    <div>
      <TacoOrderEnhanced />
    </div>
  )
}
```

## File Structure

```
app/
├── (default)/
│   ├── taco/page.tsx              # Customer ordering page
│   └── track-order/page.tsx       # Order tracking page
├── admin/
│   └── orders/page.tsx            # Admin dashboard
└── api/
    └── taco/
        ├── menu/route.ts          # GET menu with categories
        ├── orders/route.ts        # GET/POST orders
        └── orders/[id]/route.ts   # GET/PATCH single order

components/
├── TacoOrderEnhanced.tsx          # Main ordering interface
└── AdminOrdersDashboard.tsx       # Admin management UI

lib/
└── notifications.ts               # Email/Slack/Discord hooks

scripts/
└── seed-menu.ts                   # Menu data seeder

prisma/
└── schema.prisma                  # Database models
```

## API Endpoints

### `GET /api/taco/menu`
Fetch full menu with categories and customizations.

**Response:**
```json
{
  "categories": [
    {
      "id": "...",
      "name": "Tacos",
      "items": [
        {
          "sku": "taco-carne-asada",
          "name": "Carne Asada Taco",
          "priceCents": 450,
          "customizations": [...]
        }
      ]
    }
  ]
}
```

### `POST /api/taco/orders`
Create new order.

**Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "(555) 123-4567",
  "pickupAt": "2025-11-25T18:30:00",
  "specialInstructions": "Extra napkins please",
  "tipCents": 200,
  "items": [
    {
      "sku": "taco-carne-asada",
      "name": "Carne Asada Taco",
      "qty": 2,
      "unitCents": 450,
      "customizations": [
        { "id": "...", "name": "Extra meat", "priceCents": 200 }
      ],
      "specialRequest": "Well done"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "clxxx...",
  "total": 1300,
  "estimatedReadyAt": "2025-11-25T18:25:00"
}
```

### `GET /api/taco/orders?phone=555-123-4567`
List orders by phone number (for customer tracking).

### `GET /api/taco/orders?status=pending&limit=50`
List orders with optional filters (for admin dashboard).

### `PATCH /api/taco/orders/[id]`
Update order status.

**Body:**
```json
{
  "status": "preparing",
  "note": "Started at 6:15pm"
}
```

## User Flows

### Customer Ordering Flow
1. Visit `/taco`
2. Browse menu by category
3. Click "Add" on item → Customization panel appears
4. Select customizations, add special request
5. "Add to Cart" → Item appears in cart sidebar
6. Repeat for all items
7. Enter name, phone, email (optional)
8. Select pickup time
9. Choose tip percentage
10. Review total breakdown
11. "Place Order"
12. See confirmation with order ID and pickup time

### Customer Tracking Flow
1. Visit `/track-order`
2. Enter phone number
3. "Search"
4. See all orders with current status
5. View detailed timeline, items, pricing

### Admin Workflow
1. Visit `/admin/orders`
2. See dashboard with quick stats
3. Filter by status (pending, confirmed, preparing, etc.)
4. Click order to expand details
5. Use quick action buttons to change status
6. View status history and customer info
7. Auto-refreshes every 30 seconds

## Customization Guide

### Adding New Menu Items
```typescript
await prisma.menuItem.create({
  data: {
    categoryId: 'category-id',
    sku: 'unique-sku',
    name: 'Item Name',
    description: 'Description',
    priceCents: 500,
    allergens: 'dairy,gluten',
    prepTimeMins: 10,
    customizations: {
      create: [
        { name: 'Extra Topping', priceCents: 100 }
      ]
    }
  }
})
```

### Adjusting Tax Rate
Edit `app/api/taco/orders/route.ts`:
```typescript
const TAX_RATE = 0.085 // Change to your local rate
```

### Notification Customization
Edit `lib/notifications.ts` to modify email templates, Slack/Discord payloads.

## Production Considerations

### Security
- [ ] Add authentication to `/admin/orders`
- [ ] Rate limit order submission API
- [ ] Validate phone format server-side
- [ ] Sanitize special instructions input

### Performance
- [ ] Cache menu data (revalidate on updates)
- [ ] Paginate orders list for high volume
- [ ] Add database indexes for phone lookups

### Features to Add
- [ ] SMS notifications via Twilio
- [ ] Receipt generation (PDF)
- [ ] Analytics dashboard (revenue, popular items)
- [ ] Inventory management
- [ ] Menu item availability schedules
- [ ] Discount codes and promotions
- [ ] Online payment (Stripe/Square)
- [ ] Multi-location support

## Testing

### Test Order Creation
```powershell
curl -X POST http://localhost:3000/api/taco/orders `
  -H "Content-Type: application/json" `
  -d '{
    "customerName": "Test User",
    "customerPhone": "555-0100",
    "pickupAt": "2025-11-25T18:30:00",
    "items": [{
      "sku": "taco-carne-asada",
      "name": "Carne Asada Taco",
      "qty": 2,
      "unitCents": 450
    }],
    "tipCents": 100
  }'
```

### Test Order Tracking
1. Place order via UI
2. Note the phone number used
3. Visit `/track-order`
4. Enter phone number
5. Verify order appears with correct details

### Test Admin Dashboard
1. Visit `/admin/orders`
2. Create test orders with different statuses
3. Test filtering by status
4. Test status updates
5. Verify auto-refresh

## Troubleshooting

### Menu not loading
- Verify migration ran: `npx prisma migrate status`
- Check seed script completed: `npx tsx scripts/seed-menu.ts`
- Inspect browser console for API errors

### Orders not appearing in admin
- Check Prisma client generated: `npx prisma generate`
- Verify database connection in `.env`
- Check browser network tab for API errors

### Notifications not sending
- Verify webhook URLs in `.env`
- Check server logs for notification errors
- Test webhooks with curl

## License & Credits
Built with Next.js 15, Prisma, TypeScript, Tailwind CSS.
Icon components from Lucide React.
