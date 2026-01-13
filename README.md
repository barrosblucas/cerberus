# AI-Native Starter Kit (100% AI-Coded, LLM-Friendly)

Este repositório é um **starter kit** para projetos **AI-Native** e **Large Language Model Friendly**.

## O que vem pronto
- Monorepo com **pnpm workspaces** + **Turborepo**
- **TypeScript strict**
- **Biome** (lint/format rápido) + ESLint opcional
- **NestJS API** (OpenAPI, Zod validation, Pino logs, OpenTelemetry scaffold)
- **React + Vite Web** (App Router, Tailwind, shadcn/ui-ready, TanStack Query)
- **PostgreSQL + Prisma**
- **Redis + BullMQ** (opcional, scaffold)
- Segurança/Qualidade: secret scanning, SCA, SAST (CodeQL), CI com gates
- Docs para IA: **AGENTS.md**, **AI-GOVERNANCE.md**, **.context/docs**

## Como rodar (dev)
1) Instale dependências:
```bash
pnpm install
```
2) Garanta Postgres (e Redis opcional) rodando localmente.
bash
```
3) Prisma:
```bash
pnpm db:migrate
pnpm db:seed
```
4) Dev:
```bash
pnpm dev
```

## Comandos importantes
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Regras do projeto
Leia **AI-GOVERNANCE.md** e **AGENTS.md** antes de qualquer alteração.
