<!-- agent-update:start:project-overview -->
# Project Overview

Gov_SocialLink is a TypeScript-based monorepo designed to facilitate social governance interactions. It utilizes a modular architecture to support scalable application development, shared logic, and robust database management.

## Quick Facts
- **Root path**: `/home/thanos/Gov_SocialLink`
- **Primary Languages**: TypeScript (`.ts`, `.tsx`), JSON, Markdown.
- **Package Manager**: pnpm
- **Build System**: Turborepo
- **ORM**: Prisma
- **Linter/Formatter**: Biome

## File Structure & Code Organization
- `AGENTS.md` — Defines the AI agent personas, playbooks, and operational guidelines for the project.
- `AI-GOVERNANCE.md` — Outlines the ethical guidelines, policies, and constraints for AI-generated code and interactions.
- `apps/` — Contains the primary deployable applications and services (e.g., web clients, API servers).
- `biome.json` — Configuration file for Biome, handling code formatting and linting rules.
- `package-lock.json` — Dependency lock file (Note: Project uses `pnpm`, so `pnpm-lock.yaml` is the primary source of truth if present).
- `package.json` — The root manifest file defining project scripts, dependencies, and metadata.
- `packages/` — Workspace packages containing shared libraries, UI components, and utilities used by apps.
- `pnpm-workspace.yaml` — Defines the directory glob patterns for the pnpm monorepo workspace.
- `prisma/` — Houses the `schema.prisma` file and database migration history managed by Prisma ORM.
- `README.md` — The entry point documentation providing high-level project information.
- `scripts/` — Custom automation scripts for build, deployment, or maintenance tasks.
- `tsconfig.base.json` — The base TypeScript configuration extended by individual apps and packages to ensure consistency.
- `turbo.json` — Configuration for Turborepo, defining task pipelines (build, test, lint) and caching strategies.

## Technology Stack Summary
- **Runtimes & Languages**: Node.js, TypeScript.
- **Build Tooling**: Turborepo for task orchestration.
- **Linting & Formatting**: Biome.
- **Package Management**: pnpm (Workspaces).

## Core Framework Stack
- **Backend/Frontend**: TypeScript-based applications (specific frameworks like Next.js or Express determined by contents of `apps/`).
- **Data Layer**: Prisma ORM for type-safe database interactions.
- **Architecture**: Monorepo structure separating concerns between `apps` (deployables) and `packages` (shared logic).

## UI & Interaction Libraries
- **UI Components**: Located within `packages/` (typically) to enforce design system consistency.
- **Styling**: Implementation details reside in specific `apps` or shared UI packages.

## Development Tools Overview
- **Turborepo**: Used to speed up builds and linting via caching.
- **Biome**: Ensures code quality and consistent formatting.
- **Prisma CLI**: Used for schema updates and migrations.
- Link to [Tooling & Productivity Guide](./tooling.md) for deeper setup instructions.

## Getting Started Checklist
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Generate Database Client:
   ```bash
   pnpm prisma generate
   ```
3. Start the development environment:
   ```bash
   pnpm dev
   ```
4. Review [Development Workflow](./development-workflow.md) for day-to-day tasks.

## Next Steps
- Review `apps/` to understand the specific domains served.
- Check `prisma/schema.prisma` for the data model.
- Consult `AGENTS.md` for AI-assisted workflow integration.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Review roadmap items or issues labelled “release” to confirm current goals.
2. Cross-check Quick Facts against `package.json` and environment docs.
3. Refresh the File Structure & Code Organization section to reflect new or retired modules; keep guidance actionable.
4. Link critical dashboards, specs, or runbooks used by the team.
5. Flag any details that require human confirmation (e.
