# WeXR AR Restaurant Menu

A production-ready, white-label **AR restaurant menu**. Guests browse a luxury
menu, tap **View in AR** to place a **life-size 3D dish** on their table, then
order — and the kitchen sees every order on a **live dashboard**. Built to be
resold to many restaurants by editing **data only**.

> Powered by **WeXR Immersive Pvt. Ltd.**

---

## ✨ Features

- **Luxury black & gold UI** — mobile-first, Framer Motion micro-interactions.
- **Augmented Reality** via Google `<model-viewer>` — plane detection, lighting
  estimation, shadows, pinch-zoom / rotate / move, life-size scaling, and a
  graceful fallback to an interactive 3D preview (React Three Fiber + drei).
- **Per-dish QR codes** — scan to jump straight into that dish's AR experience.
- **Ordering** — cart, quantity, checkout (name / phone / table / notes).
- **Live kitchen dashboard** — Pending → Preparing → Ready → Delivered / Cancel,
  with revenue, active orders and popular item. Updates in real time.
- **Admin panel** — add / edit / delete dishes, set price, image, GLB model,
  real size, availability and category. No code required.
- **Pluggable backend** — zero-config local mode by default; flip one env var to
  use **Supabase** for real cross-device, real-time orders.

## 🧱 Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Three.js ·
React Three Fiber · @react-three/drei · Google model-viewer · Framer Motion ·
Zustand · Supabase (optional) · qrcode.react.

---

## 🚀 Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

That's it — it runs with **no configuration**. Try it:

1. Open `/menu`, tap **View in AR** on a dish (use a phone for real AR placement).
2. Add items → checkout at `/checkout` (name, phone, table, notes).
3. Open the **restaurant panel** at `/login` and sign in with the demo credentials:
   - **ID:** `admin`  **Password:** `wexr1234`
4. See the order under **Orders**, advance it New → Preparing → Served → Completed,
   and check the **Analytics** tab for daily/monthly revenue.
5. Manage dishes (price, availability, 3D model) under **Menu** (`/admin`).

> The customer menu (`/`, `/menu`, `/ar/...`) is public. `/dashboard` and
> `/admin` are protected by login (`middleware.ts`).

---

## 🔐 Restaurant login (handover model)

WeXR hands each restaurant **one ID + password**. Set them as environment
variables (server-only — never exposed to the browser):

```bash
ADMIN_ID=thespicegarden
ADMIN_PASSWORD=a-strong-password
AUTH_SECRET=any-long-random-string   # signs the session cookie
```

Login is validated server-side (`app/api/login`) and stored in an httpOnly,
HMAC-signed cookie. To scale to many independent restaurant accounts later,
swap `lib/auth.ts` + `middleware.ts` for **Supabase Auth** — nothing else changes.

## 📊 Orders & revenue (the panel's main job)

- **Orders tab** — every order placed from the menu, with item, quantity, table,
  time and status. One tap advances **New → Preparing → Served → Completed**
  (or Cancel). "Completed" = delivered & done.
- **Analytics tab** — orders today, orders this month, **revenue this month**,
  all-time revenue, average order value, most popular item, and a **per-day
  revenue chart** for the current month. All transparent, derived from orders.

> Orders default to **local** storage (one device/kiosk). For orders placed on
> customers' own phones to reach the panel — and for revenue to persist across
> devices — enable the **Supabase** backend (`NEXT_PUBLIC_BACKEND=supabase`).
> See **DEPLOYMENT.md**.

---

## 🗂️ Project structure

