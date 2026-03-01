import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function mergePDFs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }
  
  const mergedBytes = await mergedPdf.save();
  return new Blob([mergedBytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

export function parsePageRanges(input: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(',').map(s => s.trim());
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
        throw new Error(`Invalid range: ${part}. Pages must be between 1 and ${totalPages}.`);
      }
      for (let i = start; i <= end; i++) pages.add(i);
    } else {
      const page = Number(part);
      if (isNaN(page) || page < 1 || page > totalPages) {
        throw new Error(`Invalid page: ${part}. Must be between 1 and ${totalPages}.`);
      }
      pages.add(page);
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
}

export async function splitPDF(file: File, pageRangeStr: string): Promise<void> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const totalPages = pdf.getPageCount();
  const pages = parsePageRanges(pageRangeStr, totalPages);
  
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdf, pages.map(p => p - 1));
  copiedPages.forEach(page => newPdf.addPage(page));
  
  const newBytes = await newPdf.save();
  const blob = new Blob([newBytes as unknown as ArrayBuffer], { type: 'application/pdf' });
  
  if (pages.length === totalPages) {
    saveAs(blob, `split_${file.name}`);
  } else {
    const zip = new JSZip();
    zip.file(`extracted_pages.pdf`, newBytes);
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `split_${file.name.replace('.pdf', '')}.zip`);
  }
}

export async function compressPDF(file: File, quality: number = 0.5): Promise<Blob> {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
  GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();

  const bytes = await file.arrayBuffer();
  const pdfDoc = await getDocument({ data: new Uint8Array(bytes) }).promise;
  const numPages = pdfDoc.numPages;

  const newPdf = await PDFDocument.create();
  newPdf.setProducer('Forge PDF');
  newPdf.setCreator('Forge PDF');

  const scale = quality < 0.4 ? 1.0 : quality < 0.7 ? 1.2 : 1.5;
  const jpegQuality = quality;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const jpegDataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
    const jpegBytes = Uint8Array.from(atob(jpegDataUrl.split(',')[1]), c => c.charCodeAt(0));
    const jpegImage = await newPdf.embedJpg(jpegBytes);

    const originalViewport = page.getViewport({ scale: 1 });
    const newPage = newPdf.addPage([originalViewport.width * 0.75, originalViewport.height * 0.75]);
    newPage.drawImage(jpegImage, {
      x: 0,
      y: 0,
      width: newPage.getWidth(),
      height: newPage.getHeight(),
    });
  }

  const compressedBytes = await newPdf.save({ useObjectStreams: true });
  return new Blob([compressedBytes as unknown as ArrayBuffer], { type: 'application/pdf' });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
