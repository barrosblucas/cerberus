# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gov Social Link** is an AI-native, LLM-friendly monorepo for the Municipal Government of Bandeirantes/MS. Built with pnpm workspaces + Turborepo, it follows a strict contract-first architecture with TypeScript strict mode, automated governance checks, and comprehensive documentation for AI agents.

**Tech Stack:**
- **Backend**: NestJS API with `/v1` global prefix, Zod validation, Pino structured logging, OpenAPI/Swagger
- **Frontend**: React + Vite SPA (NO SSR/SSG), TanStack Query for data fetching
- **Database**: PostgreSQL + Prisma ORM
- **Infrastructure**: Redis + BullMQ (scaffold only)
- **Quality**: Biome (lint/format), TypeScript strict, CI gates (SCA, SAST, CodeQL)

## Architecture & Code Organization

### Monorepo Structure
- `apps/api` - NestJS backend with domain modules in `src/modules/`
- `apps/web` - React + Vite frontend (SPA only)
- `packages/contracts` - Zod schemas (Single Source of Truth for types)
- `packages/utils` - Pure utility functions (no I/O)
- `prisma/` - Database schema and migrations
- `scripts/` - Governance checks (file-length, prisma-migration, no-console)
- `.context/docs/` - Living documentation (REPOMAP, PROJECT_STATE, architecture, changelogs)

### Critical Architecture Rules

**Contract-First Development:**
1. ALL endpoints must have Zod schemas in `packages/contracts` first
2. If it's not in the contract/schema, it doesn't exist
3. Both API and Web consume contracts via `z.infer`

**Layer Boundaries (Never Cross):**
```
Web (React) → HTTP/REST → API Controller → Service (Zod validate) → Repo (Prisma) → Postgres
```

**Forbidden Patterns:**
- Frontend: NO fetch in components, NO server-side APIs, use `src/shared/api-client.ts` + TanStack Query
- Backend: NO Prisma in Controllers, NO business logic in Controllers, NO global helpers
- Anywhere: NO `any`, NO `ts-ignore`, NO `console.log` (use Pino logger)

### Request Flow
1. React component calls TanStack Query hook from `src/features/*/use-*.ts`
2. Hook uses `src/shared/api-client.ts` to call API endpoint
3. NestJS Controller receives request, delegates to Service
4. Service validates with Zod contracts from `packages/contracts`
5. Service calls Repo, which uses Prisma for database operations
6. Response flows back through layers, maintaining contract compliance

### File Size Limits (Governance)
- Soft limit: 250 lines (refactor when exceeded)
- Hard limit: 400 lines (enforced by CI, allowlist only)
- Run: `pnpm check:file-length` to verify

## Common Development Commands

### Starting Development
```bash
# Install dependencies (first time)
pnpm install

# Setup database (requires PostgreSQL running locally)
pnpm db:migrate
pnpm db:seed

# Start all services (API + Web)
pnpm dev

# Start individual services
pnpm dev:api
pnpm dev:web
```

### Quality & Testing
```bash
# Lint all packages
pnpm lint

# Typecheck all packages
pnpm typecheck

# Run all tests
pnpm test

# Run single test file (API)
pnpm --filter @app/api test:watch

# Run single test file (Web)
pnpm --filter @app/web test

# Format code
pnpm format

# Build all packages
pnpm build
```

### Database Operations
```bash
# Create migration (after schema.prisma changes)
pnpm --filter @app/api db:migrate

# Seed database
pnpm --filter @app/api db:seed

# Open Prisma Studio
pnpm --filter @app/api prisma:studio
```

### Governance Checks
```bash
# Check for files exceeding line limits
pnpm check:file-length

# Check for schema changes without migration
pnpm check:prisma-migration

# Check for console.log in committed code
pnpm check:no-console
```

## Development Workflow

### Before Making Changes (Mandatory Pre-flight)
1. Read `AI-GOVERNANCE.md` (governance rules)
2. Read `.context/docs/PROJECT_STATE.md` (current state & roadmap)
3. Read `.context/docs/ARCHITECTURE.md` (architecture decisions)
4. Identify the correct domain (feature) in `apps/api/src/modules/`
5. Verify/update contracts in `packages/contracts/`
6. Plan which files will change (3 bullets max)

### Implementing a Feature
1. **Update contracts first** - Add Zod schemas to `packages/contracts/src/<domain>/contracts.ts`
2. **Update Prisma schema** - Add models to `prisma/schema.prisma` and run migration
3. **Implement backend** - Update Controller (thin), Service (validate + business logic), Repo (Prisma)
4. **Implement frontend** - Create TanStack Query hooks in `apps/web/src/features/<domain>/`
5. **Write tests** - E2E tests in `apps/api/test/`, Playwright tests in `apps/web/tests/`
6. **Run checks** - Execute all commands in "Checklist Final" below

### After Completing Work (Mandatory)
1. Update `.context/docs/REPOMAP.md` if structure/routes/contracts changed
2. Create/update daily changelog: `.context/docs/changelog/CHANGELOG_YYYY_MM_DD.md`
3. Ensure all checklist commands pass

## Testing Strategy

