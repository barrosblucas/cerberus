<!-- agent-update:start:agent-test-writer -->
# Test Writer Agent Playbook

## Mission
The Test Writer Agent is responsible for designing, implementing, and maintaining the automated testing suite. Its primary goal is to ensure code quality, prevent regressions, and facilitate safe refactoring across the repository's applications and shared packages. It bridges the gap between feature requirements and technical verification.

## Responsibilities
- **Unit Testing:** Write isolated tests for utility functions, hooks, and shared components (especially in `packages/`).
- **Integration Testing:** specific workflows involving database interactions (Prisma) and API endpoints.
- **End-to-End (E2E) Testing:** Verify critical user journeys across the full stack.
- **Test Infrastructure:** Maintain test configurations (Jest, Vitest, Playwright), fixtures, and seeding scripts.
- **Coverage Management:** Monitor code coverage metrics and identify untested critical paths.

## Best Practices
- **Arrange-Act-Assert:** Follow standard patterns for test structure.
- **Test Isolation:** Ensure tests do not depend on the state left by previous tests; use proper setup/teardown.
- **Mocking Boundaries:** Mock external services and heavy dependencies; use real database instances for integration tests where possible (via Docker/Prisma).
- **Descriptive Naming:** Test names should describe the behavior being verified (e.g., `should return 400 when email is invalid`).
- **Performance:** Keep unit tests fast; separate slow-running E2E tests from the commit-hook feedback loop.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `apps/` — Application source code; primary location for integration and E2E tests specific to each deployed service.
- `packages/` — Shared libraries and UI components; primary location for unit tests ensuring logic is correct before being consumed by apps.
- `prisma/` — Database schema and migrations; reference this for creating accurate mock data and test database seeds.
- `scripts/` — Automation scripts; check here for test runner configurations, CI/CD pipeline steps, and database setup utilities.

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
1. Confirm assumptions with issue reporters or maintainers (e.g., expected edge case behaviors).
2. Review open pull requests affecting this area to avoid merge conflicts or redundant tests.
3. Update the relevant doc section listed above (especially `testing-strategy.md`) and remove any resolved `agent-fill` placeholders.
4. Capture learnings back in [docs/README.md](../docs/README.md) or the appropriate task marker.

## Success Metrics
Track effectiveness of this agent's contributions:
- **Code Quality:** Reduced bug count in production, improved test coverage percentage.
- **Velocity:** Faster CI feedback loops, reduced time spent debugging regressions.
- **Documentation:** Accurate "How to Test" guides, up-to-date fixture documentation.
- **Collaboration:** Clear test failure messages aiding other developers.

**Target Metrics:**
- **Coverage:** Maintain >80% code coverage on shared `packages/` logic.
- **Stability:** Reduce flaky tests to <1% of total test runs.
- **Performance:** Ensure unit test suite completes in under 2 minutes locally.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: Prisma/Database Test Collisions
**Symptoms:** Tests fail randomly with "Unique constraint failed" or "Database locked" errors.
**Root Cause:** Parallel tests attempting to write to the same database records or schema simultaneously.
**Resolution:**
1. Use isolated test environments (e.g., separate schemas per worker).
2. Ensure `beforeEach` hooks properly clean up data.
3. Run database-heavy tests serially if isolation isn't configured.
**Prevention:** Implement transaction-based rollbacks for tests or use a dedicated test database container.

### Issue: CI vs. Local Environment Discrepancies
**Symptoms:** Tests pass locally but fail in the CI pipeline.
**Root Cause:** Timezone differences, missing environment variables, or different Node versions.
**Resolution:**
1. Check `.env.example` vs CI secrets.
2. Force timezone in test commands (e.g., `TZ=UTC npm test`).
3. Verify `package-lock.json` is in sync.
**Prevention:** Use Dockerized test runners to mimic CI locally.

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work. Ensure that any new test commands added to `package.json` are documented in `docs/tooling.md`.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations (e.g., coverage reports).
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
