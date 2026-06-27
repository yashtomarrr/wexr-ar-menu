# Deployment Guide

## 1. Deploy to Vercel (recommended)

```bash
npm i -g vercel      # if needed
vercel               # follow prompts → preview
vercel --prod        # production
```

Or push to GitHub and "Import Project" at vercel.com. No build settings needed
(Next.js is auto-detected). The app deploys and runs immediately in **local**
backend mode — perfect for a single-venue demo.

### Environment variables (Vercel → Settings → Environment Variables)

| Key | When | Value |
|-----|------|-------|
| `NEXT_PUBLIC_SITE_URL` | always | Your prod URL, e.g. `https://menu.yourrestaurant.com` (makes QR codes absolute) |
| `NEXT_PUBLIC_BACKEND` | for real orders | `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | if supabase | from Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | if supabase | from Supabase project settings |

> Set `NEXT_PUBLIC_SITE_URL` **before** printing QR codes so they point at the
> live domain.

---

## 2. Enable real-time, cross-device orders (Supabase)

The default local backend keeps orders in the browser. For a real venue where
the **customer's phone** places an order and the **kitchen screen** receives it,
use Supabase.

### a) Create a project
Go to [supabase.com](https://supabase.com) → New Project. Copy the **Project URL**
and **anon public key** from Project Settings → API.

### b) Create the `orders` table
SQL Editor → run:

```sql
create table public.orders (
  id          text primary key,
  created_at  int8 not null,
  status      text not null default 'Pending',
  items       jsonb not null,
  customer    jsonb not null,
  total       numeric not null
);

-- Demo policies (open). Tighten for production with auth/roles.
alter table public.orders enable row level security;

create policy "read orders"   on public.orders for select using (true);
create policy "insert orders" on public.orders for insert with check (true);
create policy "update orders" on public.orders for update using (true);

-- Realtime so the dashboard updates instantly
alter publication supabase_realtime add table public.orders;
```

### c) Configure env and switch driver

```bash
NEXT_PUBLIC_BACKEND=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

Redeploy. Orders now sync across every device in real time. (The code is in
`services/supabaseBackend.ts` and already implements the realtime subscription.)

> Prefer Firebase? Implement the same `BackendService` interface
> (`types/index.ts`) in `services/firebaseBackend.ts` using Firestore
> `onSnapshot`, and select it in `services/index.ts`. No other code changes.

---

## 3. 3D models & AR checklist

- Put `dish.glb` + `dish.usdz` in `public/models/` and reference them in
  `data/menu.ts` (or upload via `/admin`).
- Author models in **metres** → real serving size in AR (`ar-scale="fixed"`).
- AR placement needs **HTTPS** (Vercel gives you this) and a **phone**:
  - **Android**: Chrome → Scene Viewer / WebXR.
  - **iOS**: Safari → AR Quick Look (requires the `.usdz`).

---

## 4. Printing QR codes for tables

Each dish has a QR (visible on `/admin` and on each `/ar/<id>` page) that opens
its AR experience. Workflow:

1. Deploy and set `NEXT_PUBLIC_SITE_URL`.
2. Open `/admin`, screenshot/print each dish's QR, or take a screen capture of
   the QR card on the dish's `/ar/<id>` page.
3. Place the code beside the dish on the physical menu / table tent.

Guests scan with the native camera → land directly in AR. No app install.
