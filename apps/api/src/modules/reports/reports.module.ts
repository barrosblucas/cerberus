import { Module } from "@nestjs/common";
import { ReportsController } from "./reports.controller";
import { PdfService } from "./pdf.service";
import { PrismaService } from "../../shared/prisma.service";
import { OrcamentosModule } from "../orcamentos/orcamentos.module";

@Module({
  imports: [OrcamentosModule],
  controllers: [ReportsController],
  providers: [PdfService, PrismaService],
})
export class ReportsModule {}
