# AGENTS.md

## Commands
- `npm run dev` - runs web (port 3000) + api (port 3001) concurrently
- `npm run dev:web` - Next.js dev only
- `npm run dev:api` - Fastify API only (`tsx watch apps/api/server.ts`)
- `npm run build` / `npm run lint` - only targets web app

## Architecture
Monorepo with npm workspaces:
- `apps/web` - Next.js 15 frontend (`@myapp/web`)
- `apps/api` - Fastify 5 API server (`@myapp/api`)
- `packages/db` - Prisma client (`@myapp/db`)

Database: PostgreSQL (Neon), schema in `packages/db/prisma/schema.prisma`

## Important Notes
- **This uses Next.js 15 in apps/web** (not Next.js 16 from root package.json)
- Check `node_modules/next/dist/docs/` for Next.js 15 APIs if needed
- Prisma migrations run via `npx prisma migrate deploy` from `packages/db/`
- No test scripts defined - add test framework if needed
- API uses Fastify (not Next.js API routes)

## Env Files
- `.env` - root DATABASE_URL
- `apps/api/.env` - API-specific vars
- `apps/web/.env.local` - web-specific vars