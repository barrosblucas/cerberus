# CHANGELOG 2026-01-12

## Objetivo
- Corrigir erros de compilacao do `npm run dev` no backend (seed, obras e banco de precos).

## Alteracoes
- Seed do admin agora inclui senha hash e role.
- Obras passam a retornar entidades normalizadas pelo contrato Zod.
- Banco de precos consolidado em controller/service/repo com validacao de query e detalhe de composicao.
- Contratos de orcamentos atualizados para lidar com numeros e detalhe de composicao.
- API agora escuta na porta 5500 por default e o web client segue essa porta.
- Contracts passam a gerar build ESM/CJS com exports condicionais.
- Utils ganhou testes minimos para evitar falha no runner.
- Biome configurado para aceitar decorators em parametros para formatacao.
- Variaveis de ambiente alinhadas com a porta 5500.
- CORS habilitado na API para permitir preflight do web app.
- Web agora envia cookies nas chamadas ao backend (credentials include).
- Seed principal agora usa admin@example.com.
- Seed agora roda com tsconfig dedicado para ts-node.

## Arquivos tocados
- `apps/web/src/features/obras/obra-details-page.tsx`
- `apps/web/playwright.config.ts`
- `apps/web/tests/smoke.spec.ts`
- `infra/docker-compose.yml`
- `.env`
- `.env.example`
- `apps/api/src/main.ts`
- `apps/web/src/shared/api-client.ts`
- `apps/web/src/features/admin/banco-precos/admin-price-bank-page.tsx`
- `prisma/seed.ts`
- `packages/contracts/package.json`
- `packages/contracts/tsconfig.json`
- `packages/contracts/tsconfig.cjs.json`
- `packages/utils/src/index.js`
- `packages/utils/src/index.test.ts`
- `biome.json`
- `apps/api/prisma/seed.ts`
- `apps/api/src/modules/obras/obras.service.ts`
- `apps/api/src/modules/obras/obras.repo.ts`
- `apps/api/src/modules/orcamentos/banco-precos.controller.ts`
- `apps/api/src/modules/orcamentos/banco-precos.service.ts`
- `apps/api/src/modules/orcamentos/banco-precos.repo.ts`
- `apps/api/src/modules/orcamentos/banco-precos.module.ts`
- `apps/api/src/modules/orcamentos/banco-precos.service.spec.ts`
- `apps/api/package.json`
- `packages/contracts/src/orcamentos/contracts.ts`
- `prisma/tsconfig.seed.json`
- `.context/docs/PROJECT_STATE.md`
- `.context/docs/REPOMAP.md`

## Impacto
- API compila sem erros de tipo; endpoints de banco de precos passam a retornar numericos normalizados.
