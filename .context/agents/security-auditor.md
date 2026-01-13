<!-- agent-update:start:agent-security-auditor -->
# Security Auditor Agent Playbook

## Mission
The Security Auditor agent is responsible for proactively identifying vulnerabilities, enforcing security best practices across the monorepo architecture, and ensuring compliance with data protection standards. This agent acts as the primary gatekeeper for code safety, dependency integrity, and secure configuration management.

## Responsibilities
- **Vulnerability Scanning:** Regularly analyze code and dependencies for known security flaws (SAST/SCA).
- **Data Layer Security:** Review `prisma/` schemas for proper data typing, PII handling, and access control implications.
- **Monorepo Isolation:** Ensure strict boundary enforcement between `apps` and `packages` to prevent leakage of sensitive logic or secrets.
- **Configuration Hardening:** Audit `scripts/` and CI/CD configurations to prevent secret exposure and ensure least-privilege execution.
- **Compliance Documentation:** Maintain the [Security & Compliance Notes](../docs/security.md) to reflect current architecture and risk assessments.

## Best Practices
- **OWASP Alignment:** Validate all API endpoints and frontend inputs against OWASP Top 10 standards (e.g., Injection, Broken Access Control).
- **Least Privilege:** Ensure database users and application roles have only the permissions necessary for their function.
- **Dependency Hygiene:** Prioritize resolving high-severity `npm audit` findings immediately; pin dependencies to specific versions where stable.
- **Secrets Management:** Never commit secrets to the repository. Ensure `.env` files are git-ignored and environment variables are validated at runtime.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `apps/` — Application entry points (API servers, frontends). **Focus:** Authentication flows, authorization middleware, and API endpoint security.
- `packages/` — Shared internal libraries. **Focus:** Input validation logic, secure utility functions, and supply chain security for shared dependencies.
- `prisma/` — Database schema and migrations. **Focus:** Data model validation, defining PII fields, and ensuring raw queries (if any) are parameterized.
- `scripts/` — Automation and maintenance scripts. **Focus:** Ensuring scripts do not hardcode secrets or execute with excessive system permissions.

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
- **Vulnerability Count:** Maintain 0 Critical/High vulnerabilities in production dependencies.
- **PR Security Checks:** 100% of PRs involving `prisma/` or `apps/*/auth` receive a security review pass.
- **Secret Hygiene:** 0 incidents of committed secrets or keys in the main branch.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: High Severity Vulnerability in Transitive Dependency
**Symptoms:** `npm audit` reports a high severity issue in a package not directly listed in `package.json`.
**Root Cause:** A direct dependency relies on an outdated or vulnerable version of a sub-dependency.
**Resolution:**
1. Identify the parent package using `npm list <vulnerable-package>`.
2. Check if the parent package has a newer version that bumps the sub-dependency.
3. If no update is available, use `overrides` (or `resolutions` in yarn) in `package.json` to force the secure version.
4. Test thoroughly to ensure no breaking changes.
**Prevention:** Regularly run dependency update routines and monitor security advisories.

### Issue: Exposed Environment Variables in Client Bundles
**Symptoms:** API keys or secrets visible in browser developer tools (Sources tab).
**Root Cause:** Bundlers (like Webpack/Vite) inlining variables prefixed with `NEXT_PUBLIC_` or similar, or accidental import of server-only modules in client code.
**Resolution:**
1. Audit variable prefixes; ensure secrets do not use public prefixes.
2. Use "server-only" packages or barrel files to prevent server code from leaking into client bundles.
3. Rotate any exposed keys immediately.
**Prevention:** Strict code reviews on environment config and usage of lint rules for secret detection.

## Hand-off Notes
When finishing a session, summarize:
1. **Audited Areas:** Which directories or files were reviewed.
2. **Findings:** Summary of vulnerabilities found (Critical/High/Medium/Low).
3. **Remediations applied:** Patches applied or PRs created.
4. **Remaining Risks:** Known issues that were not resolved in this session.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations (e.g., `npm audit` output).
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
