```markdown
---
title: Project Conventions & Standards
ai_update_goal: Define and maintain coding standards, naming conventions, and architectural patterns across the monorepo.
required_inputs:
  - Current linting rules (ESLint/Prettier config)
  - Database schema practices
  - Logging library configuration
success_criteria:
  - All sections (Naming, Logging, Errors, Database, Testing) are clearly defined with examples.
  - Monorepo structure conventions are included.
  - No abbreviations or ambiguity in guidelines.
related_agents:
  - agents/backend-dev.md
  - agents/qa-engineer.md
---

# CONVENTIONS

<!-- agent-update:start:naming -->
## Naming Conventions

### General
- **Variables & Functions:** Use `camelCase`.
  - *Good:* `userRepository`, `findUserById`
  - *Bad:* `User_Repository`, `get_user`
- **Classes & Interfaces:** Use `PascalCase`.
  - *Good:* `UserService`, `AuthResponse`
- **Files:**
  - Use `kebab-case` for filenames (e.g., `user-service.ts`, `create-user.dto.ts`).
- **No Abbreviations:** Clarity over brevity.
  - *Good:* `request`, `response`, `authenticated`
  - *Bad:* `req`, `res`, `authd`

### Identifiers
- IDs should be typed as `string` (UUIDs/CUIDs).
- Future considerations: Branded types (e.g., `UserId = string & { __brand: 'UserId' }`) for stricter type safety.
<!-- agent-update:end -->

<!-- agent-update:start:logging -->
## Logging Standards

- **Library:** Pino (JSON format).
- **Privacy:** **NEVER** log PII (Personally Identifiable Information) or raw payloads containing secrets (passwords, tokens).
- **Structure:**
  Logs must be structured objects to facilitate querying in observability tools.
  ```json
  {
    "level": "info",
    "time": 1672531200000,
    "requestId": "req_123",
    "userId": "user_456",
    "domain": "auth",
    "action": "login_attempt",
    "msg": "User logged in successfully"
  }
  ```
- **Mandatory Context Fields:**
  - `requestId`: For tracing requests across microservices or modules.
  - `userId`: (If available) To associate logs with a specific user.
  - `domain`: The functional area (e.g., `billing`, `users`, `inventory`).
  - `action`: The specific operation (e.g., `create`, `update`, `validate`).
<!-- agent-update:end -->

<!-- agent-update:start:errors -->
## Error Handling

- **API Response Shape:**
  All API errors must return a predictable JSON structure:
  ```typescript
  interface ApiError {
    code: string;       // Machine-readable error code (e.g., 'USER_NOT_FOUND')
    message: string;    // Human-readable message
    details?: unknown;  // Optional validation details or metadata
  }
  ```
- **Practices:**
  - Throw custom Error classes (e.g., `AppError`, `ValidationError`) rather than generic errors.
  - Map internal exceptions to appropriate HTTP Status Codes (400 vs 500).
  - Ensure error messages sent to the client do not leak implementation details.
<!-- agent-update:end -->

<!-- agent-update:start:database -->
## Database (Prisma)

- **Schema Management:**
  - Any change to `schema.prisma` requires a corresponding migration.
  - Use `npx prisma migrate dev` for local development.
- **Documentation:**
  - Use `///` comments in `schema.prisma` to document models and fields, especially for business logic constraints.
- **Performance:**
  - **Avoid N+1 queries:** Use `include` or `select` with intention.
  - Be cautious with strictly nested writes.
<!-- agent-update:end -->

<!-- agent-update:start:monorepo -->
## Monorepo Structure

- **`apps/`**: Contains deployable applications (e.g., API servers, frontend apps). Logic here should be specific to the application.
- **`packages/`**: Shared libraries and utilities. Code here should be stateless, reusable, and thoroughly tested.
- **`prisma/`**: Database schema and migrations (centralized for the repository).
- **`scripts/`**: Automation scripts for build, CI/CD, and maintenance.
<!-- agent-update:end -->

<!-- agent-update:start:tsdoc -->
## TSDoc & Documentation

- **Public API:** Exported functions and classes must have TSDoc comments.
- **Content:** Explain the **WHY** and **HOW**, not just the **WHAT**.
  - *Good:* "Calculates tax based on 2024 regional rules. Throws if region is invalid."
  - *Bad:* "Calculates tax."
<!-- agent-update:end -->

<!-- agent-update:start:debug -->
## Debugging & Code Quality

- **Console:** Committing `console.log` is prohibited. Use the configured logger.
- **Linting:** Code must pass all linter checks (ESLint/Prettier) before merge.
- **Testing:**
  - Unit tests should be co-located or in `__tests__` directories.
  - Filenames: `*.test.ts` or `*.spec.ts`.
<!-- agent-update:end -->
```
