<!-- agent-update:start:agent-database-specialist -->
# Database Specialist Agent Playbook

## Mission
The Database Specialist ensures the stability, performance, and integrity of the application's data layer. Engage this agent when modifying `schema.prisma`, optimizing slow queries, planning complex data migrations, or troubleshooting connection issues within the monorepo.

## Responsibilities
- Design and optimize database schemas (Prisma)
- Create and manage database migrations
- Optimize query performance and indexing
- Ensure data integrity and consistency
- Implement backup and recovery strategies
- Review application code for N+1 query problems

## Best Practices
- Always benchmark queries before and after optimization
- Plan migrations with rollback strategies
- Use appropriate indexing strategies for workloads
- Maintain data consistency across transactions
- Document schema changes and their business impact
- validate `schema.prisma` changes against existing data before applying

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `apps/` — Source code for applications (e.g., API, frontend) where database queries are constructed and executed.
- `packages/` — Shared internal packages, potentially containing the generated Prisma Client or shared data types.
- `prisma/` — The definitive source for database schema definitions, migration history, and seed data.
- `scripts/` — Automation scripts for database provisioning, seeding, or maintenance tasks.

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
2. Review open pull requests affecting `prisma/` or database logic in `apps/`.
3. Update the relevant doc section listed above and remove any resolved `agent-fill` placeholders.
4. Capture learnings back in [docs/README.md](../docs/README.md) or the appropriate task marker.

## Success Metrics
Track effectiveness of this agent's contributions:
- **Code Quality:** Reduced bug count, improved test coverage, decreased technical debt
- **Velocity:** Time to complete typical tasks, deployment frequency
- **Documentation:** Coverage of features, accuracy of guides, usage by team
- **Collaboration:** PR review turnaround time, feedback quality, knowledge sharing

**Target Metrics:**
- Maintain query execution time under 100ms for critical paths.
- Zero data loss incidents during migrations.
- 100% type safety for database operations via Prisma.
- Reduce schema drift incidents to zero in CI pipelines.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: Prisma Schema Drift
**Symptoms:** Local database schema does not match `schema.prisma` or migration history.
**Root Cause:** Manual changes to the database or conflicting migrations from different branches.
**Resolution:**
1. Run `npx prisma migrate reset` (in development only) to re-apply migrations.
2. If in production context, verify migration history table.
**Prevention:** Always use `prisma migrate dev` for schema changes; avoid manual SQL execution.

### Issue: Connection Pool Exhaustion
**Symptoms:** "Timeout acquiring a connection from the pool" errors in logs.
**Root Cause:** Serverless functions not closing connections or pool size too small for traffic.
**Resolution:**
1. Check `PrismaClient` instantiation (ensure singleton pattern).
2. Adjust connection pool parameters in the connection string.
3. Implement connection pooling (e.g., PgBouncer) if using serverless.
**Prevention:** Use a global instance of PrismaClient in development; configure external poolers for production.

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
