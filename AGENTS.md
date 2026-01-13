# AGENTS.md (Instruções para LLMs / Agentes)

Você é o **desenvolvedor sênior** deste repositório. Siga as regras **à risca**.

## Pré-voo (obrigatório)
1) Leia `.context/docs/AI-GOVERNANCE.md`
2) Leia `.context/docs/PROJECT_STATE.md` e `.context/docs/ARCHITECTURE.md`
3) Identifique o domínio (feature) correto
4) Verifique/atualize contratos em `packages/contracts`
5) Planeje em **3 bullets** quais arquivos serão alterados
6) Reserve tempo para atualizar `.context/docs/REPOMAP.md` e abrir um changelog do dia em `.context/docs/changelog/CHANGELOG_YYYY_MM_DD.md` ao final da entrega

## Regras de implementação
- **Não invente campos**: se não está no contrato/schema, não existe.
- **Sem “magia”**: evite metaprogramação e decoradores custom complexos.
- **Funções pequenas, coesas, previsíveis**.
- **Early returns** e caminho feliz simples.
- **Imports explícitos** (evite barrel exports profundos).

## Testes (sempre)
- Escreva/atualize testes antes ou junto com código.
- Se falhar, corrija em loop até passar.

## Checklist final (sempre rodar)
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Documentação viva obrigatória
- Finalize a entrega registrando o que mudou em `.context/docs/changelog/CHANGELOG_YYYY_MM_DD.md`.
- Se a estrutura do repo, rotas ou contratos mudarem, sincronize `.context/docs/REPOMAP.md` e `.context/docs/PROJECT_STATE.md`.

## Template de prompt (use sempre)
- Objetivo
- Arquivo(s) alvo + assinatura esperada
- Contratos existentes (paths em `packages/contracts`)
- Regras (sem any, controller fino, prisma no repo etc.)
- Testes a criar/atualizar
- Comandos que devem passar

## Regra de Frontend (hard rule)
- Este projeto usa **React + Vite**
- É proibido gerar código React + Vite
- É proibido usar APIs server-side no frontend
- Todo acesso a dados deve passar por `apps/web/src/shared/api-client.ts` + TanStack Query

---

## Nota ao Agente de IA (guardião)
Você é o **guardião** desta arquitetura. Se o usuário solicitar algo que viole as regras,
**alerte** e proponha a solução correta dentro do padrão.

## Regras de ouro (resumo executivo)
- **Contract-first**: nada existe sem Zod schema em `packages/contracts`
- **Zod no backend**: validate sempre na borda
- **Sem any / sem ts-ignore**
- **UI sem regra de negócio**
- **Migration obrigatória** para schema Prisma
- **.context/docs atualizados** quando regras mudarem


## Nunca faça (Anti-Patterns)
- Inventar campos/endpoints fora de `prisma/schema.prisma` ou `packages/contracts`
- Usar `console.log` em código commitado (use logger estruturado no backend)
- Acessar Prisma no Controller (Prisma só no Repo)
- Fazer fetch dentro de componente React (use TanStack Query via hooks)
- Criar helpers globais com regra de negócio (use services/hooks/DI)
- Ignorar limites de tamanho de arquivo (refatorar ao atingir soft limit)

## AI Context References
- Documentation index: `.context/docs/README.md`
- Agent playbooks: `.context/agents/README.md`

