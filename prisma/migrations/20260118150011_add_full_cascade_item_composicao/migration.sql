-- DropForeignKey
ALTER TABLE "ItemComposicao" DROP CONSTRAINT "ItemComposicao_composicaoFilhaId_fkey";

-- DropForeignKey
ALTER TABLE "ItemComposicao" DROP CONSTRAINT "ItemComposicao_insumoId_fkey";

-- AddForeignKey
ALTER TABLE "ItemComposicao" ADD CONSTRAINT "ItemComposicao_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComposicao" ADD CONSTRAINT "ItemComposicao_composicaoFilhaId_fkey" FOREIGN KEY ("composicaoFilhaId") REFERENCES "Composicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
