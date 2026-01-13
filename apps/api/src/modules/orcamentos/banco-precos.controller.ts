import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { GetComposicaoOutput, SearchItemResult } from "@repo/contracts";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { BancoPrecosService } from "./banco-precos.service";

@Controller("banco-precos")
@UseGuards(JwtAuthGuard)
export class BancoPrecosController {
  constructor(private readonly service: BancoPrecosService) {}

  @Get("search")
  async search(@Query() query: unknown): Promise<SearchItemResult[]> {
    return this.service.search(query);
  }

  @Get("composicao/:id")
  async getComposicao(@Param("id") id: string): Promise<GetComposicaoOutput> {
    return this.service.getComposicao(id);
  }
}
