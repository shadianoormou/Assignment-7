# বাজার দর · BazarDor

[Live website](https://bazar-dor-kohl-xi.vercel.app) · [GitHub repository](https://github.com/shadianoormou/Assignment-7)

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক বাজারদর দেখার জন্য তৈরি responsive price-tracking application। API থেকে product ও category data নিয়ে Home, Category এবং protected Product Details experience তৈরি করা হয়েছে।

## Features

- Live product, category এবং market-wise price data
- দাম বাড়া/কমার highlights, ticker এবং Bengali-number-aware sorting
- Category filtering এবং dynamic `/product/[slug]` details page
- BetterAuth email/password authentication
- GitHub ও Google social login
- Server-side protected Product Details, Profile এবং Profile Update routes
- Toast feedback, loading state, friendly 404 এবং responsive mobile/tablet/desktop layout
- Protected profile থেকে user name update

## Tech stack

- Next.js 16 App Router
- React 19 + TypeScript
- BetterAuth + MongoDB Atlas
- Tailwind CSS 4 + DaisyUI 5
- React Hot Toast এবং Lucide React

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

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Create a MongoDB Atlas database and set these values in `.env.local`:

   ```env
   BETTER_AUTH_SECRET=replace-with-a-random-string-of-at-least-32-characters
   BETTER_AUTH_URL=http://localhost:3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB_NAME=bazar_dor
   NEXT_PUBLIC_API_BASE_URL=https://openapi.programming-hero.com/api/bazardor
   ```

   BetterAuth uses the MongoDB adapter. Its required collections and indexes are created as the application uses the database. Use a MongoDB deployment that supports transactions.

4. Start the development server:

   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Authentication setup

Add these credentials to `.env.local` for local development and to the hosting provider's environment settings for production:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Register these callbacks using the actual deployed origin:

- Google: `https://bazar-dor-kohl-xi.vercel.app/api/auth/callback/google`
- GitHub: `https://bazar-dor-kohl-xi.vercel.app/api/auth/callback/github`

For local development, replace the origin with `http://localhost:3000`. Credentials must remain in environment settings and must never be committed to Git.

Email verification and forgot password are intentionally omitted because they are not required for this assignment.

## Deployment

1. Import this repository into Vercel as a Next.js project.
2. Add `MONGODB_URI` and `MONGODB_DB_NAME` from MongoDB Atlas.
3. Add `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_API_BASE_URL`, `BETTER_AUTH_URL` when needed, and both OAuth providers' credentials.
4. Keep Vercel system environment variables enabled so the production origin can be resolved safely.
5. Register the production OAuth callback URLs above, then deploy from `main`.

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

The application was checked for API loading, category filtering, sorting, protected-route redirects, dynamic-route reloads, profile update, responsive layouts and social login flows.

## Submission

- Live Link: [https://bazar-dor-kohl-xi.vercel.app](https://bazar-dor-kohl-xi.vercel.app)
- GitHub Repository: [shadianoormou/Assignment-7](https://github.com/shadianoormou/Assignment-7)
