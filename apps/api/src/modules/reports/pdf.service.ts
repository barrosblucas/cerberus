import { Injectable } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFDocument = require("pdfkit");

@Injectable()
export class PdfService {
  async generateOrcamentoPdf(orcamento: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // Header
      doc.fontSize(20).text("Relatório de Orçamento", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Obra: ${orcamento.obra?.nome || "N/A"}`);
      doc.text(`Orçamento: ${orcamento.nome}`);
      doc.text(`Data Base: ${orcamento.dataBaseMonth}/${orcamento.dataBaseYear}`);
      doc.moveDown();

      // Table Header
      const startY = doc.y;
      const colX = { code: 50, desc: 120, unit: 320, qty: 360, price: 420, total: 490 };

      doc.font("Helvetica-Bold");
      doc.text("Código", colX.code, startY);
      doc.text("Descrição", colX.desc, startY);
      doc.text("Und", colX.unit, startY);
      doc.text("Qtd", colX.qty, startY, { align: "right", width: 50 });
      doc.text("Unitário", colX.price, startY, { align: "right", width: 60 });
      doc.text("Total", colX.total, startY, { align: "right", width: 60 });

      doc
        .moveTo(50, doc.y + 15)
        .lineTo(550, doc.y + 15)
        .stroke();
      doc.moveDown();
      doc.font("Helvetica");

      // Items (Flattened for now, just iterating through first etapa for MVP)
      let currentY = doc.y + 10;

      orcamento.etapas?.forEach((etapa: any) => {
        doc.font("Helvetica-Bold").text(etapa.nome, 50, currentY);
        currentY += 20;

        etapa.itens?.forEach((item: any) => {
          if (currentY > 700) {
            doc.addPage();
            currentY = 50;
          }

          doc.font("Helvetica").fontSize(10);
          doc.text(item.codigo, colX.code, currentY);
          doc.text(item.descricao.substring(0, 40), colX.desc, currentY); // Truncate desc
          doc.text(item.unidade, colX.unit, currentY);
          doc.text(item.quantidade.toString(), colX.qty, currentY, { align: "right", width: 50 });
          doc.text(item.valorUnitario.toFixed(2), colX.price, currentY, {
            align: "right",
            width: 60,
          });
          doc.text(item.valorTotal.toFixed(2), colX.total, currentY, { align: "right", width: 60 });

          currentY += 15;
        });
        currentY += 10;
      });

      // Footer / Total
      doc.moveDown();
      doc.fontSize(14).font("Helvetica-Bold");
      doc.text(`Total Geral: R$ ${orcamento.total?.toFixed(2)}`, { align: "right" });

      doc.end();
    });
  }
}
