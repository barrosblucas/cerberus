import { Module } from "@nestjs/common";
import { SinapiModule } from "../sinapi/sinapi.module";
import { PrismaService } from "../../shared/prisma.service";
import { OrcamentosController } from "./orcamentos.controller";
import { OrcamentosService } from "./orcamentos.service";

@Module({
  imports: [SinapiModule],
  controllers: [OrcamentosController],
  providers: [OrcamentosService, PrismaService],
  exports: [OrcamentosService],
})
export class OrcamentosModule { }
