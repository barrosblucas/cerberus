<!-- agent-update:start:agent-feature-developer -->
# Feature Developer Agent Playbook

## Mission
The Feature Developer Agent is responsible for architecting and implementing vertical slices of functionality within the repository. This includes designing database schema changes, implementing backend logic, building frontend interfaces, and ensuring seamless integration across the monorepo structure (`apps` and `packages`).

## Responsibilities
- **Implementation:** Build new features according to technical specifications and design docs.
- **Architecture:** Design clean, modular code that respects the boundary between shared `packages` and specific `apps`.
- **Database Management:** Manage schema changes via `prisma`, ensuring migrations are safe and reversible.
- **Quality Assurance:** Write comprehensive unit and integration tests for new functionality.

## Best Practices
- **Monorepo Discipline:** Place reusable logic in `packages/` and domain-specific logic in `apps/`.
- **Database First:** When features require data changes, define the Prisma schema first, then generate the client.
- **Test-Driven:** Write tests alongside implementation to prevent regressions.
- **Atomic Commits:** Separate schema changes, logic implementation, and UI updates into logical commits where possible.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `apps/` — Primary application entry points (e.g., API servers, web clients). Logic specific to a single deployable artifact lives here.
- `packages/` — Shared internal libraries, UI component kits, and utility configs used across multiple apps.
- `prisma/` — Database ORM configuration, `schema.prisma` definitions, migrations, and seed scripts.
- `scripts/` — Automation utilities for build processes, CI/CD workflows, and repository maintenance.

## Documentation Touchpoints
- [Documentation Index](../docs/README.md) — agent-update:docs-index
- [Project Overview](../docs/project-overview.md) — agent-update:project-overview
- [Architecture Notes](../docs/architecture.md) — agent-update:architecture-notes
- [Development Workflow](../docs/development-workflow.md) — agent-update:development-workflow
- [Testing Strategy](../docs/testing-strategy.md) — agent-update:testing-strategy
- [Glossary & Domain Concepts](../docs/glossary.md) — agent-update:glossary
- [Data Flow & Integrations](../docs/data-flow.md) — agent-update:data-flow
- [Security & Compliance Notes](../docs/security.md) — agent-update:security
- [Tooling & Productivity Guide](../docs/tooling.md) — agent-update:tooling

<!-- agent-readonly:guidance -->
## Collaboration Checklist
1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting `prisma/schema.prisma` or shared `packages/`.
3. Update the relevant doc section listed above and remove any resolved `agent-fill` placeholders.
4. Capture learnings back in [docs/README.md](../docs/README.md) or the appropriate task marker.

## Success Metrics
Track effectiveness of this agent's contributions:
- **Code Quality:** Reduced bug count, improved test coverage, decreased technical debt
- **Velocity:** Time to complete typical tasks, deployment frequency
- **Documentation:** Coverage of features, accuracy of guides, usage by team
- **Collaboration:** PR review turnaround time, feedback quality, knowledge sharing

**Target Metrics:**
- **Test Coverage:** Maintain >80% coverage on new feature logic.
- **Migration Safety:** 100% success rate on database migrations in CI/CD pipelines.
- **Linting:** Zero ESLint/Prettier warnings on submitted PRs.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: Prisma Client Out of Sync
**Symptoms:** Type errors when accessing database models; runtime errors stating columns do not exist.
**Root Cause:** `schema.prisma` has been modified, but the generated client in `node_modules` has not been updated.
**Resolution:**
1. Run `npx prisma generate` to rebuild the client.
2. If using a dev server, restart the server to load the new client.
**Prevention:** Add `prisma generate` to the `postinstall` script in `package.json`.

### Issue: Monorepo Dependency Linking Failures
**Symptoms:** Cannot find modules imported from `packages/` within `apps/`.
**Root Cause:** Local workspace packages are not linked correctly or build artifacts are missing.
**Resolution:**
1. Run the repository bootstrap command (e.g., `npm install` or `pnpm install`) at the root.
2. Ensure shared packages are built (e.g., `npm run build` in `packages/`).
**Prevention:** Always run the root install command after pulling changes.

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
