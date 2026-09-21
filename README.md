# Marketa AI

Marketa AI is an AI marketing workspace for small businesses. A business can save its brand details, describe a promotion, and receive practical copy for social media, WhatsApp, ads, and day-to-day marketing.

## What works today

- Clerk authentication and protected dashboard routes
- A reusable business profile and brand kit
- Preset business categories plus a custom `Other / Not listed` option
- Logo and business-photo uploads, previews, and removal
- Gemini-powered, business-aware campaign copy and daily ideas
- Image context: uploaded photos can help Gemini understand the business or promotion
- Separate social caption, WhatsApp promotion, ad copy, and marketing tip outputs
- Campaign history, prompt reuse, search, and deletion according to plan access
- Downloadable 1080 × 1080 branded posters with the saved logo, colours, and contact details
- Monthly campaign and poster usage limits
- Responsive light/dark AI-style interface

Poster generation currently uses reliable branded templates rendered by the application. It does **not** generate new photorealistic artwork with an image model yet. This keeps poster output predictable while generative-image support is evaluated.

## Tech stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Clerk authentication
- Supabase Postgres and Storage
- Google Gemini for text generation and image understanding

## Local setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy the environment template and add your own credentials:

   ```bash
   cp .env.example .env.local
   ```

3. For a new Supabase project, run `supabase/schema.sql` in the Supabase SQL editor. For an existing project, apply the outstanding files in `supabase/migrations/` in order.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk browser publishable key |
| `CLERK_SECRET_KEY` | Clerk server secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Server-only Supabase secret key |
| `GEMINI_API_KEY` | Server-only Gemini API key |

Never expose `CLERK_SECRET_KEY`, `SUPABASE_SECRET_KEY`, or `GEMINI_API_KEY` in client-side code or commit real credentials.

## Commands

```bash
npm run dev    # Start the local development server
npm run lint   # Run ESLint
npm run build  # Create a production build
npm run start  # Run the production build
```

## Current V1 plans

| Plan | Monthly campaigns | Monthly posters | Notes |
| --- | ---: | ---: | --- |
| Free | 5 | 3 | Watermarked posters and basic history |
| Starter | 30 | 20 | Templates and advanced history |
| Growth | 200 | 100 | Personalized daily ideas |
| Pro | Unlimited | Unlimited | All current features |

The source of truth for limits is `lib/plans.ts`. Paid pricing is displayed in the product, but checkout, recurring subscriptions, and payment webhooks are not integrated yet.

## Before launch

- Connect checkout and subscription webhooks to plan changes
- Add production monitoring, rate limiting, and abuse protection
- Complete mobile and cross-browser QA
- Review AI and poster unit costs against plan limits
- Add generative-image posters only after output quality and cost controls are proven
