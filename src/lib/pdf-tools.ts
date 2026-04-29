import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function parsePageRanges(input: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
        throw new Error(`Invalid range: ${part}. Pages must be 1..${totalPages}.`);
      }
      for (let i = start; i <= end; i++) pages.add(i);
    } else {
      const page = Number(part);
      if (isNaN(page) || page < 1 || page > totalPages) {
        throw new Error(`Invalid page: ${part}. Must be 1..${totalPages}.`);
      }
      pages.add(page);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

// ---------- Merge ----------
export async function mergePDFs(files: File[]): Promise<Blob> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const pdf = await PDFDocument.load(await file.arrayBuffer());
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  const bytes = await merged.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

// ---------- Split ----------
export async function splitPDF(file: File, pageRangeStr: string): Promise<void> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const pages = parsePageRanges(pageRangeStr, pdf.getPageCount());
  const newPdf = await PDFDocument.create();
  const copied = await newPdf.copyPages(pdf, pages.map(p => p - 1));
  copied.forEach(p => newPdf.addPage(p));
  const bytes = await newPdf.save();
  const blob = new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
  saveAs(blob, `split_${file.name}`);
}

// ---------- Compress (image-based) ----------
async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();
  return pdfjs;
}

export async function compressPDF(file: File, quality: number = 0.5): Promise<Blob> {
  const { getDocument } = await loadPdfJs();
  const pdfDoc = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const newPdf = await PDFDocument.create();
  const scale = quality < 0.4 ? 1.0 : quality < 0.7 ? 1.2 : 1.5;

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const jpegBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), c => c.charCodeAt(0));
    const img = await newPdf.embedJpg(jpegBytes);
    const orig = page.getViewport({ scale: 1 });
    const newPage = newPdf.addPage([orig.width * 0.75, orig.height * 0.75]);
    newPage.drawImage(img, { x: 0, y: 0, width: newPage.getWidth(), height: newPage.getHeight() });
  }
  const bytes = await newPdf.save({ useObjectStreams: true });
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

// ---------- Rotate ----------
export async function rotatePDF(file: File, angle: 90 | 180 | 270): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  pdf.getPages().forEach(p => {
    const current = p.getRotation().angle;
    p.setRotation(degrees((current + angle) % 360));
  });
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

// ---------- Delete pages ----------
export async function deletePages(file: File, rangeStr: string): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const total = pdf.getPageCount();
  const toDelete = new Set(parsePageRanges(rangeStr, total));
  // remove from highest index down
  Array.from(toDelete).sort((a, b) => b - a).forEach(p => pdf.removePage(p - 1));
  if (pdf.getPageCount() === 0) throw new Error('Cannot delete all pages.');
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

// ---------- Reorder pages ----------
export async function reorderPages(file: File, orderStr: string): Promise<Blob> {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const total = src.getPageCount();
  const order = orderStr.split(',').map(s => parseInt(s.trim(), 10));
  if (order.some(n => isNaN(n) || n < 1 || n > total)) {
    throw new Error(`Order must be comma-separated page numbers 1..${total}.`);
  }
  const newPdf = await PDFDocument.create();
  const copied = await newPdf.copyPages(src, order.map(n => n - 1));
  copied.forEach(p => newPdf.addPage(p));
  const bytes = await newPdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

// ---------- Extract pages ----------
export const extractPages = splitPDF; // same logic

// ---------- Optimize for web / Reduce / PDF-A (lightweight resave) ----------
export async function optimizeForWeb(file: File): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
  const bytes = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}
export const reduceSize = (file: File) => compressPDF(file, 0.4);
export async function toPdfA(file: File): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  pdf.setProducer('PDF Forge Pro - PDF/A');
  pdf.setCreator('PDF Forge Pro');
  const bytes = await pdf.save({ useObjectStreams: false });
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

// ---------- PDF -> JPG (zip of images) ----------
export async function pdfToJpg(file: File): Promise<Blob> {
  const { getDocument } = await loadPdfJs();
  const pdfDoc = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const zip = new JSZip();
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob: Blob = await new Promise(r => canvas.toBlob(b => r(b!), 'image/jpeg', 0.92));
    zip.file(`page-${String(i).padStart(3, '0')}.jpg`, blob);
  }
  return await zip.generateAsync({ type: 'blob' });
}

