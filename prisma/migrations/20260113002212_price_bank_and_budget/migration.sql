-- CreateEnum
CREATE TYPE "TipoInsumo" AS ENUM ('MATERIAL', 'MAO_DE_OBRA', 'EQUIPAMENTO', 'SERVICO');

-- CreateTable
CREATE TABLE "TabelaReferencia" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TabelaReferencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insumo" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "tipo" "TipoInsumo" NOT NULL,
    "tabelaId" TEXT NOT NULL,

    CONSTRAINT "Insumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Composicao" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "precoTotal" DECIMAL(10,2) NOT NULL,
    "tabelaId" TEXT NOT NULL,

    CONSTRAINT "Composicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemComposicao" (
    "id" TEXT NOT NULL,
    "quantidade" DECIMAL(12,4) NOT NULL,
    "composicaoPaiId" TEXT NOT NULL,
    "insumoId" TEXT,
    "composicaoFilhaId" TEXT,

    CONSTRAINT "ItemComposicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orcamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataBaseMonth" INTEGER NOT NULL,
    "dataBaseYear" INTEGER NOT NULL,
    "bdi" DECIMAL(5,2) DEFAULT 0,
    "encargos" DECIMAL(5,2) DEFAULT 0,
    "total" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "obraId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etapa" (
    "id" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,

    CONSTRAINT "Etapa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemOrcamento" (
    "id" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "quantidade" DECIMAL(12,4) NOT NULL,
    "valorUnitario" DECIMAL(10,2) NOT NULL,
    "valorTotal" DECIMAL(15,2) NOT NULL,
    "origem" TEXT NOT NULL,
    "etapaId" TEXT NOT NULL,
    "insumoId" TEXT,
    "composicaoId" TEXT,

    CONSTRAINT "ItemOrcamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Insumo_codigo_idx" ON "Insumo"("codigo");

-- CreateIndex
CREATE INDEX "Composicao_codigo_idx" ON "Composicao"("codigo");

-- AddForeignKey
ALTER TABLE "Insumo" ADD CONSTRAINT "Insumo_tabelaId_fkey" FOREIGN KEY ("tabelaId") REFERENCES "TabelaReferencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Composicao" ADD CONSTRAINT "Composicao_tabelaId_fkey" FOREIGN KEY ("tabelaId") REFERENCES "TabelaReferencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComposicao" ADD CONSTRAINT "ItemComposicao_composicaoPaiId_fkey" FOREIGN KEY ("composicaoPaiId") REFERENCES "Composicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComposicao" ADD CONSTRAINT "ItemComposicao_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComposicao" ADD CONSTRAINT "ItemComposicao_composicaoFilhaId_fkey" FOREIGN KEY ("composicaoFilhaId") REFERENCES "Composicao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orcamento" ADD CONSTRAINT "Orcamento_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etapa" ADD CONSTRAINT "Etapa_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "Orcamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrcamento" ADD CONSTRAINT "ItemOrcamento_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "Etapa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrcamento" ADD CONSTRAINT "ItemOrcamento_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrcamento" ADD CONSTRAINT "ItemOrcamento_composicaoId_fkey" FOREIGN KEY ("composicaoId") REFERENCES "Composicao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
