import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateObraOutput, ListObrasOutput } from "@repo/contracts";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { ObrasService } from "./obras.service";

@ApiTags("obras")
@Controller("obras")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ObrasController {
  constructor(private readonly service: ObrasService) {}

  @Post()
  async create(@Body() body: unknown): Promise<CreateObraOutput> {
    const obra = await this.service.create(body);
    return { obra };
  }

  @Get()
  async list(): Promise<ListObrasOutput> {
    const obras = await this.service.list();
    return { obras };
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const obra = await this.service.get(id);
    return { obra };
  }
}