```
app/                       # Next.js App Router pages
  layout.tsx               #   theme injection, navbar, cart, footer
  page.tsx                 #   home (hero + featured)
  menu/                    #   menu grid
  ar/[id]/                 #   fullscreen AR experience (QR target)
  cart/ (drawer)           #   cart lives in a global drawer
  checkout/                #   customer details + submit
  order-confirmation/[id]/ #   success screen
  login/                   #   restaurant panel login
  api/login, api/logout    #   credential auth (sets httpOnly cookie)
  dashboard/               #   order panel: Orders + Analytics tabs (protected)
  admin/                   #   menu manager, no-code (protected)
middleware.ts              # route guard for /dashboard + /admin
lib/auth.ts                # HMAC session cookie (Web Crypto)
components/
  ui/                      # Button, Badges, QuantitySelector, Spinner
  layout/                  # Navbar, Footer
  branding/                # Hero
  menu/                    # DishCard, MenuGrid, CategoryTabs
  ar/                      # ModelPreview (R3F), ARViewer (model-viewer), ArExperience
  cart/                    # CartDrawer
  qr/                      # DishQRCode
  dashboard/               # StatsBar, OrderCard
  admin/                   # DishForm
data/
  restaurant.config.ts     # ⭐ branding + theme  (edit per client)
  menu.ts                  # ⭐ dishes            (edit per client)
store/                     # Zustand stores (cart, dishes)
services/                  # backend interface + local & supabase drivers
hooks/                     # useOrders, useArSupport, useHydrated
utils/                     # cn, format, url, id
types/                     # shared TypeScript types + model-viewer JSX typing
public/                    # logo, dish SVGs, /models for your GLB/USDZ files
```

---

## 🎨 Re-skin for a new restaurant (data only)

Everything below is a **data change** — no component edits.

### 1. Branding & theme — `data/restaurant.config.ts`
Name, tagline, logo, hero copy, currency and the **entire colour theme**
(injected as CSS variables). Change the gold/black to any palette here.

### 2. The menu — `data/menu.ts`
Each dish is one object. You typically only change:

```ts
{
  id: 'butter-chicken',
  name: 'Butter Chicken',
  description: '…',
  price: 449,
  category: 'Main Course',
  image: '/dishes/butter-chicken.jpg',     // photo
  model: '/models/butter-chicken.glb',     // 3D (Android + in-page)
  modelIos: '/models/butter-chicken.usdz', // 3D (iPhone AR)
  realScale: { x: 0.18, y: 0.07, z: 0.18 },// true size in METRES → life-size AR
  rotation: 0,
  veg: false,
  spice: 'Mild',
  bestSeller: true,
  available: true,
  sizeLabel: '18 cm bowl · serves 2',
}
```

You can also do all of this visually in the **/admin** panel.

### 3. 3D models — `public/models/`
The demo ships pointing at a real, AR-capable sample model so it works on day
one. Replace with each dish's real scan:

- Put `name.glb` (Android + in-page 3D) and `name.usdz` (iPhone AR) in
  `public/models/`, then reference `/models/name.glb` in the dish.
- **Author models in metres** so `ar-scale="fixed"` shows true serving size.
- Easiest capture: **Polycam** or **KIRI Engine** on a phone → exports GLB + USDZ.

### 4. Images — `public/dishes/`
Swap the shipped SVG plates for real photos (any URL or local path).

---

## 🔌 Backend modes

| Mode | Set | Behaviour |
|------|-----|-----------|
| **local** (default) | `NEXT_PUBLIC_BACKEND=local` | localStorage + live cross-tab sync. Zero setup. Great for demos / single-venue tablets. |
| **supabase** | `NEXT_PUBLIC_BACKEND=supabase` + keys | Real-time, cross-device orders. See **DEPLOYMENT.md** for the 1-table schema. |

Both implement the same `BackendService` interface (`services/`), so the app
code never changes.

---

## 📦 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Vercel deploy + Supabase setup +
QR-code printing tips.

## 📝 Notes

- Real AR placement requires **HTTPS** and a **phone** (Android Scene Viewer /
  iOS Quick Look). Desktop shows the interactive 3D preview instead.
- iOS AR needs a **.usdz** per dish; Android/in-page use the **.glb**.