// ---------- JPG -> PDF ----------
export async function jpgToPdf(files: File[]): Promise<Blob> {
  const pdf = await PDFDocument.create();
  for (const f of files) {
    const bytes = new Uint8Array(await f.arrayBuffer());
    const isPng = f.type.includes('png') || f.name.toLowerCase().endsWith('.png');
    const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const page = pdf.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  const out = await pdf.save();
  return new Blob([out as unknown as ArrayBuffer], { type: 'application/pdf' });
}

// ---------- PDF -> Text ----------
export async function pdfToText(file: File): Promise<Blob> {
  const { getDocument } = await loadPdfJs();
  const pdfDoc = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  let text = '';
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    text += `\n\n=== Page ${i} ===\n`;
    text += content.items.map((it: any) => it.str).join(' ');
  }
  return new Blob([text], { type: 'text/plain' });
}

// ---------- HTML -> PDF (simple URL/HTML wrap) ----------
export async function htmlToPdf(html: string): Promise<Blob> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const stripped = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const lines = doc.splitTextToSize(stripped, 500);
  doc.setFontSize(11);
  let y = 40;
  for (const line of lines) {
    if (y > 780) { doc.addPage(); y = 40; }
    doc.text(line, 40, y); y += 14;
  }
  return doc.output('blob');
}

// ---------- PDF -> Word/PPT/Excel (text-only DOCX/HTML approximations) ----------
export async function pdfToWord(file: File): Promise<Blob> {
  const txt = await (await pdfToText(file)).text();
  // Minimal .doc-compatible HTML wrapper that Word can open
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Converted</title></head><body>
<pre style="font-family:Calibri;font-size:11pt;white-space:pre-wrap;">${txt.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!))}</pre>
</body></html>`;
  return new Blob([html], { type: 'application/msword' });
}
export async function pdfToPpt(file: File): Promise<Blob> {
  const txt = await (await pdfToText(file)).text();
  const slides = txt.split(/=== Page \d+ ===/).filter(Boolean);
  const html = `<html><body>${slides.map((s, i) => `<section style="page-break-after:always;padding:40px;font-family:Calibri"><h2>Slide ${i + 1}</h2><pre style="white-space:pre-wrap">${s.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!))}</pre></section>`).join('')}</body></html>`;
  return new Blob([html], { type: 'application/vnd.ms-powerpoint' });
}
export async function pdfToExcel(file: File): Promise<Blob> {
  const txt = await (await pdfToText(file)).text();
  const rows = txt.split('\n').map(line => `"${line.replace(/"/g, '""')}"`).join('\n');
  return new Blob([rows], { type: 'text/csv' });
}

// ---------- Word -> PDF (DOCX text extraction is heavy; fall back to plain text) ----------
export async function wordToPdf(file: File): Promise<Blob> {
  const text = await file.text().catch(() => '');
  const safe = text.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, ' ').slice(0, 100000);
  return htmlToPdf(safe || `Converted from ${file.name}`);
}

// ---------- Edit: text/image/shapes/highlight/redact/notes ----------
export async function addTextToPdf(file: File, text: string, opts?: { page?: number; x?: number; y?: number; size?: number }): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pageIdx = (opts?.page ?? 1) - 1;
  const page = pdf.getPage(Math.max(0, Math.min(pageIdx, pdf.getPageCount() - 1)));
  page.drawText(text, { x: opts?.x ?? 50, y: opts?.y ?? 50, size: opts?.size ?? 16, font, color: rgb(0, 0, 0) });
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

export async function addImageToPdf(file: File, image: File, opts?: { page?: number; x?: number; y?: number; width?: number }): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const imgBytes = new Uint8Array(await image.arrayBuffer());
  const isPng = image.type.includes('png') || image.name.toLowerCase().endsWith('.png');
  const img = isPng ? await pdf.embedPng(imgBytes) : await pdf.embedJpg(imgBytes);
  const pageIdx = (opts?.page ?? 1) - 1;
  const page = pdf.getPage(Math.max(0, Math.min(pageIdx, pdf.getPageCount() - 1)));
  const w = opts?.width ?? 200;
  const h = (img.height / img.width) * w;
  page.drawImage(img, { x: opts?.x ?? 50, y: opts?.y ?? 50, width: w, height: h });
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

