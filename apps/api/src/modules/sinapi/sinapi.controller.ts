import { Controller, Get, Post, Query, Param, Body, UseGuards } from "@nestjs/common";
import { SinapiProviderService } from "./sinapi-provider.service";
import { SinapiIngesterService } from "./sinapi-ingester.service";
import { SinapiFiltersSchema, SinapiScenarioSchema } from "@repo/contracts";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("sinapi")
@UseGuards(JwtAuthGuard)
export class SinapiController {
    constructor(
        private readonly provider: SinapiProviderService,
        private readonly ingester: SinapiIngesterService
    ) { }

    @Get("items")
    async list(@Query() query: any) {
        const filters = SinapiFiltersSchema.parse(query);
        return this.provider.listItems(filters);
    }

    @Get("items/:codigo/details")
    async getDetails(
        @Param("codigo") codigo: string,
        @Query("uf") uf: string = "MS",
        @Query("cenario") cenario: any = "nao_desonerado",
        @Query("referencia") referencia: string = "2025-12"
    ) {
        const cen = SinapiScenarioSchema.parse(cenario);
        return this.provider.getDetails(codigo, uf, cen, referencia);
    }

    @Post("ingest")
    async ingest(@Body("filePath") filePath: string) {
        return this.ingester.ingestFile(filePath);
    }
}
