<!-- agent-update:start:security -->
# Security & Compliance Notes

Capture the policies and guardrails that keep this project secure and compliant.

## Authentication & Authorization

### Identity Management
- **Authentication Strategy**: The application handles user identity via a centralized authentication provider (e.g., NextAuth.js, Auth0, or similar) integrated with the backend services.
- **Session Management**: User sessions are maintained using secure, HTTP-only cookies or short-lived JWTs to minimize exposure to XSS attacks.
- **Service-to-Service Auth**: Internal communication between `apps` and services is secured via API keys or mTLS where applicable.

### Role-Based Access Control (RBAC)
- **Model**: Permissions are defined based on user roles (e.g., `Admin`, `User`, `Guest`) stored in the database.
- **Implementation**:
  - **API Layer**: Middleware verifies valid session tokens and required roles before processing requests.
  - **Database Layer**: The `prisma` schema defines user relations and access scopes.
  - **Frontend**: UI components are conditionally rendered based on the user's active role permissions.

## Secrets & Sensitive Data

### Secret Management
- **Local Development**: Secrets are stored in `.env` files which are included in `.gitignore` to prevent version control leakage.
- **CI/CD Pipelines**: Secrets for testing and deployment are stored in the CI provider's secure environment variable storage (e.g., GitHub Actions Secrets).
- **Production**: Secrets are injected at runtime via the hosting platform's secret manager or environment configuration.

### Data Protection
- **Encryption at Rest**: Database volumes and sensitive fields (like passwords) are encrypted. Passwords are hashed using strong algorithms (e.g., bcrypt/Argon2) before storage.
- **Encryption in Transit**: All data transmission occurs over TLS/SSL (HTTPS).

## Compliance & Policies

### Dependency Security
- **Scanning**: The repository utilizes `npm audit` or equivalent tools in the `scripts` directory to identify vulnerabilities in `packages` and dependencies.
- **Updates**: Critical security patches for dependencies are prioritized in the development cycle.

### Data Privacy (GDPR/CCPA)
- **Data Minimization**: Only essential user data required for application functionality is collected.
- **Right to Erasure**: Mechanisms exist (or are planned) to allow users to request deletion of their personal data from the `prisma` database.

## Incident Response

### Triage & Escalation
1. **Detection**: Issues are identified via monitoring alerts, user reports, or automated security scans.
2. **Triage**: The engineering team assesses severity based on data exposure and system impact.
3. **Escalation**: Critical incidents are escalated to the project maintainers immediately.

### Contacts
- **Security Lead**: [Maintainer Name/Email]
- **Infrastructure**: [DevOps Lead/Email]

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Confirm security libraries and infrastructure match current deployments.
2. Update secrets management details when storage or naming changes.
3. Reflect new compliance obligations or audit findings.
4. Ensure incident response procedures include current contacts and tooling.

<!-- agent-readonly:sources -->
## Acceptable Sources
- Security architecture docs, runbooks, policy handbooks.
- IAM/authorization configuration (code or infrastructure).
- Compliance updates from security or legal teams.
- `package.json` for dependency auditing tools.

<!-- agent-update:end -->
