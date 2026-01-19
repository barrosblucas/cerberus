import { Module } from "@nestjs/common";
import { SinapiModule } from "../sinapi/sinapi.module";
import { PrismaService } from "../../shared/prisma.service";
import { TabelaReferenciaController } from "./tabela-referencia/tabela-referencia.controller";
import { ImportController } from "./importer/import.controller";
import { ImportService } from "./importer/import.service";

@Module({
  imports: [SinapiModule],
  controllers: [TabelaReferenciaController, ImportController],
  providers: [ImportService, PrismaService],
})
export class OrcamentosAdminModule { }
