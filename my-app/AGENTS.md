# AGENTS.md

## Workspace shape
- Real project root is `my-app/` (repo root only contains `.git/` + this folder).
- npm workspaces: `apps/web` (Next.js app), `apps/api` (Fastify server), `packages/db` (Prisma schema/client).
- API middleware directory is intentionally misspelled: `apps/api/middlwares/`.

## Commands that actually work
- From `my-app/`: `npm run dev` starts web (`:3000`) + API (`:3001`) concurrently.
- Focused runs: `npm run dev:web`, `npm run dev:api`.
- Production build path is web-only: `npm run build` then `npm run start` (no API build/start script exists).
- `npm run lint` at root is currently broken because `@myapp/web` has no `lint` script.
- There is no test script in any workspace and no CI workflow in `.github/workflows/`.

## Prisma / database
- Prisma schema is `packages/db/prisma/schema.prisma`; run Prisma commands from `packages/db/` or pass `--schema`.
- `npx prisma migrate status` fails from `my-app/` (schema not found) and works from `my-app/packages/db/`.
- Migration history exists under `packages/db/prisma/migrations/`; use `migrate deploy` for non-dev apply.

## Environment + runtime wiring
- API loads env with `dotenv.config()` in `apps/api/server.ts` and expects: `PORT`, `DATABASE_URL`, `URL_FRONT`, `URL_SWAGGER`, `JWT_SECRETS`.
- Web uses `process.env.NEXT_PUBLIC_API_URL` directly in client-side fetch calls across pages/components.
- Swagger UI route is `/api-docs` on the API server.

## Known gotchas
- Version mismatch is intentional in current state: root depends on `next@16.2.3`, web workspace pins `next@15.x`.
- `next build` warns about multiple lockfiles and infers workspace root from `/home/herirand/package-lock.json` unless `outputFileTracingRoot` is set.
