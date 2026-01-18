# Changelog - 2026-01-18

## Admin - Gestão de Tabelas de Preço
- **Funcionalidade**: Adicionado botão para excluir tabelas de referência (Banco de Preços).
- **Segurança**: Implementada verificação rigorosa para impedir a exclusão de tabelas que possuam itens vinculados a orçamentos ou composições de outras tabelas.
- **Banco de Dados**: Atualizado schema Prisma para permitir exclusão em cascata (`onDelete: Cascade`) de insumos e composições ao remover a tabela pai, facilitando a limpeza de dados não utilizados.
- **API**: Adicionado endpoint `DELETE /v1/tabelas-referencia/:id`.
- **Frontend**: Adicionado ícone de lixeira na lista de tabelas com confirmação de usuário.

## Mudanças Técnicas
- Modificado `prisma/schema.prisma` (migrations aplicadas).
- Atualizado `@repo/contracts` com `DeleteTabelaOutput`.
- Atualizado `TabelaReferenciaController` com o método `remove`.
- Atualizado `AdminPriceBankPage` com lógica de exclusão.
