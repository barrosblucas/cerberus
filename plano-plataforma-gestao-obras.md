# Plano da Plataforma de Gestão de Obras (AI Native / LLM Friendly)

Base de referência: módulos e fluxos inspirados no VighApp (cadastro de obra, orçamento, composições/insumos, medição, diário e fornecedores).

---

## 1) Visão do produto

**Objetivo:** centralizar e automatizar o ciclo de vida de obras públicas (uso interno), reduzindo retrabalho e acelerando relatórios, medições, diário e orçamento.

**KPIs práticos**
- Tempo para montar orçamento/planilha: **-50%**
- Tempo para gerar relatórios padrão (medição, boletins, diário): **-80%**
- Obras sem atualização (diário/medição atrasados): **-60%**
- Conformidade: **trilha de auditoria** completa (quem fez o quê e quando)

---

## 2) Escopo por módulos

### A) Cadastro e dossiê da Obra (núcleo)
**MVP**
- Cadastro: identificação, localização, responsáveis, cronograma macro, fonte/dotação orçamentária.
- **Dossiê**: anexos (projetos, editais, ART/RRT, fotos, relatórios, medições, contratos).
- Status da obra (planejamento / licitação / execução / paralisada / concluída).
- Trilha de auditoria + versionamento de documentos.

### B) Orçamento de Obras (composições, insumos, BDI/encargos)
**MVP**
- Estrutura: **Etapas** + itens.
- Itens com: unidade, quantidade, custo unitário, total.
- Parametrização: encargos, BDI, moeda, desconto.
- Exportações: XLSX/PDF (simples no início).

### C) Banco de preços (próprio + fontes: SINAPI/Sinduscon/ComprasGOV)
**Estratégia**
- Começar com **Banco Próprio** (cadastro e importação).
- Depois plugue conectores (SINAPI/Sinduscon/ComprasGOV).
- Armazenar: **fonte**, **referência (mês/ano)**, **UF**, **código**, **descrição normalizada**, **unidade**, **preço**, **vigência**.

### D) Medição de Obras
**MVP**
- Medição por período (mensal/semanal).
- Medição vinculada aos itens do orçamento (quantidade executada no período + acumulado).
- Boletim (PDF) e “resumo físico-financeiro”.

### E) Diário de Obra
**MVP**
- Registro diário: clima, equipe, equipamentos, ocorrências, fotos, serviços executados.
- Checklists (segurança, EPI, conformidade).
- Assinatura digital simples (login + registro) e evolução futura.

### F) Fornecedores / Licitação / Contratos
**MVP**
- Cadastro de fornecedores.
- Vínculos: contrato/ata/ordem de fornecimento.
- Associar fornecedor a itens (material/serviço) vencedores, vigência, reajuste e saldo.

### G) Dashboards + Alertas
**MVP**
- Painel: obras por status, atrasos de diário/medição, estouro de orçamento, pendências.
- Alertas (fila): e-mail primeiro; WhatsApp depois.

---

## 3) Modelo de dados inicial (mínimo para sustentar tudo)

**Entidades principais**
- **Obra**
- **Documento** (metadados + arquivo)
- **Orçamento** (versões)
- **Etapa**
- **ItemOrcamento**
- **Insumo**
- **Composição** (lista de insumos e coeficientes)
- **Medição** (período) + **MediçãoItem**
- **DiárioObra** + **DiárioAnexo**
- **Fornecedor**
- **Contrato/Licitação** (e vínculos)
- **Usuário / Papel / Permissão**
- **AuditLog** (imutável)

**Observação:** Orçamento, composição e preços precisam de **versionamento** (auditoria e rastreabilidade).

---

## 4) Arquitetura recomendada (AI Native + governamental)

### Stack sugerida (PWA + backend)
- **Front:** Next.js (PWA, responsivo)
- **Back:** NestJS (ou FastAPI) + API REST
- **DB:** PostgreSQL (com **pgvector** para embeddings)
- **Arquivos:** S3/MinIO (documentos e fotos)
- **Fila/Eventos:** Redis + BullMQ (ou RabbitMQ)
- **Auth:** Keycloak (OIDC) ou Auth.js (simples no início)
- **Observabilidade:** logs estruturados + auditoria no DB

### Pilares “governamentais”
- **RBAC** (perfis: Engenheiro, Fiscal, Compras, Controle Interno, Admin)
- **Trilha de auditoria** obrigatória
- **LGPD:** controles de acesso + retenção para CPF/CNPJ
- **Backup + retenção** por tipo de documento

---

## 5) IA “de verdade” (LLM Friendly)

### Casos de uso prioritários
1. **Gerador de Memorial Descritivo**
   - Entrada: orçamento + tipos de serviço + templates do município.
   - Saída: memorial padronizado + referências aos itens.
2. **Assistente de Obra**
   - “O que está pendente nesta obra?”
   - “Gere o relatório de medição do mês.”
   - “Liste riscos: atrasos, estouros, falta de diário, vigências.”
3. **Leitura e organização de documentos**
   - Classificar anexos do dossiê
   - Extrair metadados (nº contrato, datas, objeto)

### Como implementar (padrão robusto)
- **RAG por obra:** índice vetorial por Obra (documentos + diários + medições + orçamento).
- **Tools (function calling):** LLM chama funções ao invés de “chutar” dados:
  - `getObra(id)`, `listPendencias(id)`, `gerarMemorial(obraId, modeloId)`, `gerarBoletimMedicao(obraId, periodo)`
- **JSON schema** nas respostas (texto estruturado e relatórios).
- **Avaliação:** conjunto de testes com exemplos reais (memorial bom/ruim).

---

## 6) Roadmap recomendado

### Fase 0 — Fundacional
- Auth + RBAC
- Auditoria
- Dossiê de documentos (upload + tags + busca)
- Cadastro de Obra

### Fase 1 — MVP operacional
- Banco de preços próprio (Insumos + Composições)
- Orçamento (Etapas + Itens + BDI/Encargos)
- Medição por período vinculada aos itens
- Diário de Obra (com fotos)

### Fase 2 — Automação e relatórios
- PDFs oficiais (boletim, medições, diário consolidado)
- Dashboards (atrasos, estouros, pendências)
- Alertas por e-mail

### Fase 3 — IA forte + integrações
- Memorial por template + orçamento (RAG + tools)
- Importadores (SINAPI/Sinduscon/ComprasGOV)
- WhatsApp (após e-mail redondo)
- Extração inteligente de documentos (metadados)

---

## 7) Estrutura de repositório (para “100% AI coded”)

**Monorepo**
- `/apps/web` (Next/PWA)
- `/apps/api` (Nest/FastAPI)
- `/packages/shared` (tipos, validações, schemas)
- `/packages/ai` (prompts versionados, tools, evals)
- `/infra` (docker compose, terraform opcional)
- `/docs`
  - ADRs (decisões)
  - Modelos de relatórios
  - Glossário (Etapa, Item, Composição, etc.)

**Boas práticas para o LLM codar melhor**
- API com OpenAPI/Swagger sempre atualizado
- Schemas (Zod/Pydantic) como “fonte da verdade”
- Commits pequenos e testes mínimos por módulo
- E2E básico (Playwright) para telas críticas

---

## 8) Checklist do MVP (validação rápida)

- [ ] Cadastro de Obra + anexos organizados
- [ ] Orçamento com etapas/itens, custos e totais (com BDI/encargos)
- [ ] Banco próprio (insumos + composições)
- [ ] Medição por período com boletim exportável
- [ ] Diário com fotos e ocorrências
- [ ] Dashboard de pendências + alertas por e-mail
- [ ] Auditoria completa
