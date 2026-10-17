# Home Inventory

Vite + React + TypeScript front end, Supabase (Postgres, Auth, private Storage) back end.

## Setup
1. Create a project at supabase.com. Run `supabase/schema.sql` in the SQL Editor.
2. Supabase > Authentication > Providers: keep Email on. Once you've created your account, turn **off** "Allow new users to sign up" so nobody else can register.
3. `cp .env.example .env` and fill in the project URL and anon key.
4. `npm install && npm run dev`

## Deploy (Vercel)
Import the GitHub repo, set **Root Directory** to `inventory-app`, add the two `VITE_` env vars.
Then set Supabase > Authentication > URL Configuration > Site URL to your Vercel URL.
`vercel.json` adds HTTPS-only and CSP security headers.

## Security model
- All access is through Row Level Security: every row and photo is tied to `auth.uid()`.
- Only the public anon key is in the browser; never ship the `service_role` key.
- Photos are in a private bucket and served via 1-hour signed URLs.
