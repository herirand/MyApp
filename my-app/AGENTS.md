# AGENTS.md

## Commands
- `npm run dev` - runs web (port 3000) + api (port 3001) concurrently
- `npm run dev:web` - Next.js dev only (port 3000)
- `npm run dev:api` - Fastify dev (port 3001, `tsx watch apps/api/server.ts`)
- `npm run build` - Next.js web build only
- `npm run lint` - ESLint on web only
- `npm run start` - Next.js production server

## Architecture
Monorepo with npm workspaces:
- `apps/web` - Next.js 15.x frontend (`@myapp/web`, App Router)
- `apps/api` - Fastify 5.x API server (`@myapp/api`, TypeScript with tsx)
- `packages/db` - Prisma client (`@myapp/db`, exports via `index.ts`)

Database: PostgreSQL (Neon), schema at `packages/db/prisma/schema.prisma`

## Important Notes
- Root `package.json` lists Next.js 16 but `apps/web/package.json` pins 15.x—use web's version
- Prisma migrations: run `npx prisma migrate deploy` from `packages/db/` directory (uses root `.env`)
- API loads `.env` from `apps/api/` directory (uses `dotenv`)
- Web loads `.env.local` from `apps/web/` directory (Next.js built-in)
- No test scripts defined
- API CORS hardcoded to `http://localhost:3000` and `http://localhost:3001` in server.ts
- API uses JWT via `@fastify/jwt` with hardcoded secret "fastifyjwtpass"

## Env Files
- `/.env` - DATABASE_URL and PORT (shared, used by Prisma)
- `/apps/api/.env` - API server reads: PORT, DATABASE_URL, URL_FRONT, URL_SWAGGER
- `/apps/web/.env.local` - Web app env vars (Next.js convention)