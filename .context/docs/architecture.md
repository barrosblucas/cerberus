```markdown
<!-- agent-update:start:architecture-notes -->
# Architecture Notes

## Visão Geral (contract-first, AI-native)
Monorepo pnpm + Turborepo para Gov Social Link.
- **apps/api**: NestJS (prefixo global `v1`), módulos por domínio (`src/modules/<dominio>`), controllers finos → services → repos (Prisma).
- **apps/web**: React + Vite SPA; fetch apenas via `src/shared/api-client.ts` + TanStack Query hooks.
- **packages/contracts**: Zod SSOT; tipos via `z.infer` para Web e API.
- **packages/utils**: Helpers puros, sem IO.
- **prisma/**: Schema/migrações Postgres; `PrismaService` no backend.
- **scripts/**: Checks de governança (file-length, prisma-migration, no-console).
- **.context/docs**: Wiki viva; `REPOMAP.md` como mapa estrutural; changelog diário obrigatório.

## Estrutura e Fronteiras
- **Fluxo**: Web → API (HTTP/REST) → Controller → Service (valida com Zod) → Repo (Prisma) → Postgres.
- **Sem atalhos**: UI nunca chama Prisma; services não acessam DB direto; controllers não carregam regra.
- **Contratos**: Toda borda valida com Zod; Swagger deve refletir contratos.
- **Independência**: `apps/web` não importa código de `apps/api`; integração só por HTTP + contracts.

## Componentes principais
- **Apps**: Artefatos deployáveis (API, Web).
- **Contracts**: Entrada/saída padrão para todos os domínios.
- **Data Layer**: Prisma isolado em repos.
- **Docs**: `.context/docs` e `REPOMAP.md` mantêm o mapa vivo.

## Diagramas
```mermaid
flowchart LR
  UI[React SPA] --> QUERY[TanStack Query hooks]
  QUERY --> CLIENT[shared/api-client]
  CLIENT --> API[NestJS Controller]
  API --> SVC[Service]
  SVC --> REPO[Repo (Prisma)]
  REPO --> DB[(Postgres)]
  CONTRACTS[Zod Contracts] --> UI
  CONTRACTS --> CLIENT
  CONTRACTS --> API
  CONTRACTS --> SVC
```

```mermaid
flowchart TB
  U[Você (observador)] -->|define objetivo + regras| A[Agente LLM (dev sênior)]
  A -->|lê contexto| D[Docs: AI-GOVERNANCE + AGENTS + .context/docs]
  A -->|contract-first| C[packages/contracts (Zod SSOT)]
  A -->|implementa| API[apps/api]
  A -->|implementa| WEB[apps/web]
  API --> P[(Postgres + Prisma)]
  A -->|abre PR| PR[Pull Request]
  PR --> CI[CI Gates]
  CI -->|passou| M[Merge]
  CI -->|falhou| A

  subgraph CI[CI Gates]
    L1[Biome lint/format]
    L2[TS strict typecheck]
    L3[Tests: Jest/Vitest/Playwright]
    L4[No console.log / no any / no ts-ignore]
    L5[Prisma: schema mudou -> migration]
    L6[Hard limit 400 lines (allowlist)]
    L7[SCA/SAST]
  end
```

## Regras e Padrões
- Funções pequenas; limite soft 250 linhas, hard 400 (governança).
- Controller fino; regra no service; IO apenas no repo.
- TanStack Query para dados no front; sem fetch direto em componentes.
- Contract-first: atualizar `packages/contracts` antes de API/Web.
- Toda mudança estrutural ou de rota exige atualização de `REPOMAP.md` e registro no changelog diário.

## Integrações e Dependências
- **REST**: `/v1/*` (users ativo). Documentar novos endpoints com exemplos alinhados aos contratos.
- **Banco**: PostgreSQL via Prisma; migrations obrigatórias.
- **LLM**: Nenhum integrado; adicionar via adapter se necessário.

## Decisões e Trade-offs
- Contract-first reduz drift, aumenta trabalho inicial de schema.
- NestJS + Prisma oferece DX e tipos fortes; exige disciplina em transações.
- React + Vite + TanStack Query acelera SPA; política proíbe SSR/SSG.
- Biome unifica lint/format e acelera CI.

## Riscos & Constraints
- **Doc drift**: Manter REPOMAP e changelog em sincronia a cada mudança.
- **Prefixo**: `/v1` obrigatório nas rotas.
- **Schema**: Qualquer alteração requer migration + contrato + testes.
- **Tamanho**: Refatorar antes de ultrapassar 250/400 linhas.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Confirmar fluxos (controller/service/repo) com o código atual.
2. Validar diagramas e rotas com `apps/api` e `apps/web`.
3. Garantir que contratos e REPOMAP refletem novos domínios antes de merge.
4. Registrar mudanças no changelog diário.

<!-- agent-readonly:sources -->
## Acceptable Sources
- Árvore do repositório, contratos em `packages/contracts`, schema Prisma, configs de CI.
- PRs/ADRs aprovados sobre arquitetura.

## Related Resources
- [Project Overview](./project-overview.md)
- [agents/README.md](../agents/README.md)
- [AI-GOVERNANCE](.context/docs/AI-GOVERNANCE.md)

<!-- agent-update:end -->
```
