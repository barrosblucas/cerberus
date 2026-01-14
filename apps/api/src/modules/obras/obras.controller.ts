import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type {
  CreateObraOutput,
  DeleteObraOutput,
  GetObraOutput,
  ListObrasOutput,
  UpdateObraOutput,
} from "@repo/contracts";
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
  async get(@Param("id") id: string): Promise<GetObraOutput> {
    const obra = await this.service.get(id);
    return { obra };
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: unknown): Promise<UpdateObraOutput> {
    const obra = await this.service.update(id, body);
    return { obra };
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<DeleteObraOutput> {
    const obra = await this.service.remove(id);
    return { obra };
  }
}
