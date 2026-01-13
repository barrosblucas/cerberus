<!-- agent-update:start:tooling -->
# Tooling & Productivity Guide

Collect the scripts, automation, and editor settings that keep contributors efficient.

## Required Tooling
- **Node.js**: Use the Active LTS version to ensure compatibility with all packages.
- **Package Manager**: This repository is structured as a monorepo (containing `apps` and `packages`). Check `package.json` to identify the required manager (likely `pnpm`, `yarn`, or `npm`) and install dependencies at the root.
- **Docker Desktop**: Required to spin up local database containers compatible with the `prisma/` configuration.

## Recommended Automation
- **Database Workflows**:
  - `npx prisma migrate dev`: Applies schema changes from `prisma/schema.prisma` to your local database.
  - `npx prisma studio`: Launches a web GUI to inspect and edit local data.
- **Custom Scripts**:
  - Check the `scripts/` directory for repository-specific build, deploy, or maintenance utilities.
- **Linting & Formatting**:
  - Run linting commands from the root to ensure code quality across all workspaces (`apps` and `packages`).

## IDE / Editor Setup
- **Visual Studio Code**: Recommended for its strong TypeScript and monorepo support.
- **Essential Extensions**:
  - **Prisma**: Syntax highlighting and linting for `.prisma` files.
  - **ESLint & Prettier**: To catch issues early and enforce style guide compliance.
  - **EditorConfig**: Ensures consistent indent styles across different editors.

## Productivity Tips
- **Environment Variables**: Ensure your `.env` file matches `.env.example`, specifically for the `DATABASE_URL` required by Prisma.
- **Workspace Filtering**: When using the package manager, use filtering flags (e.g., `--filter` in pnpm or `-w` in npm/yarn) to run commands against specific apps or packages to save time.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Verify commands align with the latest scripts and build tooling.
2. Remove instructions for deprecated tools and add replacements.
3. Highlight automation that saves time during reviews or releases.
4. Cross-link to runbooks or README sections that provide deeper context.

<!-- agent-readonly:sources -->
## Acceptable Sources
- Onboarding docs, internal wikis, and team retrospectives.
- Script directories, package manifests, CI configuration.
- Maintainer recommendations gathered during pairing or code reviews.

<!-- agent-update:end -->
