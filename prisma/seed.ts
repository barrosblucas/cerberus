import { PrismaClient, Role, TipoInsumo } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Users
  const adminEmail = "admin@example.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin",
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log("Admin user created");
  }

  // 2. Seed Price Bank (SINAPI)
  const tableName = "SINAPI - JAN/2026";
  let tabela = await prisma.tabelaReferencia.findFirst({ where: { nome: tableName } });

  if (!tabela) {
    tabela = await prisma.tabelaReferencia.create({
      data: {
        nome: tableName,
        mes: 1,
        ano: 2026,
      },
    });
    console.log("Tabela SINAPI created");

    // Insumos
    const cimento = await prisma.insumo.create({
      data: {
        codigo: "00001",
        descricao: "CIMENTO PORTLAND CP II-32",
        unidade: "KG",
        preco: 0.85,
        tipo: TipoInsumo.MATERIAL,
        tabelaId: tabela.id,
      },
    });

    const areia = await prisma.insumo.create({
      data: {
        codigo: "00002",
        descricao: "AREIA MEDIA - POSTO JAZIDA/FORNECEDOR",
        unidade: "M3",
        preco: 65.0,
        tipo: TipoInsumo.MATERIAL,
        tabelaId: tabela.id,
      },
    });

    const servente = await prisma.insumo.create({
      data: {
        codigo: "00003",
        descricao: "SERVENTE COM ENCARGOS COMPLEMENTARES",
        unidade: "H",
        preco: 18.5,
        tipo: TipoInsumo.MAO_DE_OBRA,
        tabelaId: tabela.id,
      },
    });

    const pedreiro = await prisma.insumo.create({
      data: {
        codigo: "00004",
        descricao: "PEDREIRO COM ENCARGOS COMPLEMENTARES",
        unidade: "H",
        preco: 22.8,
        tipo: TipoInsumo.MAO_DE_OBRA,
        tabelaId: tabela.id,
      },
    });

    // Compositions
    // Concreto Magro (simulado)
    const concreto = await prisma.composicao.create({
      data: {
        codigo: "94250",
        descricao: "CONCRETO MAGRO PARA LASTRO, TRAÇO 1:4.5:4.5 (CIMENTO/ AREIA/ BRITA)",
        unidade: "M3",
        precoTotal: 450.0, // Dummy value
        tabelaId: tabela.id,
        itens: {
          create: [
            { quantidade: 300, insumoId: cimento.id },
            { quantidade: 0.8, insumoId: areia.id },
            { quantidade: 2.0, insumoId: servente.id }, // Mistura manual
            { quantidade: 1.0, insumoId: pedreiro.id },
          ],
        },
      },
    });
    console.log("Composicao Concreto created with ID: " + concreto.id);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