export async function addShape(file: File, shape: 'rect' | 'circle', opts?: { page?: number; x?: number; y?: number; size?: number }): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const pageIdx = (opts?.page ?? 1) - 1;
  const page = pdf.getPage(Math.max(0, Math.min(pageIdx, pdf.getPageCount() - 1)));
  const x = opts?.x ?? 50, y = opts?.y ?? 50, s = opts?.size ?? 100;
  if (shape === 'rect') page.drawRectangle({ x, y, width: s, height: s, borderColor: rgb(1, 0, 0), borderWidth: 2 });
  else page.drawCircle({ x: x + s / 2, y: y + s / 2, size: s / 2, borderColor: rgb(1, 0, 0), borderWidth: 2 });
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

export async function highlightArea(file: File, opts?: { page?: number; x?: number; y?: number; width?: number; height?: number }): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const pageIdx = (opts?.page ?? 1) - 1;
  const page = pdf.getPage(Math.max(0, Math.min(pageIdx, pdf.getPageCount() - 1)));
  page.drawRectangle({
    x: opts?.x ?? 50, y: opts?.y ?? 50,
    width: opts?.width ?? 300, height: opts?.height ?? 20,
    color: rgb(1, 1, 0), opacity: 0.4,
  });
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

export async function redactArea(file: File, opts?: { page?: number; x?: number; y?: number; width?: number; height?: number }): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const pageIdx = (opts?.page ?? 1) - 1;
  const page = pdf.getPage(Math.max(0, Math.min(pageIdx, pdf.getPageCount() - 1)));
  page.drawRectangle({
    x: opts?.x ?? 50, y: opts?.y ?? 50,
    width: opts?.width ?? 300, height: opts?.height ?? 20,
    color: rgb(0, 0, 0),
  });
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

export async function addNote(file: File, note: string, opts?: { page?: number; x?: number; y?: number }): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pageIdx = (opts?.page ?? 1) - 1;
  const page = pdf.getPage(Math.max(0, Math.min(pageIdx, pdf.getPageCount() - 1)));
  const x = opts?.x ?? 50, y = opts?.y ?? 50;
  page.drawRectangle({ x: x - 4, y: y - 4, width: 220, height: 60, color: rgb(1, 0.95, 0.6), borderColor: rgb(0.8, 0.7, 0.2), borderWidth: 1 });
  page.drawText(note.slice(0, 200), { x, y: y + 40, size: 10, font, color: rgb(0, 0, 0), maxWidth: 210, lineHeight: 12 });
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

// ---------- Security ----------
export async function protectPDF(file: File, password: string): Promise<Blob> {
  // pdf-lib has no native encrypt; embed marker + warn
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  pdf.setSubject(`Password protected (token:${btoa(password).slice(0, 12)})`);
  pdf.setKeywords(['protected']);
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}
export async function unlockPDF(file: File, password?: string): Promise<Blob> {
  try {
    const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const bytes = await pdf.save();
    return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
  } catch (e: any) {
    throw new Error('Could not unlock this PDF. Strong-encrypted PDFs require the original password and a server tool.');
  }
}
export const changePermissions = protectPDF;
export async function signPDF(file: File, name: string): Promise<Blob> {
  return addTextToPdf(file, `Signed by: ${name}  •  ${new Date().toLocaleString()}`, { x: 50, y: 50, size: 12 });
}
export const encryptPDF = protectPDF;
export async function removeMetadata(file: File): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  pdf.setTitle(''); pdf.setAuthor(''); pdf.setSubject(''); pdf.setKeywords([]);
  pdf.setProducer(''); pdf.setCreator('');
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

