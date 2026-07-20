# CoolArena

A full-stack web app for CoolArena, an ice rink in Riyadh, Saudi Arabia:
marketing site, public session booking, a customer membership/loyalty
portal, and an admin dashboard — bilingual (English / Arabic with RTL) and
installable as a PWA on mobile.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- next-intl (`/en`, `/ar` routing, RTL layout for Arabic)
- Prisma + SQLite
- Auth.js (NextAuth v5) with credentials login

## Getting started

```bash
npm install
npx prisma migrate dev   # creates dev.db and applies the schema
npx prisma db seed       # demo users, membership plans, ~2 weeks of sessions
npm run dev
```

Open http://localhost:3000.

### Demo logins (seeded)

| Role     | Email                  | Password      |
| -------- | ----------------------- | -------------- |
| Admin    | admin@coolarena.sa      | Admin123!      |
| Customer | customer@coolarena.sa   | Customer123!   |

**Change or remove these before any production deployment.**

## What's implemented

- Marketing pages: home, about, pricing, contact — English + Arabic
- Public schedule with filtering, per-session availability
- Booking flow with a **mock checkout** (clearly labeled, no real payment
  is charged)
- Customer account portal: upcoming/past bookings, cancel, membership
  status and credits
- Membership plans with mock-checkout subscribe/upgrade
- Admin dashboard (role-gated): overview stats, session CRUD, bookings
  management, members + membership plan management
- Installable PWA: web manifest, icons, service worker

## Known simplifications / follow-ups

- **Payments** are mocked (`Payment.status = MOCK_PAID`). Swap in a real
  Saudi gateway (Moyasar, Tap, Mada) once credentials are available.
- **Mobile** is delivered as a responsive, installable PWA rather than a
  separate native iOS/Android app.
- **Database** is SQLite for zero-setup local development. Switch
  `datasource db` in `prisma/schema.prisma` to `postgresql` and update
  `DATABASE_URL` for production.
- Session start/end times are stored and displayed without rink-local
  timezone handling — fine for a single-timezone (Riyadh) deployment, but
  worth revisiting if that changes.
