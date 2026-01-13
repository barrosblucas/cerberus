import { Controller, Get, Param, Res, StreamableFile, NotFoundException } from "@nestjs/common";
import { Response } from "express";
import { PdfService } from "./pdf.service";
import { OrcamentosService } from "../orcamentos/orcamentos.service";
import { PrismaService } from "../../shared/prisma.service";

@Controller("reports")
export class ReportsController {
  constructor(
    private pdfService: PdfService,
    private prisma: PrismaService, // Accessing db directly or via service? Service is better but getOne might not have Obra included.
  ) {}

  @Get("orcamento/:id/pdf")
  async downloadOrcamentoPdf(@Param("id") id: string, @Res({ passthrough: true }) res: Response) {
    // Need to fetch Orçamento with Obra info
    const orcamento = await this.prisma.orcamento.findUnique({
      where: { id },
      include: {
        obra: true,
        etapas: {
          include: { itens: true },
          orderBy: { ordem: "asc" },
        },
      },
    });

    if (!orcamento) throw new NotFoundException("Orçamento not found");

    const pdfBuffer = await this.pdfService.generateOrcamentoPdf(orcamento);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="orcamento-${orcamento.nome}.pdf"`,
    });

    return new StreamableFile(pdfBuffer);
  }
}