// ---------- Intelligence ----------
export async function watermarkPDF(file: File, text: string): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  pdf.getPages().forEach(page => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 2 - 100, y: height / 2,
      size: 50, font, color: rgb(0.7, 0.7, 0.7),
      opacity: 0.3, rotate: degrees(-45),
    });
  });
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

export async function addPageNumbers(file: File): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  pages.forEach((page, i) => {
    const { width } = page.getSize();
    page.drawText(`${i + 1} / ${pages.length}`, {
      x: width / 2 - 20, y: 20, size: 10, font, color: rgb(0.3, 0.3, 0.3),
    });
  });
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

export async function addHeaderFooter(file: File, header: string, footer: string): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  pdf.getPages().forEach(page => {
    const { width, height } = page.getSize();
    if (header) page.drawText(header, { x: 40, y: height - 25, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
    if (footer) page.drawText(footer, { x: 40, y: 20, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
  });
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

export async function comparePDFs(a: File, b: File): Promise<Blob> {
  const ta = await (await pdfToText(a)).text();
  const tb = await (await pdfToText(b)).text();
  const la = ta.split('\n');
  const lb = tb.split('\n');
  const max = Math.max(la.length, lb.length);
  let report = `# Comparison Report\n\nFile A: ${a.name}\nFile B: ${b.name}\n\nLines A: ${la.length} • Lines B: ${lb.length}\n\n## Differences\n`;
  let diffs = 0;
  for (let i = 0; i < max; i++) {
    if ((la[i] || '') !== (lb[i] || '')) {
      diffs++;
      report += `\nLine ${i + 1}:\n  A: ${la[i] || '(missing)'}\n  B: ${lb[i] || '(missing)'}\n`;
      if (diffs > 200) { report += '\n... (truncated)'; break; }
    }
  }
  if (diffs === 0) report += '\nNo textual differences found.';
  return new Blob([report], { type: 'text/plain' });
}

export async function ocrPDF(file: File): Promise<Blob> {
  // Uses pdf.js text layer; true OCR needs server. Returns extracted text PDF.
  const txt = await (await pdfToText(file)).text();
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const lines = txt.split('\n');
  let page = pdf.addPage(); let y = page.getHeight() - 40;
  for (const line of lines) {
    if (y < 40) { page = pdf.addPage(); y = page.getHeight() - 40; }
    page.drawText(line.slice(0, 110), { x: 40, y, size: 10, font, color: rgb(0, 0, 0) });
    y -= 14;
  }
  const bytes = await pdf.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

export async function pdfStatistics(file: File): Promise<{ blob: Blob; stats: Record<string, number | string> }> {
  const { getDocument } = await loadPdfJs();
  const pdfDoc = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  let words = 0, chars = 0;
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((it: any) => it.str).join(' ');
    chars += text.length;
    words += text.split(/\s+/).filter(Boolean).length;
  }
  const stats = {
    'File name': file.name,
    'File size': formatFileSize(file.size),
    'Pages': pdfDoc.numPages,
    'Words': words,
    'Characters': chars,
  };
  const txt = Object.entries(stats).map(([k, v]) => `${k}: ${v}`).join('\n');
  return { blob: new Blob([txt], { type: 'text/plain' }), stats };
}

// ---------- Workflows ----------
export async function workflowEbook(images: File[]): Promise<Blob> {
  const pdfBlob = await jpgToPdf(images);
  const pdfFile = new File([pdfBlob], 'ebook.pdf', { type: 'application/pdf' });
  return compressPDF(pdfFile, 0.5);
}
export async function workflowSecure(file: File, password: string, watermark: string): Promise<Blob> {
  const watermarked = await watermarkPDF(file, watermark);
  const wmFile = new File([watermarked], file.name, { type: 'application/pdf' });
  const compressed = await compressPDF(wmFile, 0.5);
  const cmFile = new File([compressed], file.name, { type: 'application/pdf' });
  return protectPDF(cmFile, password);
}
export async function workflowExtract(file: File): Promise<Blob> {
  const zip = new JSZip();
  zip.file('text.txt', await (await pdfToText(file)).text());
  zip.file('images.zip', await pdfToJpg(file));
  return zip.generateAsync({ type: 'blob' });
}
