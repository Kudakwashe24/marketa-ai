# Marketa AI

Marketa AI is an AI marketing assistant for small businesses. It turns a short promotion brief into a social caption, WhatsApp promotion, ad copy, marketing tip, and optional social poster.

## Stack

- Next.js 16 and React 19
- Clerk authentication
- Supabase persistence and usage tracking
- Google Gemini text and image generation
- Tailwind CSS 4

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and add the Clerk, Supabase, and Gemini credentials.
3. Run `supabase/schema.sql` in a new Supabase project's SQL editor.
4. Start the app with `npm run dev`.
5. Open `http://localhost:3000`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk browser key |
| `CLERK_SECRET_KEY` | Clerk server key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Server-only Supabase secret key |
| `GEMINI_API_KEY` | Gemini text and image generation |

Never expose `SUPABASE_SECRET_KEY` in browser code or commit real secrets.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Current V1 plans

| Plan | Monthly campaigns | Monthly posters |
| --- | ---: | ---: |
| Free | 5 | 0 |
| Starter | 30 | 10 |
| Growth | 200 | 100 |
| Pro | Unlimited | Unlimited |

Plan definitions live in `lib/plans.ts`. Pricing checkout and subscription webhooks are the next launch-critical integration.
