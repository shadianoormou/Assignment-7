# বাজার দর · BazarDor

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক বাজারদর এক নজরে দেখার জন্য তৈরি একটি responsive price-tracking application। API থেকে product, category এবং market-wise price data নিয়ে Home, Category ও protected Product Details experience তৈরি করা হয়েছে।

## Key features

- আজ দাম বেড়েছে / কমেছে—এমন product highlights এবং live API-driven product grid
- API-driven price ticker-এ প্রতিটি product-এর বর্তমান দাম, unit এবং পরিবর্তনের হার
- Category filtering, responsive product cards এবং Bengali-number-aware price sorting
- Dynamic `/product/[slug]` details page with min, max, average ও বাজারভিত্তিক আজকের দাম
- BetterAuth email/password authentication এবং server-side protected routes
- Google/GitHub OAuth integration ও success/error feedback (credentials দিয়ে live testing বাকি)
- Toast feedback, loading skeleton, friendly 404 page এবং mobile/tablet/desktop responsive layout
- Protected My Profile page থেকে BetterAuth `updateUser` দিয়ে নাম আপডেট

## Tech stack

- Next.js 16 App Router
- React 19 + TypeScript
- BetterAuth + PostgreSQL for serverless hosting / SQLite for local development
- Tailwind CSS 4 + DaisyUI 5 + design-specific CSS
- Self-hosted Hind Siliguri Bengali font through Next.js
- React Hot Toast
- Lucide React icons

## API

Primary API: `https://openapi.programming-hero.com/api/bazardor`

- `GET /products`
- `GET /products?category=chal`
- `GET /products?slug=alu`
- `GET /categories`

## Run locally

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Set a random `BETTER_AUTH_SECRET` (at least 32 characters), then create the BetterAuth SQLite tables:

   ```bash
   pnpm auth:migrate
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Authentication setup

Email/password works with the local SQLite database. To enable social login, add OAuth credentials in `.env.local`:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Sign-up intentionally does not log the user in; it takes them to Sign In. Normal email login takes the user Home; a protected-page login can return them to the requested page. Product Details, Profile and Profile Update validate the session on the server before rendering protected content. Email verification and password reset are intentionally omitted for this assignment.

Register these OAuth callback URLs using the actual deployed origin:

- Google: `https://your-domain.com/api/auth/callback/google`
- GitHub: `https://your-domain.com/api/auth/callback/github`

For local development, replace the origin with `http://localhost:3000`. See the official [Google setup](https://better-auth.com/docs/authentication/google) and [GitHub setup](https://better-auth.com/docs/authentication/github). Credentials must remain in local/hosting environment settings, never in Git.

## Deploy on Vercel or Netlify

1. Import this GitHub repository as a Next.js project.
2. Attach a persistent managed PostgreSQL database and set `DATABASE_URL`. A project-local SQLite file is not suitable for serverless hosting.
3. Configure `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (the exact live origin), the official `NEXT_PUBLIC_API_BASE_URL`, and both providers' OAuth credentials.
4. Run `pnpm auth:migrate` with those production environment variables to create the PostgreSQL schema. The database must be reachable from the migration environment.
5. Build with `pnpm build` and deploy. The build deliberately does not create or modify production database tables.
6. Register the live OAuth callback URLs above and test both providers with real accounts.

For a Node host with a persistent disk, SQLite is also supported through an absolute `BETTER_AUTH_DB_PATH` on that disk. The application rejects missing production secrets and ephemeral SQLite configuration instead of silently using a development database.

## Main routes

- `/` — Highlights and all products
- `/category/[slug]` — Category product list and sorting
- `/product/[slug]` — Protected product details
- `/signin` and `/signup` — Login and registration
- `/profile` and `/profile/update` — Protected profile and name update

## Verification

```bash
pnpm test
pnpm lint
pnpm build
```

The six regression tests cover Bengali numbers, the Dhaka date, market min/max/average, API outages, malformed responses and unknown slugs. API failures show an error/retry state, not a misleading empty product list.

`pnpm test:smoke` runs 17 HTTP/authentication checks against `http://localhost:3002` (override with `TEST_APP_URL`). It creates synthetic users, so run it only against a local server using a separate, migrated test database. The script refuses to write to a non-local host. For a production-mode local test, provide a random secret, `BETTER_AUTH_URL=http://localhost:3002` and an absolute test `BETTER_AUTH_DB_PATH`, then run `pnpm start --port 3002`.

Local browser checks completed: Home at 320, 375, 768, 1024 and 1440px; both numeric sort orders; category reload; form validation toast; sign-up → Sign In; email login → Home; profile name update and reload; authenticated product reload with all 12 market rows; logout; protected redirect and toast. These checks do not substitute for live deployment and real OAuth testing.

## Production checks

Before submitting, verify the deployed Home, Category, Product Details, Sign In, Sign Up and Profile routes. Also test direct reloads for dynamic routes, mobile layout, API loading, protected redirects and browser console errors.

Deployment and successful Google/GitHub login are still unverified. Do not submit until both providers work, the actual live link is added, and the checks above pass on the deployed site.

## Submission

- Live Link: _Not deployed yet; hosting/database/OAuth configuration is required._
- GitHub Repository: [shadianoormou/Assignment-7](https://github.com/shadianoormou/Assignment-7)
