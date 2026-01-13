
import { Controller, Get, Post, Put, Body, Param, NotFoundException, UseGuards, UnauthorizedException } from "@nestjs/common";
import { OrcamentosService } from "./orcamentos.service";
import { CreateOrcamentoInputSchema, UpdateOrcamentoItemsInputSchema } from "@repo/contracts";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";

@Controller("orcamentos")
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrcamentosController {
    constructor(private service: OrcamentosService) { }

    @Post()
    async create(@Body() body: unknown) {
        const data = CreateOrcamentoInputSchema.parse(body);
        const orcamento = await this.service.create(data);
        return { orcamento };
    }

    @Get("obra/:obraId")
    async listByObra(@Param("obraId") obraId: string) {
        const orcamentos = await this.service.getByObra(obraId);
        return { orcamentos };
    }

    @Get(":id")
    async getOne(@Param("id") id: string) {
        const orcamento = await this.service.getOne(id);
        if (!orcamento) throw new NotFoundException();
        return { orcamento };
    }

    @Put(":id/items")
    async updateItems(@Param("id") id: string, @Body() body: unknown) {
        const data = UpdateOrcamentoItemsInputSchema.parse(body);
        const orcamento = await this.service.updateItems(id, data);
        return { orcamento };
    }
}
