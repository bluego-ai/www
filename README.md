# bluego.ai

AI-powered employee platform for small and medium businesses.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4)
- **NextAuth v5** (Credentials provider, JWT sessions)
- **Drizzle ORM** + PostgreSQL
- **Vercel** (deployment)

## Getting Started

```bash
npm install
cp .env.example .env.local  # fill in your values
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `AUTH_SECRET` | NextAuth secret (generate with `openssl rand -base64 32`) |
| `AUTH_URL` | Production URL (e.g. `https://www.bluego.ai`) |
| `POSTGRES_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_HOST_URL` | Public-facing URL |

## Routes

- `/` — Landing page
- `/login` — Sign in
- `/signup` — Create account
- `/dashboard` — Fleet monitoring (protected)
