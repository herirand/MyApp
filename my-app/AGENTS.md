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
- `apps/web` - Next.js 15.x frontend (`@myapp/web`, App Router, Tailwind CSS, ESLint)
- `apps/api` - Fastify 5.x API server (`@myapp/api`, TypeScript, tsx watch, routes + services + middlewares)
- `packages/db` - Prisma client (`@myapp/db`, PostgreSQL on Neon)

## Critical Notes
- **Next.js version mismatch**: Root `package.json` pins 16.2.3 but `apps/web/package.json` pins 15.x. The workspace version (15.x) takes precedence in web app.
- **No test suite**: No tests defined; no `npm test` script.
- **Prisma migrations**: Run `npx prisma migrate deploy` from `packages/db/` directory (uses root `.env`).
- **API environment loading**: `apps/api/server.ts:11` calls `dotenv.config()` to read `apps/api/.env`.
- **Web environment loading**: Next.js built-in; reads `apps/web/.env.local`, vars must have `NEXT_PUBLIC_` prefix for client-side access.
- **CORS uses env vars**: API allows requests from `${URL_FRONT}` and `${URL_SWAGGER}` (set in `apps/api/.env`, not hardcoded).
- **JWT secret from env**: API reads `JWT_SECRETS` from `apps/api/.env` (set in `server.ts:28`).
- **Swagger UI**: Available at `http://localhost:3001/api-docs` when API running.

## Environment Variables
| File | Key Variables | Usage |
|------|---------------|-------|
| `/.env` | `DATABASE_URL`, `PORT` | Root `.env` for Prisma CLI only (local dev) |
| `/apps/api/.env` | `PORT`, `DATABASE_URL`, `URL_FRONT`, `URL_SWAGGER`, `JWT_SECRETS` | API server config |
| `/apps/web/.env.local` | `NEXT_PUBLIC_API_URL` | Frontend API endpoint (must have `NEXT_PUBLIC_` prefix) |

**Production deployment notes**:
- Root `/.env` is local-only; not needed in production.
- API server: Set env vars in hosting platform; do NOT commit `apps/api/.env` to production.
- Frontend: Set `NEXT_PUBLIC_API_URL` to your backend URL in platform env (Vercel, Netlify, etc.).

## Known Security Issues
See `SECURITY.md` for npm audit findings and fixes. Two vulnerabilities exist:
1. `fast-jwt@6.1.0` (via `@fastify/jwt`) — CRITICAL JWT validation bypass. Fix: `npm audit fix`
2. `next` (16.2.1/15.5.14) — HIGH DoS risk. Fix: upgrade to 16.2.3 or 15.5.15+