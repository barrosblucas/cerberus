
import { Controller, Get, Query, Module, Injectable, UseGuards } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma.service";
import { SearchItemDTO, SearchItemResult } from "@repo/contracts";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Injectable()
export class BancoPrecosService {
    constructor(private prisma: PrismaService) { }

    async search(query: { q: string }): Promise<SearchItemResult[]> {
        // Implement Full Text Search or ILIKE
        // Note: Prisma Full Text Search requires Preview Feature, sticking to contains for now.
        const termo = query.q;

        const insumos = await this.prisma.insumo.findMany({
            where: {
                OR: [
                    { descricao: { contains: termo, mode: 'insensitive' } },
                    { codigo: { contains: termo } }
                ]
            },
            take: 20
        });

        const composicoes = await this.prisma.composicao.findMany({
            where: {
                OR: [
                    { descricao: { contains: termo, mode: 'insensitive' } },
                    { codigo: { contains: termo } }
                ]
            },
            take: 20
        });

        const results: SearchItemResult[] = [];

        results.push(...insumos.map((i: any) => ({
            id: i.id,
            codigo: i.codigo,
            descricao: i.descricao,
            unidade: i.unidade,
            preco: Number(i.preco), // Decimal to Number
            tipo: "INSUMO" as const,
            origem: "SINAPI" // TODO: Get from Tabela (requires include)
        })));

        results.push(...composicoes.map((c: any) => ({
            id: c.id,
            codigo: c.codigo,
            descricao: c.descricao,
            unidade: c.unidade,
            preco: Number(c.precoTotal),
            tipo: "COMPOSICAO" as const,
            origem: "SINAPI"
        })));

        return results;
    }
}

@Controller("banco-precos")
@UseGuards(JwtAuthGuard)
export class BancoPrecosController {
    constructor(private service: BancoPrecosService) { }

    @Get("search")
    async search(@Query() query: any) {
        // Validation could be strict here
        return this.service.search({ q: query.q });
    }
}

@Module({
    controllers: [BancoPrecosController],
    providers: [BancoPrecosService, PrismaService],
})
export class BancoPrecosModule { }
