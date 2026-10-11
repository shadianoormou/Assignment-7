# বাজার দর · BazarDor

[Live website](https://assignment-7-kohl-xi.vercel.app) · [GitHub repository](https://github.com/shadianoormou/Assignment-7)

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক বাজারদর এক নজরে দেখার জন্য তৈরি একটি responsive price-tracking application। API থেকে product, category এবং market-wise price data নিয়ে Home, Category ও protected Product Details experience তৈরি করা হয়েছে।

## Key features

- আজ দাম বেড়েছে / কমেছে—এমন product highlights এবং live API-driven product grid
- API-driven price ticker-এ প্রতিটি product-এর বর্তমান দাম, unit এবং পরিবর্তনের হার
- Category filtering, responsive product cards এবং Bengali-number-aware price sorting
- Dynamic `/product/[slug]` details page with min, max, average ও বাজারভিত্তিক আজকের দাম
- BetterAuth email/password authentication এবং server-side protected routes
- GitHub OAuth live login যাচাই করা হয়েছে; Google integration ও success/error feedback আছে, তবে Google credentials setup ও live testing বাকি
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

Email/password works with SQLite locally and persistent Neon PostgreSQL on the live Vercel deployment. To enable social login, add OAuth credentials in `.env.local` for development and the hosting environment settings for production:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Sign-up intentionally does not log the user in; it takes them to Sign In. Normal email login takes the user Home; a protected-page login can return them to the requested page. Product Details, Profile and Profile Update validate the session on the server before rendering protected content. Email verification and password reset are intentionally omitted for this assignment.

Register these OAuth callback URLs using the actual deployed origin:

- Google: `https://assignment-7-kohl-xi.vercel.app/api/auth/callback/google`
- GitHub: `https://assignment-7-kohl-xi.vercel.app/api/auth/callback/github`

For local development, replace the origin with `http://localhost:3000`. See the official [Google setup](https://better-auth.com/docs/authentication/google) and [GitHub setup](https://better-auth.com/docs/authentication/github). Credentials must remain in local/hosting environment settings, never in Git.

## Deploy on Vercel or Netlify

1. Import this GitHub repository as a Next.js project.
2. Attach a persistent managed PostgreSQL database and set `DATABASE_URL`. A project-local SQLite file is not suitable for serverless hosting.
3. Configure `BETTER_AUTH_SECRET`, the official `NEXT_PUBLIC_API_BASE_URL`, and both providers' OAuth credentials. Set `BETTER_AUTH_URL` to the exact live origin on non-Vercel hosts. On Vercel Production, the application also resolves the stable origin from `VERCEL_PROJECT_PRODUCTION_URL`; keep system environment variables enabled. An explicit `BETTER_AUTH_URL` takes precedence. Never use a temporary deployment URL for the registered OAuth callback.
4. Set `DATABASE_URL_UNPOOLED` to the direct PostgreSQL connection for migrations, while `DATABASE_URL` uses the pooled connection for application traffic. Run `pnpm auth:migrate` with those environment variables. The database must be reachable from the migration environment. For an empty PostgreSQL database, `better-auth-postgresql.sql` is also available as a one-time bootstrap; the original `better-auth-schema.sql` is SQLite-only.
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

The 14 regression tests cover Bengali numbers, the Dhaka date, market min/max/average, API outages, malformed responses and array entries, unknown slugs, category-filter isolation, public summary-only data, and authentication-origin selection (explicit override, stable Vercel Production origin, and no implicit production origin for local/preview environments). API failures show an error/retry state, not a misleading empty product list. Category sorting receives only the card fields; market tables are passed to the authenticated Product Details page, not to public sorting or the ticker.

`pnpm test:smoke` runs 17 HTTP/authentication checks against `http://localhost:3002` (override with `TEST_APP_URL`). It creates synthetic users, so run it only against a local server using a separate, migrated test database. The script refuses to write to a non-local host. For a production-mode local test, provide a random secret, `BETTER_AUTH_URL=http://localhost:3002` and an absolute test `BETTER_AUTH_DB_PATH`, then run `pnpm start --port 3002`.

Local browser checks completed: Home at 320, 375, 768, 1024 and 1440px; both numeric sort orders; category reload; form validation toast; sign-up → Sign In; email login → Home; profile name update and reload; authenticated product reload with all 12 market rows; logout; protected redirect and toast. These checks do not substitute for live deployment and real OAuth testing.

## Production checks

Before submitting, verify the deployed Home, Category, Product Details, Sign In, Sign Up and Profile routes. Also test direct reloads for dynamic routes, mobile layout, API loading, protected redirects and browser console errors.

### Verified live deployment (11 October 2026)

- A persistent Neon PostgreSQL 18 project, `bazar-dor-assignment7`, is provisioned on the Free plan in Singapore.
- Database `bazardoor`, branch `production`: the four BetterAuth tables (`user`, `session`, `account`, `verification`) and their lookup indexes have been created and verified.
- Existing self-managed BetterAuth is preserved; Neon-managed authentication is not enabled.
- Vercel Production is published at [assignment-7-kohl-xi.vercel.app](https://assignment-7-kohl-xi.vercel.app), connected to Neon using a pooled PostgreSQL connection. The database password and a random authentication secret are stored only in hosting settings.
- 18 live HTTP checks passed: Home, all eight categories, Sign In/Sign Up, the hero asset, unauthenticated protected redirects, and friendly unknown-route handling. Next.js streaming redirects/not-found responses were checked semantically, not only by HTTP status.
- 14 live database/authentication checks passed using a synthetic test account: registration without automatic sign-in, invalid-password rejection, secure session cookie, email login, authenticated Product/Profile/Profile Update reloads, profile update, logout, session invalidation, and persistence of the updated name after a new login.
- Live browser checks passed: protected-product login returns to the requested product; Product Details reload displays all 12 market rows; profile name update survives reload; both numeric category sort orders and category reload work; logout redirects a subsequent protected Profile request to Sign In.
- Home renders all 33 API products at 320, 375, 768, 1024 and 1440px without page-level horizontal overflow. Category and Product Details were also checked at 375px. No warning/error console messages were captured in this live browser test session.
- `pnpm test` (14 tests), `pnpm lint` and `pnpm build` passed before the latest application publication.

### Final requirements audit (11 October 2026)

- Product Details now includes an explicit category tag alongside its unit and change badge. Public category sorting and the ticker receive only card-summary fields, not market-table data.
- API responses are validated entry by entry; missing fields, invalid prices, malformed market ranges and invalid change directions produce the retry/error state. Category filtering also checks the returned category, even if an upstream endpoint ignores the filter.
- The two application fixes were pushed separately as `c242293` and `e855296`; both Vercel Production deployments reached Ready.
- 24 live HTTP/authentication/data checks passed across the audit batches: Home, all eight category reloads, auth-route responses, the hero asset, protected redirects, friendly invalid routes, persistent database login, authenticated Product/Profile/Profile Update reloads, logout/session invalidation and the contributor list. Initial streaming HTML is not treated as proof that client forms or detail tags rendered; those were checked after hydration in the browser.
- Browser rechecks passed for six cards in each price-mover section, 33 products, eight category links, the animated ticker, the Home anchor scrolling to its section, both numeric sort orders and default sorting after reload. Sign Up validation toast, Sign In/Sign Up fields and both social buttons were checked at 375px. The authenticated mobile Product Details page showed its category tag and all 12 market rows, with no page-level horizontal overflow.
- Home was rechecked at 320, 375, 768, 1024 and 1440px: all 33 products rendered without page-level horizontal overflow. The fresh audit browser tab captured no warning/error console messages.
- The existing real GitHub session remained usable after redeployment, including Profile and Product Details reloads. GitHub's contributor API lists only `shadianoormou`.
- Navbar/Footer alignment was corrected in a separate design commit, `ce6c520`, whose Vercel deployment reached Ready. The supplied Penpot reference was inspected directly: at 1440px, the brand starts at x=154, category links start at x=160 in a 49px second row, and the one-line light footer is 69px tall. Those measurements were verified on the published site; dynamic dates and actual user names are preserved rather than copied from the mockup.
- The logged-in native profile dropdown supports keyboard activation, Profile navigation and closing after selection. Profile reload preserved the real GitHub session. The updated Home rendered all 33 products at 320, 375, 768, 1024 and 1440px without page-level horizontal overflow; mobile category selection closed the menu, retained its active highlight and reloaded all five vegetable cards. The fresh browser session captured no warning/error console messages. The 14 tests, lint and production build passed for this change.
- Sign-out from the updated dropdown returned Home and changed the header back to Sign In/Sign Up. A subsequent Profile request redirected to Sign In. A new real GitHub sign-in then returned Home with the social-login success toast, without requesting additional permissions.
- **The assignment is still not fully complete:** Google OAuth client creation remains blocked by the Google Cloud console's “Failed to load” page. No Google credentials were fabricated and real Google login has not been tested.

### Social login verification and remaining setup

- **GitHub real-account login is verified.** Account-owner verification is complete; the client ID and client secret are stored only in Vercel Production. After authorization for `read:user` and `user:email`, a fresh login returned Home with the success toast. Profile reload preserved the GitHub session; protected Product Details and its direct reload displayed all 12 market rows. Logout ended the session, and a subsequent protected-product request redirected to Sign In. An initial `state_mismatch` was safely rejected; a fresh sign-in succeeded without disabling OAuth state validation.
- The dedicated Google Cloud project `Bazar Dor Assignment 7` (`proven-cogency-511310-a7`) exists and was verified in the project selector. The Google Auth Platform consent configuration is now saved as an external app with the live support/contact email. Google’s OAuth client form accepted the production origin and callback URL, but the final client creation failed on Google’s side (`Create failed`, tracking number `c60845814050655`; the legacy route also returned a page-load failure). No Google Client ID or Client Secret was fabricated or added to Vercel. Real Google sign-in is **not verified**.
- The social-login code and buttons are implemented, but they are not a substitute for configured credentials and successful real-account callback tests. Do not consider all assignment requirements complete until both providers are configured and tested.

The database owner can manage the project in the [Neon console](https://console.neon.tech/app/projects/lingering-snow-97898076/branches/br-broad-math-azd6bzym). Connection passwords and OAuth credentials are not included in this repository.

Before submitting, complete Google OAuth setup and its real-account login check. GitHub login, the live link, persistent database and live route/reload checks are ready.

## Submission

- Live Link: [https://assignment-7-kohl-xi.vercel.app](https://assignment-7-kohl-xi.vercel.app)
- GitHub Repository: [shadianoormou/Assignment-7](https://github.com/shadianoormou/Assignment-7)
