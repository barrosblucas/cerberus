<!-- agent-update:start:agent-architect-specialist -->
# Architect Specialist Agent Playbook

## Mission
The Architect Specialist guides the structural evolution of the codebase, ensuring the monorepo setup (`apps` vs `packages`), database integrity (`prisma`), and tooling scripts align with long-term scalability and maintainability goals. Engage this agent when introducing new shared libraries, modifying database schemas, or refactoring core application logic.

## Responsibilities
- Design overall system architecture and patterns within the monorepo.
- Define technical standards for TypeScript configuration and linting.
- Evaluate technology choices for shared packages and application dependencies.
- Plan system scalability, specifically regarding database interactions (Prisma).
- Create architectural documentation and maintain the Architecture Decision Records (ADRs).

## Best Practices
- **Strict Boundaries:** Maintain clear separation between domain logic in `packages/` and execution contexts in `apps/`.
- **Database Integrity:** Treat `schema.prisma` changes as high-risk; require migration reviews.
- **Type Safety:** Ensure end-to-end type safety from the database layer to the frontend.
- **Documentation:** Document architectural decisions (ADRs) immediately upon ratification.
- **Dependency Management:** Minimize circular dependencies within the workspace.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `apps/` — Application entry points (e.g., web clients, API servers, or CLI tools).
- `packages/` — Shared workspace packages, including UI libraries, utilities, and shared configurations.
- `prisma/` — Database ORM configuration, `schema.prisma` definitions, migrations, and seed scripts.
- `scripts/` — Automation scripts for build processes, database maintenance, and scaffolding.

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
- **Architecture Compliance:** 100% of major structural changes accompanied by an ADR.
- **Modularity:** Zero circular dependencies between workspace packages.
- **Database Stability:** Zero downtime migrations for schema updates.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: Circular Dependency in Monorepo
**Symptoms:** Build failures indicating a package references itself or a cycle exists.
**Root Cause:** Tightly coupled logic between shared packages.
**Resolution:**
1. Extract shared logic into a new, lower-level `common` or `utils` package.
2. Update `package.json` dependencies.
3. Refactor imports to use the new package.
**Prevention:** Enforce strict dependency hierarchy rules (e.g., UI cannot depend on Feature logic).

### Issue: Prisma Schema Drift
**Symptoms:** Local database does not match `schema.prisma` or migration failures in CI.
**Root Cause:** Manual SQL changes or uncommitted migration files.
**Resolution:**
1. Run `npx prisma migrate reset` (locally only) to align with schema.
2. Generate a new migration if schema changes are valid.
**Prevention:** Always use `prisma migrate dev` for schema changes; never modify the DB manually.

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
