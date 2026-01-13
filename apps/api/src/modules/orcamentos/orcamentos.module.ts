
import { Module } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma.service";
import { OrcamentosController } from "./orcamentos.controller";
import { OrcamentosService } from "./orcamentos.service";

@Module({
    controllers: [OrcamentosController],
    providers: [OrcamentosService, PrismaService],
    exports: [OrcamentosService]
})
export class OrcamentosModule { }
