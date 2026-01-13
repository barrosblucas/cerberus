```markdown
<!-- agent-update:start:testing-strategy -->
# Testing Strategy

This document outlines the testing standards, tools, and workflows for the monorepo. It ensures that changes across `apps`, `packages`, and `prisma` layers utilize a consistent quality assurance process.

## Test Types

### Unit Testing
- **Scope**: Individual functions, utility classes, and shared logic within `packages/` and `apps/`.
- **Framework**: Jest (configured via `jest.config.js` in root or per-package).
- **Conventions**:
  - Files located alongside source code: `src/utils/calc.ts` -> `src/utils/calc.test.ts` or `__tests__` directories.
  - Mocks are strictly used for external dependencies (database, network) to ensure speed.

### Integration Testing
- **Scope**: API endpoints, database interactions (Prisma), and cross-service communication.
- **Focus**: Verifying that `prisma` schemas and migrations work correctly with application logic.
- **Environment**: Requires a local test database (often spun up via Docker Compose) or an in-memory database replacement.
- **Tooling**: Jest with `supertest` for API routes; localized database instances.

### End-to-End (E2E) Testing
- **Scope**: Full application workflows in `apps/`.
- **Tooling**: Playwright or Cypress (refer to `package.json` devDependencies).
- **Environment**: Runs against a staging-like build of the frontend and backend.

## Running Tests

### Standard Execution
Run the full suite across the monorepo (utilizing workspace scripts):
```bash
npm run test
```

### Targeted Execution
To run tests for a specific workspace (e.g., a specific package or app):
```bash
npm run test -w packages/<package-name>
# or
npm run test -w apps/<app-name>
```

### Watch Mode
Useful for local development loops to re-run tests on file save:
```bash
npm run test -- --watch
```

### Coverage
Generate coverage reports to identify untested paths:
```bash
npm run test -- --coverage
```

## Quality Gates

Before merging code, the following gates must be passed in the CI environment:

1.  **Linting**: `npm run lint` must pass without errors (ESLint).
2.  **Formatting**: `npm run format:check` must pass (Prettier).
3.  **Type Checking**: `npm run typecheck` (tsc) must confirm no type errors exist.
4.  **Test Pass Rate**: 100% of unit and integration tests must pass.
5.  **Coverage Thresholds** (Baseline):
    - Statements: > 80%
    - Branches: > 70%
    - Functions: > 80%
    - Lines: > 80%

## Troubleshooting

### Common Issues
- **Database Connection Failures**: Ensure the test database container is running (`docker ps`) and the `.env.test` file contains the correct connection string.
- **Prisma Client Desync**: Run `npx prisma generate` if schema changes are not reflected in types during tests.
- **Flaky Tests**: If a test fails intermittently, check for state leakage between tests. Ensure `beforeEach` and `afterAll` hooks clean up database records or mocks properly.
- **Timeout Errors**: Integration tests involving the database may require higher timeout thresholds in Jest config (e.g., `jest.setTimeout(10000)`).

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Review test scripts and CI workflows to confirm command accuracy.
2. Update Quality Gates with current thresholds (coverage %, lint rules, required checks).
3. Document new test categories or suites introduced since the last update.
4. Record known flaky areas and link to open issues for visibility.
5. Confirm troubleshooting steps remain valid with current tooling.

<!-- agent-readonly:sources -->
## Acceptable Sources
- `package.json` scripts and testing configuration files.
- CI job definitions (GitHub Actions, CircleCI, etc.).
- Issue tracker items labelled “testing” or “flaky” with maintainer confirmation.

<!-- agent-update:end -->
```
