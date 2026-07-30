import PDFDocument from "pdfkit";
import fs from "fs";

export function generatePdf(filepath: string, data: any) {
  const doc = new PDFDocument();
  const output = fs.createWriteStream(filename);
  doc.pipe(output);
  doc.text(data);
  doc.end();
  return filepath;
}
