```markdown
---
ai_update_goal: "Manter o estado atual do projeto, lista de funcionalidades e dívidas técnicas atualizadas."
required_inputs: ["git status", "file structure", "routes definition"]
success_criteria: "Refletir com precisão a estrutura do monorepo, domínios ativos e roadmap técnico."
---

# PROJECT_STATE (Memória Viva)

<!-- agent-update:start:overview -->
## Visão Geral
Este repositório opera sob uma estrutura de **monorepo**, organizando o código em:
- **`apps/`**: Aplicações principais (front-end/back-end).
- **`packages/`**: Bibliotecas compartilhadas e configurações.
- **`prisma/`**: Camada de dados e ORM.
- **`scripts/`**: Utilitários de automação.

**Métricas Atuais:**
- Total de arquivos: ~47
- Tamanho aproximado: 0.10 MB
<!-- agent-update:end -->

<!-- agent-update:start:domains -->
## Domínios Implementados

### Users
- **Escopo**: Criação e visualização de dados de usuários.
- **Estado**: Funcional, sem autenticação.
<!-- agent-update:end -->

<!-- agent-update:start:api-routes -->
## Rotas API Ativas

| Método | Endpoint | Descrição | Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/v1/users` | Criação de novos usuários | Ativo |
| `GET` | `/v1/users` | Listagem de usuários | Ativo |
<!-- agent-update:end -->

<!-- agent-update:start:roadmap -->
## Pendências e Roadmap Técnico

### Segurança & Infraestrutura
- [ ] **Autenticação**: Implementar JWT (atualmente apenas scaffold).
- [ ] **Rate Limiting**: Implementar middleware de proteção contra abuso.

### Manutenção
- [ ] **Testes**: Expandir cobertura para os domínios existentes.
- [ ] **Documentação**: Atualizar Swagger/OpenAPI para as rotas `/v1/users`.
<!-- agent-update:end -->
```
