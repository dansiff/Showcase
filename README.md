# Showcase Dev Notes (Taco Orders & Games Arcade)

This README documents the newly added Taco pickup ordering flow and the Snack Arcade games enhancements.

## Taco Pickup Ordering Flow

### Components & Routes
- UI Component: `components/TacoOrder.tsx` (client component, dynamic menu, cart, pickup time selection).
- Page Mount: `app/(default)/taco/page.tsx` imports `TacoOrder` via dynamic import (no SSR).
- API Route: `app/api/taco/orders/route.ts` (POST) persists orders + items via Prisma.
- Prisma Models: `Order`, `OrderItem` added to `prisma/schema.prisma`.

### Data Model
```
model Order {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  customerName String
  customerPhone String
  pickupAt    DateTime
  totalCents  Int
  items       OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  sku       String
  qty       Int
  unitCents Int
}
```

### Migration Steps
If you have not yet migrated the Order models:

```powershell
# Ensure DIRECT_URL is set (e.g. postgres://user:pass@host:5432/db?sslmode=require)
# then run dev migration
npx prisma migrate dev --name add_orders

# Regenerate client in case only generate is needed
npx prisma generate
```

If you're deploying to Vercel and using a pooled connection (port 6543) for runtime, ensure `DIRECT_URL` (port 5432) is available for migrations.

### Testing the API
```powershell
# Simple order creation via curl (PowerShell Invoke-WebRequest alt shown)
$body = '{"customerName":"Test User","customerPhone":"555-1212","pickupAt":"2025-11-21T18:00","items":[{"id":"t1","qty":2},{"id":"bowl","qty":1}]}'
Invoke-WebRequest -Uri http://localhost:3000/api/taco/orders -Method POST -Body $body -ContentType 'application/json'
```
Expect JSON: `{ "id": "...", "total": <cents> }`.

### Extending
- Add authentication: wrap POST route with role/session checks.
- Add status field: pending, preparing, ready, picked-up.
- Add admin dashboard: filter orders by pickup window.
- Replace hard-coded menu map with Prisma `MenuItem` table.

## Snack Arcade (Games)
Enhanced file: `app/(default)/game/page.tsx`.

### Features Added
- Dark gradient theme, animated card hovers.
- Snake: WASD + arrow control, length score, high score persistence, pause (P), mute (M), particle trail, difficulty ramp.
- Space Invaders: multi-key fire (Space/F/J/+), score & wave tracking, high score persistence, pause/mute, particle explosions, speed ramp.
- Tic Tac Toe & Memory: updated styling & descriptive copy.

### Key Controls
- Global: P (pause), M (mute) inside each game.
- Snake: Arrows or WASD.
- Invaders: Arrows or A/D. Fire with Space/F/J/+ (Numpad +).

### LocalStorage Keys
- `snakeHigh` — highest recorded snake length.
- `invadersHigh` — highest recorded invaders score.

### Next Improvements (Optional)
- Global leaderboard using Prisma.
- Sound settings persisted across sessions.
- Power-ups (Snake speed boost, Invaders multi-shot).
- Accessibility: Add focusable buttons for controls.

## Navigation Updates
- Root layout nav links added: Home, Arcade (`/game`), Tacos (`/taco`), Portal (`/portal`).
- Homepage (`app/(default)/page.tsx`) includes CTA cards linking to Arcade and Taco order page.

## Verification Checklist
- [ ] Run `npm run dev` and visit `/taco` — order form renders & POST creates DB rows.
- [ ] Run `npx prisma studio` to verify `Order` and `OrderItem` rows.
- [ ] Visit `/game` — all games load, controls responsive, no console errors.
- [ ] LocalStorage updates high scores after play sessions.

## Commands Reference
```powershell
npm run dev            # Start Next.js locally
npx prisma migrate dev --name add_orders  # Apply order models migration
npx prisma generate    # Regenerate Prisma client types
npx prisma studio      # Inspect & edit data
npm run build          # Production build
npm start              # Start production server locally
```

## Troubleshooting
- Migration fails: Verify `DIRECT_URL` is set and reachable (port 5432) and not the pooled port if using Supabase/Vercel.
- Order API 500: Check server logs for schema mismatch; ensure migration and generate are run.
- High scores not persisting: Confirm localStorage access (browser context only) and no blocking extensions.
- Audio not playing: Some browsers require a user interaction before AudioContext starts — press a key.

---
Maintained by continuous iterative enhancements. Feel free to extend with additional mini-games or ordering features.
