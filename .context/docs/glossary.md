<!-- agent-update:start:glossary -->
# Glossary & Domain Concepts

List project-specific terminology, acronyms, domain entities, and user personas.

## Core Terms
- **Monorepo Workspace** — A distinct unit of code located in `apps/` (deployable applications) or `packages/` (shared libraries). These are managed via the root `package.json` and share dependencies where possible.
- **Prisma Schema** — The single source of truth for the application's data model, located in `prisma/schema.prisma`. It defines the database structure, relations, and is used to generate the type-safe client.
- **Shared Package** — Library code located in `packages/` designed to be consumed by multiple applications (e.g., UI components, utility functions, or shared TypeScript configurations).

## Acronyms & Abbreviations
- **ORM (Object-Relational Mapping)** — Refers to Prisma in this project. It maps the relational database data to TypeScript objects, allowing type-safe database queries.
- **DTO (Data Transfer Object)** — Objects that define how data is sent over the network between the `apps` (e.g., between API and Frontend), often defined in a shared package.

## Personas / Actors
- **Contributor / Developer** — A technical user responsible for maintaining the codebase, running `scripts` for automation, and managing database migrations via Prisma.
- **End User** — The target audience interacting with the deployed applications found in the `apps/` directory.

## Domain Rules & Invariants
- **Dependency Architecture**: Applications (`apps/`) may depend on shared libraries (`packages/`), but shared libraries must never depend on applications.
- **Database Migrations**: All changes to the database structure must be performed via Prisma Migrations (`prisma migrate`) to ensure the schema file (`prisma/schema.prisma`) remains the authoritative source of truth.
- **Type Safety**: Cross-boundary communication (e.g., API responses) should utilize shared types defined in `packages/` to maintain contract consistency.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Harvest terminology from recent PRs, issues, and discussions.
2. Confirm definitions with product or domain experts when uncertain.
3. Link terms to relevant docs or modules for deeper context.
4. Remove or archive outdated concepts; flag unknown terms for follow-up.

<!-- agent-readonly:sources -->
## Acceptable Sources
- Product requirement docs, RFCs, user research, or support tickets.
- Service contracts, API schemas, data dictionaries.
- Conversations with domain experts (summarize outcomes if applicable).

<!-- agent-update:end -->
