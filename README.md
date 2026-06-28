# Marwa Crystal

Premium accessories e-commerce store built with Next.js 15, TypeScript, Tailwind CSS, Prisma/PostgreSQL, Auth.js credentials authentication, and WhatsApp/COD ordering.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `NEXT_PUBLIC_WHATSAPP_PHONE`.
3. Run:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

## Admin

Visit `/admin/login` and use the seeded admin credentials. Admin routes require an authenticated user with the `ADMIN` role.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full Vercel production checklist (environment variables, Cloudinary, PostgreSQL, GitHub connection).

Quick summary:

1. Push to [GitHub](https://github.com/dgitalcode/marwa-crystal).
2. Import the repo in [Vercel — marwa-crystal team](https://vercel.com/marwa-crystal).
3. Set `DATABASE_URL`, `NEXTAUTH_*`, `NEXT_PUBLIC_WHATSAPP_PHONE`, Cloudinary credentials, and store URLs.
4. Deploy — migrations run automatically via `npm run vercel-build`.
5. Seed production DB once: `DATABASE_URL="..." npm run db:seed`.
