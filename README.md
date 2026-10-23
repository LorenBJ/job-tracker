# Job Tracker

AI-assisted job search tracker: scrapes new listings, keeps only the ones that genuinely match my CV, and pings me on Telegram.

**Live demo:** https://job-tracker-xi-one.vercel.app (login required)

## How it works
- **Search:** scrapes Computrabajo (Argentina) by category and sorts by newest.
- **Match:** Claude reads each listing against the CV and returns at most 5 truly compatible offers.
- **Alert:** compatible offers are saved to Supabase and sent to a Telegram bot.
- **Schedule:** Vercel Cron runs the search 4 times a day.
- **Track:** profile page with CV upload (PDF text extraction) and a pipeline to mark offers as applied and update their status.

## Stack
Next.js · Supabase (auth + Postgres) · Anthropic API · Cheerio · Telegram Bot API · Vercel

## Run locally
```bash
npm install
npm run dev
```
Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_URL`, `CV_TEXTO`, `CV_ROL`, `CV_CATEGORIA`, `CV_UBICACION`.
