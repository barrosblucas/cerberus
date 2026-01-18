-- DropForeignKey
ALTER TABLE "Composicao" DROP CONSTRAINT "Composicao_tabelaId_fkey";

-- DropForeignKey
ALTER TABLE "Insumo" DROP CONSTRAINT "Insumo_tabelaId_fkey";

-- AddForeignKey
ALTER TABLE "Insumo" ADD CONSTRAINT "Insumo_tabelaId_fkey" FOREIGN KEY ("tabelaId") REFERENCES "TabelaReferencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Composicao" ADD CONSTRAINT "Composicao_tabelaId_fkey" FOREIGN KEY ("tabelaId") REFERENCES "TabelaReferencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
