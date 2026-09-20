# Supabase Setup Guide

## Environment Variables

Create a `.env.local` file in the project root (already excluded by `.gitignore`):

```bash
# Required for Supabase integration
VITE_SUPABASE_URL=https://zgtrtrxearlhoqmyyhrp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>

# Backend API (optional — defaults to https://job-api.gaury.dev)
VITE_PYTHON_API_URL=https://job-api.gaury.dev
```

## Local Development

```bash
npm install
npm run dev     # http://localhost:3000
```

## Database Migrations

Apply the migration to your Supabase project. You can do this through:

### Option A: Supabase Dashboard (SQL Editor)
1. Open https://supabase.com/dashboard → your project → SQL Editor
2. Copy and paste the contents of `supabase/migrations/20260920_001_initial_schema.sql`
3. Click **Run**

### Option B: Supabase CLI
```bash
npx supabase db push
```

### What the migration creates:
- **`profiles`** table with RLS (auto-created on user signup via trigger)
- **`eligibility_results`** table with RLS and user-scoped index
- **`handle_updated_at()`** trigger for `profiles.updated_at`
- **`handle_new_user()`** trigger to auto-create profile on signup
- RLS policies enforcing per-user read/write access

## Supabase Auth Configuration

In the Supabase Dashboard → Authentication → URL Configuration:

### Redirect URLs
Add the following to **Redirect URLs**:
- `http://localhost:3000` (local development)
- `https://job.gaury.dev` (production)

### Auth Providers
- **Email** — Enabled (email/password auth)
- **Google** — Disabled unless explicitly enabled later

### Email Templates (optional)
- Customize the confirmation email template under Authentication → Email Templates

## Production / Vercel

### Environment Variables in Vercel
Set the following in your Vercel project's Environment Variables:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://zgtrtrxearlhoqmyyhrp.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key |
| `VITE_PYTHON_API_URL` | `https://job-api.gaury.dev` |

### Build Command
```bash
npm run build
```

### Output Directory
```
dist
```

## Security Notes

- The `.env.local` file is excluded by `.gitignore` and must never be committed
- Only the **anon/publishable key** is used in frontend code — never the service role key
- All database access is protected by Row-Level Security (RLS)
- RLS policies enforce per-user access using `auth.uid()`
- The FastAPI backend contract is preserved unchanged

## Manual Steps Required

1. **Apply the SQL migration** to your Supabase project (see above)
2. **Add redirect URLs** in Supabase Auth settings
3. **Set environment variables** in Vercel for production
4. **Test email confirmation flow** — Supabase may require email confirmation for new signups
