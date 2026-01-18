-- DropForeignKey
ALTER TABLE "ItemComposicao" DROP CONSTRAINT "ItemComposicao_composicaoPaiId_fkey";

-- AddForeignKey
ALTER TABLE "ItemComposicao" ADD CONSTRAINT "ItemComposicao_composicaoPaiId_fkey" FOREIGN KEY ("composicaoPaiId") REFERENCES "Composicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
