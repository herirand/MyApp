# AGENTS.md

## Commands
- `npm run dev` - Runs web (port 3000) + API (port 3001) concurrently
- `npm run dev:web` - Next.js dev only (port 3000)
- `npm run dev:api` - Fastify dev (port 3001, `tsx watch apps/api/server.ts`)
- `npm run build` - Next.js web build only (no API build needed)
- `npm run lint` - ESLint on web only
- `npm run start` - Next.js production server (serves frontend only)

## Architecture
Monorepo with npm workspaces:
- `apps/web` - Next.js 15.x frontend (`@myapp/web`, App Router, Tailwind CSS)
- `apps/api` - Fastify 5.x API server (`@myapp/api`, TypeScript with tsx)
- `packages/db` - Prisma client (`@myapp/db`, exports via `index.ts`)

Database: PostgreSQL (Neon), schema at `packages/db/prisma/schema.prisma`

## Critical Notes
- **Next.js version**: Root `package.json` has 16.2.3 but `apps/web/package.json` pins 15.x (web's version takes precedence)
- **Prisma migrations**: Run `npx prisma migrate deploy` from `packages/db/` (uses root `.env`)
- **API env loading**: Uses `dotenv.config()` in `server.ts`, reads from `apps/api/.env`
- **Web env loading**: Next.js built-in, reads `apps/web/.env.local`, vars must start with `NEXT_PUBLIC_` for client access
- **No test suite**: No `npm test` or test scripts defined
- **CORS via env**: API origin controlled by `URL_FRONT` and `URL_SWAGGER` env vars, not hardcoded
- **JWT secret via env**: API reads from `JWT_SECRETS` env var, not hardcoded
- **Swagger UI**: Available at `http://localhost:3001/api-docs` when API is running
- **Security vulnerabilities**: CRITICAL JWT vulns in `fast-jwt@6.1.0`. Run `npm audit fix` to update to 6.2.1

## Environment Variables
| File | Purpose | Key Variables |
|------|---------|---------------|
| `/.env` | Shared (Prisma CLI only, dev only) | `DATABASE_URL`, `PORT` |
| `/apps/api/.env` | API server (production critical) | `PORT`, `DATABASE_URL`, `URL_FRONT`, `URL_SWAGGER`, `JWT_SECRETS` |
| `/apps/web/.env.local` | Frontend (Next.js dev only) | `NEXT_PUBLIC_API_URL` (must have prefix) |

**Deployment note**: When deploying frontend and backend separately:
- Root `/.env` is only needed locally for Prisma CLI
- **API server**: Set env vars directly in hosting platform (don't commit `apps/api/.env` to production)
- **Frontend**: Set `NEXT_PUBLIC_API_URL` to your backend URL in hosting platform (e.g., Vercel, Netlify env settings)