# বাজার দর · BazarDor

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক বাজারদর এক নজরে দেখার জন্য তৈরি একটি responsive price-tracking application। API থেকে product, category এবং market-wise price data নিয়ে Home, Category ও protected Product Details experience তৈরি করা হয়েছে।

## Key features

- আজ দাম বেড়েছে / কমেছে—এমন product highlights এবং live API-driven product grid
- Category filtering, responsive product cards এবং Bengali-number-aware price sorting
- Dynamic `/product/[slug]` details page with min, max, average ও বাজারভিত্তিক আজকের দাম
- BetterAuth email/password authentication, Google/GitHub social-login hooks এবং protected routes
- Toast feedback, loading skeleton, friendly 404 page এবং mobile/tablet/desktop responsive layout
- Protected My Profile page থেকে BetterAuth `updateUser` দিয়ে নাম আপডেট

## Tech stack

- Next.js 16 App Router
- React 19 + TypeScript
- BetterAuth + SQLite adapter
- Plain CSS responsive design
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

3. Set a long `BETTER_AUTH_SECRET`, then create the BetterAuth SQLite tables:

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

For deployment, configure the same variables in the hosting provider and set `BETTER_AUTH_URL` to the deployed URL. Do not commit `.env.local` or the SQLite database.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Highlights and all products |
| `/category/[slug]` | Category product list and sorting |
| `/product/[slug]` | Protected product details |
| `/signin` | Login |
| `/signup` | Registration |
| `/profile` | Protected profile |
| `/profile/update` | Protected profile update |

## Production checks

Before submitting, verify the deployed Home, Category, Product Details, Sign In, Sign Up and Profile routes. Also test direct reloads for dynamic routes, mobile layout, API loading, protected redirects and browser console errors.

## Submission

- Live Link: _add after deployment_
- GitHub Repository: [shadianoormou/Assignment-7](https://github.com/shadianoormou/Assignment-7)
