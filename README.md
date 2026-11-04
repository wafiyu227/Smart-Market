# Smart Market

Smart Market is a marketplace for Ghanaian businesses to create online storefronts and for customers to discover local shops and products. Customers can browse by product, category, and location, then contact sellers directly through WhatsApp.

**Live demo:** [smart-market-gamma.vercel.app](https://smart-market-gamma.vercel.app/)

## Features

- Public shop profiles and product catalogs with product images
- Search for shops by category or product, with location filtering
- Seller sign-up, authentication, and a dashboard to manage shop details and products
- Shop visit counts and shareable storefront links
- WhatsApp contact links for customers
- Standard and Pro shop plans: Standard supports up to 10 products; Pro offers unlimited products and shop reviews
- Pro subscriptions paid through Paystack (GHS)
- Admin pages for managing shops, users, reports, analytics, and settings
- Responsive interface and installable Progressive Web App (PWA)

## Technology

- React 19 and React Router
- Vite 7
- Tailwind CSS
- Supabase Authentication, database, and Storage
- Paystack Inline for payments
- `vite-plugin-pwa` for PWA support

## Getting started

### Prerequisites

- Node.js compatible with Vite 7 (Node.js `20.19+` or `22.12+`)
- npm
- A Supabase project

### Install and configure

1. Clone the repository and install dependencies:

   ```sh
   git clone https://github.com/wafiyu227/smart-market.git
   cd smart-market
   npm ci
   ```

2. Create a `.env.local` file in the project root and add your frontend configuration:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
   ```

   The Supabase URL and anon key are required. The Paystack public key is needed for Pro subscription payments. Values prefixed with `VITE_` are included in the client-side app; never put a Supabase service-role key or a Paystack secret key here.

3. Configure Supabase. The application expects Supabase Auth, the database resources it queries (including `profiles`, `shops`, `products`, `shop_visits`, `reviews`, and `payments`), and a Storage bucket named `product-images`. Configure the relevant database and Storage policies for your deployment. Admin features also depend on admin-related tables, views, and the `log_admin_activity` RPC.

   This repository does not include database migrations or a schema setup script, so those backend resources must be provisioned separately.

4. Start the development server:

   ```sh
   npm run dev
   ```

   Vite serves the app at `http://localhost:5173` by default.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```text
.
├── Routes.jsx             # Application routes
├── public/                # Icons and static PWA assets
└── src/
    ├── components/        # Shared UI and route guards
    ├── context/           # Authentication, shop, and admin state
    ├── hooks/             # Reusable React hooks
    ├── lib/               # Supabase and Paystack configuration
    ├── pages/             # Public, seller, and admin pages
    └── utils/             # Subscription helpers
```

## Production build

Run `npm run build` to generate the static site in `dist/`, then deploy that directory to a static hosting provider. Configure the host to serve the app entry point for client-side routes, and provide the Supabase variables (and the Paystack public key if enabling payments) at build time.
