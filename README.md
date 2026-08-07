# Vidalip

A listing platform where anyone can sign up and post a listing, and admins approve
listings before they go public.

Built with Next.js 16 (App Router), TypeScript, Tailwind v4, Prisma + SQLite, and
Auth.js credentials login.

## Getting started

You need a Postgres database. [Neon](https://neon.tech) has a free tier and is
what this is set up for — create a project and copy both connection strings.

```bash
npm install && cp .env.example .env
```

Fill in `DATABASE_URL` (pooled), `DIRECT_URL` (direct) and `AUTH_SECRET`, then:

```bash
npm run db:deploy && npm run db:seed
```

```bash
npm run dev
```

The seed creates the main admin account. Credentials come from `.env`:

| Field    | Value                |
| -------- | -------------------- |
| Email    | `admin@vidalip.test` |
| Password | `Admin@12345`        |

Change these in `.env` before seeding, and change the password after first login.

## Roles

There are three roles. New signups are always `USER` — roles are only ever granted
from the admin panel, never from a public form.

| Role          | Can do                                                             |
| ------------- | ------------------------------------------------------------------ |
| `USER`        | Create and edit their own listings                                 |
| `ADMIN`       | Everything above, plus approve/reject/unpublish any listing        |
| `SUPER_ADMIN` | Everything above, plus grant roles and suspend accounts            |

The main admin (`SUPER_ADMIN`) cannot change their own role or suspend themselves,
and the app refuses any change that would leave zero active main admins.

## How a listing goes live

1. A user creates a listing — it starts as `PENDING`.
2. It appears in the admin moderation queue at `/admin`.
3. An admin approves it (goes live) or rejects it with a written reason, which is
   shown back to the owner on their dashboard.
4. **Editing an approved listing sends it back to `PENDING`.** Without this, a user
   could get innocuous content approved and then swap it out afterwards.

Suspending a user also pulls their live listings off the public site.

## What a listing holds

- Title, category, location, description
- Cover photo and a gallery of up to 12 images
- Rate: amount + currency + unit (per hour / day / session / project)
- Weekly availability slots (day of week, start and end time)
- Optional contact email, phone, website
- SEO metadata: meta title, meta description, social share image — each falls back
  to the listing's own title/description/cover when left blank

Listing pages emit canonical URLs, Open Graph and Twitter cards, and `Service`
JSON-LD. Unapproved listings are `noindex` and are only viewable by their owner and
by moderators.

## Routes

| Route                            | Who                     |
| -------------------------------- | ----------------------- |
| `/`                              | Public — approved only  |
| `/listing/[slug]`                | Public (owner/admin can preview unapproved) |
| `/signup`, `/login`              | Public                  |
| `/dashboard`                     | Signed in               |
| `/dashboard/listings/new`        | Signed in               |
| `/dashboard/listings/[id]/edit`  | Owner only              |
| `/admin`                         | Admin + main admin      |
| `/admin/listings`                | Admin + main admin      |
| `/admin/users`                   | Main admin only         |

## Security notes

- Passwords are hashed with bcrypt (cost 12). Login timing is evened out so a
  missing account and a wrong password take similar time.
- `src/proxy.ts` gates `/dashboard` and `/admin` off the JWT, but that claim can go
  stale (a promotion or suspension mid-session). Every protected page and server
  action re-checks against the database via `src/lib/session.ts` — that is the
  authoritative check.
- Uploads are validated by magic number, capped at 5 MB, and stored under a random
  UUID with an extension chosen from an allowlist, never from the uploaded filename.
- Image fields only accept `/uploads/...` paths, which keeps `javascript:`/`data:`
  URLs out of `src` attributes.
- Ownership-scoped writes (`deleteMany({ id, userId })`) mean a forged id matches
  zero rows rather than touching someone else's data.

## Deploying to Vercel

Set these environment variables in **Project → Settings → Environment Variables**:

| Variable                | Required | Value                                               |
| ----------------------- | -------- | --------------------------------------------------- |
| `DATABASE_URL`          | yes      | Neon **pooled** string (host contains `-pooler`)     |
| `AUTH_SECRET`           | yes      | `openssl rand -base64 32`                            |
| `NEXT_PUBLIC_SITE_URL`  | yes      | `https://your-domain.com`                            |
| `DIRECT_URL`            | no       | Neon **direct** string — falls back to `DATABASE_URL` |
| `BLOB_READ_WRITE_TOKEN` | no       | Injected when you create a Blob store                |

`DIRECT_URL` is optional but recommended: migrations run against it because
connection poolers can interfere with them. Leave it unset and the build warns and
uses `DATABASE_URL` instead, which works for a schema this size.

Then, in **Storage**, create a **Blob** store and link it to the project. Uploads
go there in production; without the token they fall back to local disk, which does
not survive a deploy on Vercel.

Migrations run automatically — `npm run build` is
`prisma generate && node scripts/migrate.mjs && next build`. The build needs a
reachable database and fails loudly if `DATABASE_URL` is missing, rather than
shipping an app that cannot reach its database.

After the first successful deploy, create the main admin by running the seed once
against production:

```bash
DATABASE_URL="<your-neon-pooled-url>" npm run db:seed
```

Nothing else queries the database at build time — `/sitemap.xml` is rendered per
request precisely so that a build never depends on a reachable database.

## Scripts

| Command           | Does                             |
| ----------------- | -------------------------------- |
| `npm run dev`       | Dev server                                       |
| `npm run build`     | Prisma generate + migrate deploy + Next build     |
| `npm run db:migrate`| Create a new migration after editing the schema   |
| `npm run db:deploy` | Apply existing migrations (no prompts)            |
| `npm run db:seed`   | Create/repair the main admin                      |
| `npm run db:studio` | Browse the database in Prisma Studio              |
