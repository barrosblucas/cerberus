/*
  Warnings:

  - A unique constraint covering the columns `[codigo,tabelaId]` on the table `Composicao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo,tabelaId]` on the table `Insumo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ItemOrcamento" ADD COLUMN     "codigoSinapi" TEXT,
ADD COLUMN     "referenciaSinapi" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Composicao_codigo_tabelaId_key" ON "Composicao"("codigo", "tabelaId");

-- CreateIndex
CREATE UNIQUE INDEX "Insumo_codigo_tabelaId_key" ON "Insumo"("codigo", "tabelaId");
