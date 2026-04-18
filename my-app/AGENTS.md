# AGENTS.md

## Repo shape
- Real code root is `my-app/` (parent repo root only contains `.git/` + this folder).
- npm workspaces: `apps/web` (Next.js App Router), `apps/api` (Fastify), `packages/db` (Prisma schema/client).
- API middleware directory is intentionally misspelled: `apps/api/middlwares/`.

## Commands (from package scripts)
- From `my-app/`: `npm run dev` starts web (`:3000`) + API (`:3001`) concurrently.
- Focused dev: `npm run dev:web` and `npm run dev:api`.
- Production scripts are web-only: `npm run build` then `npm run start` (API has no build/start script).
- Root `npm run lint` is currently broken because `@myapp/web` has no `lint` script.
- No test script exists in any workspace, and there is no CI workflow in this repo.

## Prisma / DB
- Prisma schema: `packages/db/prisma/schema.prisma`.
- Root `postinstall` runs `prisma generate --schema packages/db/prisma/schema.prisma`.
- Run Prisma CLI from `packages/db/` (or pass `--schema`) to avoid schema path errors.
- Migration history is in `packages/db/prisma/migrations/`; use `npx prisma migrate deploy` for non-dev apply.

## Runtime wiring
- API entrypoint is `apps/api/server.ts`; routes are mounted without an `/api` prefix.
- Swagger endpoints: `/api-docs` (UI) and `/api-docs/json` (OpenAPI JSON).
- API loads env via `dotenv.config()` and uses `PORT`, `JWT_SECRETS`, `URL_FRONT`, `URL_SWAGGER` (Prisma reads `DATABASE_URL` from schema env).
- Web fetches `process.env.NEXT_PUBLIC_API_URL` directly across pages/components; missing value breaks API calls.

## Known quirks
- Version mismatch is intentional right now: root depends on `next@16.2.3`, while `apps/web` pins `next@15.x`.
- `CLAUDE.md` only references this file (`@AGENTS.md`).
