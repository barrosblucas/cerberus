
import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { CreateTabelaInput, CreateTabelaInputSchema } from "@repo/contracts";
import { PrismaService } from "../../../shared/prisma.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from "../../auth/roles.guard";

@Controller("tabelas-referencia")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TabelaReferenciaController {
    constructor(private prisma: PrismaService) { }

    @Post()
    async create(@Body() body: unknown) {
        const data = CreateTabelaInputSchema.parse(body);
        const tabela = await this.prisma.tabelaReferencia.create({
            data,
        });
        return { tabela };
    }

    @Get()
    async list() {
        const tabelas = await this.prisma.tabelaReferencia.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { tabelas };
    }
}
