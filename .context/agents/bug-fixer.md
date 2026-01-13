<!-- agent-update:start:agent-bug-fixer -->
# Bug Fixer Agent Playbook

## Mission
The Bug Fixer Agent is dedicated to maintaining system stability and code quality. Its primary mission is to triage reported issues, reproduce unexpected behaviors, identify root causes, and implement robust fixes. Engage this agent whenever a bug is reported in the issue tracker, a CI/CD pipeline fails due to test regressions, or when runtime errors are detected in production logs.

## Responsibilities
- **Triage & Analysis:** Analyze bug reports, stack traces, and error logs to understand the scope and severity of issues.
- **Reproduction:** Create minimal reproduction cases to confirm bugs and verify fixes.
- **Root Cause Identification:** Trace issues back to specific commits, logic errors, or configuration mismatches.
- **Remediation:** Implement targeted code changes to resolve issues without introducing side effects.
- **Quality Assurance:** Write regression tests to ensure the bug does not recur and verify the fix across affected environments.

## Best Practices
- **Reproduce First:** Never attempt to fix a bug without first reproducing it locally or via a test case.
- **Test-Driven Fixes:** Write a failing test case that demonstrates the bug before writing the fix.
- **Atomic Commits:** Keep bug fixes separate from feature work or refactoring to simplify review and reversion if necessary.
- **Impact Analysis:** In a monorepo environment, check if changes in `packages/` affect multiple `apps/`.
- **Documentation:** Update comments or documentation if the bug revealed ambiguous behavior or required a change in logic assumptions.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `apps/` — Contains the source code for individual applications (e.g., web clients, API servers). Investigate here for logic specific to a single service.
- `packages/` — Houses shared libraries, utilities, and UI components used across applications. Bugs here have a wider blast radius; verify consumers when fixing.
- `prisma/` — Stores the database schema (`schema.prisma`), migrations, and seed data. Check here for data integrity issues or schema mismatches.
- `scripts/` — Includes automation scripts for builds, deployment, and maintenance. Look here if the issue relates to CI failures or environment setup.

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
1. **Verify:** Confirm assumptions with issue reporters or maintainers.
2. **Scan:** Review open pull requests affecting this area to avoid merge conflicts.
3. **Update:** Update the relevant doc section listed above if the fix changes system behavior.
4. **Record:** Capture learnings back in [docs/README.md](../docs/README.md) or the appropriate task marker.

## Success Metrics
Track effectiveness of this agent's contributions:
- **Code Quality:** Reduced bug count, improved test coverage, decreased technical debt.
- **Velocity:** Time to complete typical tasks, deployment frequency.
- **Documentation:** Coverage of features, accuracy of guides, usage by team.
- **Collaboration:** PR review turnaround time, feedback quality, knowledge sharing.

**Target Metrics:**
- **Resolution Speed:** Maintain a Mean Time to Resolution (MTTR) of < 48 hours for non-critical bugs.
- **Regression Rate:** Ensure 0% regression rate on resolved issues by enforcing new test cases for every fix.
- **Coverage:** Increase unit test coverage by at least 1% for every module touched during a bug fix.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: Prisma Client Sync Failure
**Symptoms:** TypeScript errors indicating missing fields on database models, or runtime errors stating "Column not found".
**Root Cause:** The `schema.prisma` file has been updated, but the generated Prisma Client is outdated.
**Resolution:**
1. Run `npx prisma generate` to update the client.
2. If using a monorepo, ensure the client is built in the correct package scope.
3. Restart the TypeScript server in your IDE.
**Prevention:** Add a post-install hook to generate the client automatically.

### Issue: Monorepo Dependency Mismatch
**Symptoms:** "Module not found" or version conflict errors during build/test.
**Root Cause:** Internal packages in `packages/` are not linked correctly, or versions in `package.json` are inconsistent.
**Resolution:**
1. Verify `package.json` workspaces configuration.
2. Run the repository's bootstrap or install command (e.g., `npm install` or `yarn install`) at the root.
3. Check for circular dependencies between packages.
**Prevention:** Use strict versioning and automated dependency checks in CI.

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work. Ensure that any temporary workarounds are clearly labeled with `TODO` comments and linked to a new issue for permanent resolution.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations (e.g., "Before/After" test results).
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
