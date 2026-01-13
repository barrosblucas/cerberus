# REPOMAP (snapshot 2026-01-12)

Mapa vivo do repositório Gov Social Link. Atualize sempre que estruturas, rotas ou contratos mudarem.

## Raiz
- `apps/` — Artefatos deployáveis.
- `packages/` — Bibliotecas compartilhadas (contracts, utils).
- `prisma/` — Schema e migrações Postgres.
- `scripts/` — Checks de governança (file-length, prisma-migration, no-console).
- `.context/` — Wiki viva (docs, agents, changelog).

## apps/api (NestJS, prefixo `v1`)
- `src/main.ts` — Bootstrap com pino-http, Swagger e prefixo global `v1`.
- `src/modules/app/app.module.ts` — Composition root.
- `src/modules/users/` — Domínio ativo.
  - `users.controller.ts` — Rotas POST/GET `/users` (contratos Zod).
  - `users.service.ts` — Validação com Zod + chamada ao repo.
  - `users.repo.ts` — Prisma `user.create` e `user.findMany` ordenando por `createdAt desc`.
- `src/modules/obras/` — Domínio de obras (controller/service/repo).
- `src/modules/orcamentos/` — Orçamentos + Banco de Preços.
  - `banco-precos.controller.ts` — Rotas GET `/banco-precos/search` e `/banco-precos/composicao/:id`.
  - `banco-precos.service.ts` — Validação de query + mapeamento de resultados.
  - `banco-precos.repo.ts` — Queries Prisma para insumos e composições.
  - `banco-precos.service.spec.ts` — Testes unitários do serviço.
- `src/shared/prisma.service.ts` — Prisma Client injetável.
- `test/users.e2e.spec.ts` — Testes E2E do domínio users.

## apps/web (React + Vite SPA)
- `src/main.tsx` — Entrada do app.
- `src/app/App.tsx` — Shell da aplicação.
- `src/shared/api-client.ts` — Cliente HTTP para API (`/v1/users`).
- `src/features/users/use-users.ts` — Hooks TanStack Query (`listUsers`, `createUser`).
- `src/styles.css` — Estilos globais.
- `tests/` — Playwright smoke test.

## packages/contracts
- `src/users/contracts.ts` — Schemas Zod: `UserSchema`, `CreateUserInputSchema`, `CreateUserOutputSchema`, `ListUsersOutputSchema`.
- `src/orcamentos/contracts.ts` — Schemas Zod para insumos, composições, busca e detalhe de composição.
- `src/index.ts` — Barrel público dos contratos.

## packages/utils
- `src/index.ts` — Helpers puros (placeholder no starter).

## prisma
- `schema.prisma` — Modelos de usuários, obras, orçamentos e banco de preços.
- `seed.ts` — Seed inicial para ambiente local.

## scripts
- `check-file-length.mjs` — Impõe limite de linhas (soft 250, hard 400 allowlist).
- `check-prisma-migration.mjs` — Falha se schema mudar sem migration.
- `check-no-console.mjs` — Bloqueia `console.log` em código commitado.

## Documentação
- `.context/docs/AI-GOVERNANCE.md` — Guardrails AI/contract-first.
- `.context/docs/PROJECT_STATE.md` — Estado atual e roadmap.
- `.context/docs/ARCHITECTURE.md` e `.context/docs/architecture.md` — Visão arquitetural.
- `.context/docs/changelog/CHANGELOG_YYYY_MM_DD.md` — Registro diário obrigatório.
