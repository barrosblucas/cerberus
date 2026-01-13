```markdown
---
title: Code Reviewer Agent Playbook
description: Operational guide for the AI agent responsible for reviewing code, enforcing standards, and ensuring architectural integrity.
ai_update_goal: Update playbook with monorepo structure and Prisma specific guidelines.
success_criteria:
  - directory_structure_defined: true
  - metrics_defined: true
  - troubleshooting_updated: true
---

<!-- agent-update:start:agent-code-reviewer -->
# Code Reviewer Agent Playbook

## Mission
The Code Reviewer agent acts as the guardian of code quality and architectural integrity. In this monorepo environment, the agent ensures that changes across applications and shared packages maintain separation of concerns, adhere to the database schema defined in Prisma, and follow established testing patterns.

## Responsibilities
- **Monorepo Integrity:** Verify that applications (`apps/`) do not cross-import directly and strictly utilize shared logic from `packages/`.
- **Database Safety:** Review `prisma/` schema changes to ensure migrations are generated and do not introduce destructive changes without warnings.
- **Code Quality:** Analyze logic for complexity, type safety (TypeScript), and adherence to functional programming patterns where applicable.
- **Security:** Identify potential injection points, improper data exposure, or insecure dependency usage.
- **Conventions:** Enforce naming conventions, directory structure alignment, and documentation updates.

## Best Practices
- **Context is King:** Always analyze changes within the context of the specific app or package being modified.
- **Schema First:** When reviewing backend changes, check `prisma/schema.prisma` first to understand data model impacts.
- **DRY (Don't Repeat Yourself):** Suggest moving duplicated logic from specific apps into shared `packages/`.
- **Test-Driven:** Ensure every bug fix includes a regression test and every new feature includes unit/integration tests.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `apps/` — Contains entry points for distinct applications (e.g., web clients, API servers). Code here should be thin, delegating logic to packages.
- `packages/` — Houses shared libraries, UI component kits, and core business logic utilities shared across the monorepo.
- `prisma/` — Contains the source of truth for the database schema (`schema.prisma`) and migration history.
- `scripts/` — Automation tools for CI/CD pipelines, database seeding, and development environment setup.

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
2. Review open pull requests affecting this area.
3. Update the relevant doc section listed above and remove any resolved `agent-fill` placeholders.
4. Capture learnings back in [docs/README.md](../docs/README.md) or the appropriate task marker.

## Success Metrics
Track effectiveness of this agent's contributions:
- **Code Quality:** Reduced bug count, improved test coverage, decreased technical debt
- **Velocity:** Time to complete typical tasks, deployment frequency
- **Documentation:** Coverage of features, accuracy of guides, usage by team
- **Collaboration:** PR review turnaround time, feedback quality, knowledge sharing

**Target Metrics:**
- **Test Coverage:** Maintain >80% coverage on core `packages/`.
- **Schema Safety:** 100% of PRs involving `prisma/` changes must include valid migration files.
- **Review Latency:** Provide initial feedback on PRs within 4 hours of assignment.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: Missing Prisma Migrations
**Symptoms:** CI fails during the database setup step, or runtime errors occur regarding missing columns/tables.
**Root Cause:** The `schema.prisma` file was modified, but `npx prisma migrate dev` was not run to generate the SQL migration file.
**Resolution:**
1. Revert the schema changes locally.
2. Apply the intended changes to `prisma/schema.prisma`.
3. Run `npx prisma migrate dev --name <descriptive-name>` to generate the migration.
4. Commit the new folder in `prisma/migrations/`.
**Prevention:** Add a pre-commit hook or CI check that verifies `prisma migrate diff` returns no changes.

### Issue: Monorepo Dependency Cycles
**Symptoms:** Build tools throw "Circular dependency detected" errors or imports return `undefined`.
**Root Cause:** Package A imports Package B, which implies or directly imports Package A.
**Resolution:**
1. Analyze the import paths in the failing packages.
2. Extract the shared logic causing the cycle into a new, lower-level package (e.g., `packages/shared-types` or `packages/utils`).
3. Update imports in both original packages to reference the new package.
**Prevention:** Strictly enforce a hierarchy where `apps` depend on `packages`, and `packages` only depend on lower-level utilities.

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
```