### Backend (NestJS + Jest)
- E2E tests in `apps/api/test/*.e2e-spec.ts`
- Test both success and error paths
- Test Zod validation failure cases
- Use Supertest for HTTP assertions
- Mock external dependencies (Prisma, services)

### Frontend (React + Playwright)
- Smoke tests in `apps/web/tests/`
- Test critical user flows
- Test error handling
- Mock API responses

## Important Constraints

### This is a React + Vite Project
- **PROHIBITED**: Generating SSR/SSG code (Next.js, Remix, etc.)
- **PROHIBITED**: Using server-side APIs in frontend
- **REQUIRED**: All data access via `apps/web/src/shared/api-client.ts` + TanStack Query

### Contract-First is Mandatory
- Every endpoint must have corresponding Zod schemas in `packages/contracts`
- Prisma schema changes require migrations
- Swagger docs must reflect contract schemas
- Frontend must use `z.infer<typeof ContractSchema>` for types

### Code Quality Gates (CI)
- Biome lint/format checks
- TypeScript strict mode (no any, no ts-ignore)
- Test coverage thresholds
- No console.log in committed code
- Prisma schema changes must have migrations
- File length limits enforced

## Documentation References

**Essential Reading:**
- `.context/docs/AI-GOVERNANCE.md` - Governance rules for AI agents
- `.context/docs/PROJECT_STATE.md` - Current state, active domains, roadmap
- `.context/docs/ARCHITECTURE.md` - Architecture decisions, trade-offs, diagrams
- `.context/docs/CONVENTIONS.md` - Naming conventions, logging standards, error handling
- `.context/docs/REPOMAP.md` - Living structural map (update when structure changes)
- `.context/docs/changelog/CHANGELOG_YYYY_MM_DD.md` - Daily change log

**Agent Playbooks:**
- `.claude/AGENTS.md` (Portuguese) - Detailed instructions for LLM agents
- `.context/agents/README.md` - Agent-specific playbooks

## Domain-Specific Guidance

### Current Active Domains
- **Users** (`apps/api/src/modules/users/`, `apps/web/src/features/users/`)
  - Create user with email and name
  - List users ordered by createdAt desc
  - No authentication yet (in roadmap)

### Naming Conventions
- Variables/Functions: `camelCase` (e.g., `userRepository`, `findUserById`)
- Classes/Interfaces: `PascalCase` (e.g., `UserService`, `AuthResponse`)
- Files: `kebab-case` (e.g., `user-service.ts`, `create-user.dto.ts`)
- IDs: `string` (UUIDs/CUIDs)
- No abbreviations: `request` not `req`, `response` not `res`

### Logging Standards
- Library: Pino (JSON format)
- NEVER log PII (passwords, tokens, personal data)
- Required fields: `requestId`, `userId` (if available), `domain`, `action`
- Example structure:
  ```json
  {
    "level": "info",
    "requestId": "req_123",
    "userId": "user_456",
    "domain": "auth",
    "action": "login_attempt",
    "msg": "User logged in successfully"
  }
  ```

### Error Handling
- API errors must return predictable shape:
  ```typescript
  interface ApiError {
    code: string;       // e.g., 'USER_NOT_FOUND'
    message: string;    // Human-readable
    details?: unknown;  // Optional validation details
  }
  ```
- Throw custom errors, not generic Error
- Map exceptions to appropriate HTTP status codes
- Never leak implementation details in error messages

## CI/CD Pipeline

All changes must pass:
1. Biome lint/format checks
2. TypeScript strict mode checks
3. All tests (unit, E2E, Playwright)
4. Governance checks (file-length, prisma-migration, no-console)
5. SCA/SAST security scans
6. CodeQL analysis

## FAQ

**Q: Can I use Next.js for the frontend?**
A: NO. This project uses React + Vite SPA only. SSR/SSG is prohibited.

**Q: Can I add fields without updating contracts?**
A: NO. Contract-first is mandatory. All fields must exist in `packages/contracts` first.

**Q: Where should I put business logic?**
A: In Service layer (`apps/api/src/modules/<domain>/<domain>.service.ts`). Controllers must be thin.

**Q: How do I fetch data in React components?**
A: Use TanStack Query hooks from `apps/web/src/features/<domain>/use-*.ts`. Never fetch directly.

**Q: What if I need to exceed the 400-line file limit?**
A: Refactor into smaller files. The hard limit is only allowlisted in exceptional cases.

**Q: Can I use console.log for debugging?**
A: Only during development. Never commit `console.log`. Use Pino logger instead.

**Q: Do I need to update documentation?**
A: YES. Update REPOMAP.md for structural changes and create daily changelog entries.

---

## Summary: Golden Rules

1. **Contract-first**: Nothing exists without Zod schema in `packages/contracts`
2. **Zod at the edge**: Always validate at API boundaries
3. **No any/ts-ignore**: TypeScript strict mode is mandatory
4. **UI has no business logic**: Keep React components dumb
5. **Migration mandatory**: Prisma schema changes require migrations
6. **Docs are living**: Update `.context/docs/` when rules change
7. **Test before commit**: Run all checklist commands
