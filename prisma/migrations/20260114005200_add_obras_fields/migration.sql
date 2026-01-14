-- CreateEnum
CREATE TYPE "ObraTipo" AS ENUM ('CONSTRUCAO', 'REFORMA', 'INSTALACAO', 'ELETRICA', 'HIDRAULICA', 'INFRAESTRUTURA', 'CIVIL', 'OUTRO');

-- CreateEnum
CREATE TYPE "ObraEnderecoTipo" AS ENUM ('URBANO', 'RURAL');

-- CreateEnum
CREATE TYPE "ObraBdiTipo" AS ENUM ('UNICO', 'DIFERENCIADO');

-- CreateEnum
CREATE TYPE "ObraRecursoTipo" AS ENUM ('PROPRIO', 'MISTO', 'FEDERAL', 'ESTADUAL');

-- AlterTable
ALTER TABLE "Obra" ADD COLUMN     "avancoFinanceiroPercent" DECIMAL(5,2) DEFAULT 0,
ADD COLUMN     "avancoFisicoPercent" DECIMAL(5,2) DEFAULT 0,
ADD COLUMN     "bdiDescontoPercent" DECIMAL(5,2),
ADD COLUMN     "bdiEquipamentoPercent" DECIMAL(5,2),
ADD COLUMN     "bdiMaoDeObraPercent" DECIMAL(5,2),
ADD COLUMN     "bdiMaterialPercent" DECIMAL(5,2),
ADD COLUMN     "bdiServicoPercent" DECIMAL(5,2),
ADD COLUMN     "bdiTaxaPercent" DECIMAL(5,2),
ADD COLUMN     "bdiTipo" "ObraBdiTipo" DEFAULT 'UNICO',
ADD COLUMN     "bdiUnicoPercent" DECIMAL(5,2),
ADD COLUMN     "construidoM2" DECIMAL(12,2),
ADD COLUMN     "convenio" TEXT,
ADD COLUMN     "enderecoBairro" TEXT,
ADD COLUMN     "enderecoCep" TEXT,
ADD COLUMN     "enderecoLogradouro" TEXT,
ADD COLUMN     "enderecoNumero" TEXT,
ADD COLUMN     "enderecoTipo" "ObraEnderecoTipo",
ADD COLUMN     "indicacao" TEXT,
ADD COLUMN     "possuiContrapartida" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurso" "ObraRecursoTipo" DEFAULT 'PROPRIO',
ADD COLUMN     "responsavelNome" TEXT,
ADD COLUMN     "tipo" "ObraTipo" NOT NULL DEFAULT 'CONSTRUCAO',
ADD COLUMN     "titulo" TEXT,
ADD COLUMN     "valorContrapartida" DECIMAL(15,2),
ADD COLUMN     "valorTotalConvenio" DECIMAL(15,2),
ADD COLUMN     "valorTotalObra" DECIMAL(15,2);

-- CreateTable
CREATE TABLE "ObraDotacao" (
    "id" TEXT NOT NULL,
    "projetoAtividade" TEXT NOT NULL,
    "codigoReduzido" TEXT NOT NULL,
    "naturezaDespesa" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,

    CONSTRAINT "ObraDotacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ObraDotacao_obraId_idx" ON "ObraDotacao"("obraId");

-- AddForeignKey
ALTER TABLE "ObraDotacao" ADD CONSTRAINT "ObraDotacao_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
