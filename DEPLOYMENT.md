# Marwa Crystal — Production Deployment

Deploy target: [Vercel — marwa-crystal team](https://vercel.com/marwa-crystal)  
Source: [GitHub — dgitalcode/marwa-crystal](https://github.com/dgitalcode/marwa-crystal)

## Pre-flight checklist

- [ ] PostgreSQL database provisioned (Neon, Supabase, or Vercel Postgres)
- [ ] Cloudinary account with API credentials
- [ ] GitHub repository connected to Vercel
- [ ] All environment variables set in Vercel (Production + Preview)
- [ ] `NEXTAUTH_SECRET` generated (`openssl rand -base64 32`)
- [ ] Admin password changed after first login

## Vercel environment variables

Set these in **Project Settings → Environment Variables** for Production (and Preview if needed):

| Variable | Required | Example / notes |
|----------|----------|-----------------|
| `DATABASE_URL` | Yes | `postgresql://user:pass@host:5432/marwa_crystal?sslmode=require` |
| `NEXTAUTH_URL` | Yes | `https://your-domain.vercel.app` (must match deployed URL) |
| `NEXTAUTH_SECRET` | Yes | Random 32+ char secret |
| `NEXT_PUBLIC_STORE_NAME` | Yes | `Marwa Crystal` |
| `NEXT_PUBLIC_STORE_URL` | Yes | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Yes | `212704460891` (digits only, no `+`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Yes | `marwacrystal1@gmail.com` |
| `CLOUDINARY_CLOUD_NAME` | Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Yes | Server-side only — never expose in client code |
| `CLOUDINARY_API_SECRET` | Yes | Server-side only |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Optional | Same as `CLOUDINARY_CLOUD_NAME` if using client widgets |
| `ADMIN_EMAIL` | Seed only | Used by `npm run db:seed` |
| `ADMIN_PASSWORD` | Seed only | Change after first deploy |

**Never commit `.env` or real secrets to Git.**

## Build & migrations

Vercel runs:

```bash
npm run vercel-build
# → prisma generate && prisma migrate deploy && next build
```

Migrations live in `prisma/migrations/`. The production database schema is applied automatically on each deploy when `DATABASE_URL` is available at build time.

### First deploy — seed data

After the first successful deploy, run locally against the production database:

```bash
DATABASE_URL="your-production-url" npm run db:seed
```

This creates the default admin account and sample catalog data.

## Cloudinary

- **Logo uploads** (Admin → Paramètres): uploaded to `marwa-crystal/logos` via signed server-side API.
- **Product images**: paste Cloudinary URLs in Admin → Produits (one URL per line). Images are served via `next/image` with `res.cloudinary.com` allowed in `next.config.ts`.
- On Vercel, local filesystem uploads are disabled; Cloudinary credentials are mandatory for logo uploads.

## WhatsApp floating button

The floating button reads `NEXT_PUBLIC_WHATSAPP_PHONE`. Production value:

```
212704460891
```

Verify on the live site that the button opens WhatsApp with the correct number.

## Connect GitHub → Vercel

1. Push this repository to `https://github.com/dgitalcode/marwa-crystal`
2. In Vercel: **Add New Project** → Import the GitHub repo
3. Select team **marwa-crystal**
4. Framework preset: **Next.js** (auto-detected)
5. Add all environment variables above
6. Deploy

## Post-deploy verification

1. Homepage loads with products and collections
2. Product detail pages show images
3. WhatsApp floating button works
4. `/admin/login` — sign in with seeded admin
5. Admin → Paramètres — upload logo (Cloudinary)
6. Admin → Produits — product images display
7. Place a test order via cart → WhatsApp
8. `/wholesale` — quote form opens WhatsApp

## Local production build test

```bash
npm run typecheck
npm run lint
npm run build
```

For a full production simulation (requires DB + Cloudinary):

```bash
npm run vercel-build
```
