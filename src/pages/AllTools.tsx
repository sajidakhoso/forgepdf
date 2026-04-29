import { useState } from 'react';
import ToolPage from '@/components/ToolPage';
import {
  rotatePDF, deletePages, reorderPages, extractPages,
  optimizeForWeb, reduceSize, toPdfA,
  pdfToJpg, jpgToPdf, pdfToText, htmlToPdf,
  pdfToWord, pdfToPpt, pdfToExcel, wordToPdf,
  addTextToPdf, addImageToPdf, addShape, highlightArea, redactArea, addNote,
  protectPDF, unlockPDF, changePermissions, signPDF, encryptPDF, removeMetadata,
  watermarkPDF, addPageNumbers, addHeaderFooter, comparePDFs, ocrPDF, pdfStatistics,
  workflowEbook, workflowSecure, workflowExtract,
} from '@/lib/pdf-tools';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// ---------- Organize ----------
export const RotatePage = () => {
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  return (
    <ToolPage
      title="Rotate PDF" description="Rotate every page in your PDF by 90°, 180°, or 270°."
      buttonLabel="Rotate PDF"
      outputName={(f) => `rotated_${f[0]?.name || 'file.pdf'}`}
      process={(f) => rotatePDF(f[0], angle)}
      controls={
        <div className="rounded-lg bg-card border border-border p-4">
          <p className="text-sm font-medium mb-2">Rotation angle</p>
          <div className="flex gap-2">
            {[90, 180, 270].map(a => (
              <Button key={a} variant={angle === a ? 'default' : 'outline'} size="sm" onClick={() => setAngle(a as any)}>
                {a}°
              </Button>
            ))}
          </div>
        </div>
      }
    />
  );
};

export const DeletePagesPage = () => {
  const [range, setRange] = useState('');
  return (
    <ToolPage
      title="Delete Pages" description="Remove specific pages from your PDF document."
      buttonLabel="Delete Pages"
      outputName={(f) => `trimmed_${f[0]?.name || 'file.pdf'}`}
      process={(f) => deletePages(f[0], range)}
      controls={
        <div>
          <label className="text-sm font-medium mb-2 block">Pages to delete</label>
          <Input value={range} onChange={(e) => setRange(e.target.value)} placeholder="e.g. 2, 4-6" className="max-w-xs" />
        </div>
      }
    />
  );
};

export const ReorderPagesPage = () => {
  const [order, setOrder] = useState('');
  return (
    <ToolPage
      title="Reorder Pages" description="Rearrange pages by entering a new order."
      buttonLabel="Reorder PDF"
      outputName={(f) => `reordered_${f[0]?.name || 'file.pdf'}`}
      process={(f) => reorderPages(f[0], order)}
      controls={
        <div>
          <label className="text-sm font-medium mb-2 block">New page order</label>
          <Input value={order} onChange={(e) => setOrder(e.target.value)} placeholder="e.g. 3,1,2,4" className="max-w-xs" />
          <p className="text-xs text-muted-foreground mt-1">Comma-separated page numbers</p>
        </div>
      }
    />
  );
};

export const ExtractPagesPage = () => {
  const [range, setRange] = useState('');
  return (
    <ToolPage
      title="Extract Pages" description="Extract selected pages as a new PDF file."
      buttonLabel="Extract Pages"
      outputName={(f) => `extracted_${f[0]?.name || 'file.pdf'}`}
      process={async (f) => {
        // we want a Blob, so reuse splitPDF logic via reorderPages-like extraction
        const { PDFDocument } = await import('pdf-lib');
        const { parsePageRanges } = await import('@/lib/pdf-tools');
        const pdf = await PDFDocument.load(await f[0].arrayBuffer());
        const pages = parsePageRanges(range, pdf.getPageCount());
        const newPdf = await PDFDocument.create();
        const copied = await newPdf.copyPages(pdf, pages.map(p => p - 1));
        copied.forEach(p => newPdf.addPage(p));
        const bytes = await newPdf.save();
        return new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
      }}
      controls={
        <div>
          <label className="text-sm font-medium mb-2 block">Pages to extract</label>
          <Input value={range} onChange={(e) => setRange(e.target.value)} placeholder="e.g. 1-3, 5" className="max-w-xs" />
        </div>
      }
    />
  );
};

// ---------- Optimize ----------
export const OptimizeWebPage = () => (
  <ToolPage
    title="Optimize for Web" description="Restructure your PDF for faster web loading."
    buttonLabel="Optimize PDF"
    outputName={(f) => `web_${f[0]?.name || 'file.pdf'}`}
    process={(f) => optimizeForWeb(f[0])}
  />
);
export const ReduceSizePage = () => (
  <ToolPage
    title="Reduce PDF Size" description="Aggressively reduce your PDF file size."
    buttonLabel="Reduce Size"
    outputName={(f) => `reduced_${f[0]?.name || 'file.pdf'}`}
    process={(f) => reduceSize(f[0])}
  />
);
export const PdfToPdfAPage = () => (
  <ToolPage
    title="PDF to PDF/A" description="Convert your PDF to PDF/A archive format."
    buttonLabel="Convert"
    outputName={(f) => `pdfa_${f[0]?.name || 'file.pdf'}`}
    process={(f) => toPdfA(f[0])}
  />
);

// ---------- Convert ----------
export const PdfToJpgPage = () => (
  <ToolPage
    title="PDF to JPG" description="Convert each PDF page to a JPG image (delivered as ZIP)."
    buttonLabel="Convert to JPG"
    outputName={(f) => `${(f[0]?.name || 'file').replace(/\.pdf$/i, '')}_images.zip`}
    process={(f) => pdfToJpg(f[0])}
  />
);
export const JpgToPdfPage = () => (
  <ToolPage
    title="JPG to PDF" description="Combine images into a single PDF document."
    accept="image/jpeg,image/png,.jpg,.jpeg,.png"
    multiple
    uploadLabel="Drop your images here"
    buttonLabel="Create PDF"
    outputName={() => `images.pdf`}
    process={(f) => jpgToPdf(f)}
  />
);
export const PdfToPptPage = () => (
  <ToolPage
    title="PDF to PowerPoint" description="Extract content from PDF into a slide-friendly file."
    buttonLabel="Convert"
    outputName={(f) => `${(f[0]?.name || 'file').replace(/\.pdf$/i, '')}.ppt`}
    process={(f) => pdfToPpt(f[0])}
  />
);
export const PdfToExcelPage = () => (
  <ToolPage
    title="PDF to Excel" description="Extract text from PDF as a CSV (Excel-compatible)."
    buttonLabel="Convert"
    outputName={(f) => `${(f[0]?.name || 'file').replace(/\.pdf$/i, '')}.csv`}
    process={(f) => pdfToExcel(f[0])}
  />
);
export const PdfToTextPage = () => (
  <ToolPage
    title="PDF to Text" description="Extract all selectable text from your PDF."
    buttonLabel="Extract Text"
    outputName={(f) => `${(f[0]?.name || 'file').replace(/\.pdf$/i, '')}.txt`}
    process={(f) => pdfToText(f[0])}
  />
);
export const HtmlToPdfPage = () => {
  const [html, setHtml] = useState('');
  return (
    <ToolPage
      title="HTML to PDF" description="Paste HTML or text content and convert it to PDF."
      hideUpload noFilesNeeded
      buttonLabel="Convert to PDF"
      outputName={() => 'converted.pdf'}
      process={async () => htmlToPdf(html)}
      customRun={() => htmlToPdf(html)}
      controls={
        <Textarea value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<h1>Hello</h1><p>World</p>" rows={8} />
      }
    />
  );
};

// ---------- Edit ----------
export const AddTextPage = () => {
  const [text, setText] = useState('');
  const [page, setPage] = useState(1);
  return (
    <ToolPage
      title="Add Text" description="Insert text on a specific page of your PDF."
      buttonLabel="Add Text"
      outputName={(f) => `edited_${f[0]?.name || 'file.pdf'}`}
      process={(f) => addTextToPdf(f[0], text, { page })}
      controls={
        <>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Text to add" />
          <Input type="number" min={1} value={page} onChange={(e) => setPage(parseInt(e.target.value) || 1)} placeholder="Page" className="max-w-[120px]" />
        </>
      }
    />
  );
};

export const AddImagePage = () => {
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  return (
    <ToolPage
      title="Add Image" description="Insert a JPG/PNG image into your PDF."
      buttonLabel="Add Image"
      outputName={(f) => `edited_${f[0]?.name || 'file.pdf'}`}
      process={(f) => {
        if (!imgFiles[0]) throw new Error('Please choose an image to insert.');
        return addImageToPdf(f[0], imgFiles[0]);
      }}
      controls={
        <div>
          <label className="text-sm font-medium mb-2 block">Image to insert</label>
          <input type="file" accept="image/*" onChange={(e) => setImgFiles(e.target.files ? Array.from(e.target.files) : [])} className="text-sm" />
          {imgFiles[0] && <p className="text-xs text-muted-foreground mt-1">{imgFiles[0].name}</p>}
        </div>
      }
    />
  );
};

export const AddShapesPage = () => {
  const [shape, setShape] = useState<'rect' | 'circle'>('rect');
  return (
    <ToolPage
      title="Add Shapes" description="Draw a rectangle or circle on your PDF."
      buttonLabel="Add Shape"
      outputName={(f) => `shape_${f[0]?.name || 'file.pdf'}`}
      process={(f) => addShape(f[0], shape)}
      controls={
        <div className="flex gap-2">
          <Button variant={shape === 'rect' ? 'default' : 'outline'} size="sm" onClick={() => setShape('rect')}>Rectangle</Button>
          <Button variant={shape === 'circle' ? 'default' : 'outline'} size="sm" onClick={() => setShape('circle')}>Circle</Button>
        </div>
      }
    />
  );
};

export const HighlightPage = () => (
  <ToolPage
    title="Highlight Text" description="Add a yellow highlight box on the first page."
    buttonLabel="Highlight"
    outputName={(f) => `highlighted_${f[0]?.name || 'file.pdf'}`}
    process={(f) => highlightArea(f[0])}
  />
);

export const RedactPage = () => (
  <ToolPage
    title="Redact" description="Add a black redaction box on the first page."
    buttonLabel="Redact"
    outputName={(f) => `redacted_${f[0]?.name || 'file.pdf'}`}
    process={(f) => redactArea(f[0])}
  />
);

export const AddNotesPage = () => {
  const [note, setNote] = useState('');
  return (
    <ToolPage
      title="Add Notes" description="Attach a sticky note to your PDF."
      buttonLabel="Add Note"
      outputName={(f) => `noted_${f[0]?.name || 'file.pdf'}`}
      process={(f) => addNote(f[0], note)}
      controls={<Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Your note…" rows={3} />}
    />
  );
};

// ---------- Security ----------
export const UnlockPage = () => {
  const [pwd, setPwd] = useState('');
  return (
    <ToolPage
      title="Unlock PDF" description="Remove password from a PDF (best-effort)."
      buttonLabel="Unlock"
      outputName={(f) => `unlocked_${f[0]?.name || 'file.pdf'}`}
      process={(f) => unlockPDF(f[0], pwd)}
      controls={<Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password (optional)" className="max-w-xs" />}
    />
  );
};

export const ProtectPage = () => {
  const [pwd, setPwd] = useState('');
  return (
    <ToolPage
      title="Add Password" description="Mark this PDF as password protected."
      buttonLabel="Protect"
      outputName={(f) => `protected_${f[0]?.name || 'file.pdf'}`}
      process={(f) => {
        if (!pwd) throw new Error('Please enter a password.');
        return protectPDF(f[0], pwd);
      }}
      controls={<Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Set a password" className="max-w-xs" />}
    />
  );
};

export const PermissionsPage = () => {
  const [pwd, setPwd] = useState('owner');
  return (
    <ToolPage
      title="Change Permissions" description="Set owner password and restrict permissions."
      buttonLabel="Apply"
      outputName={(f) => `perms_${f[0]?.name || 'file.pdf'}`}
      process={(f) => changePermissions(f[0], pwd)}
      controls={<Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Owner password" className="max-w-xs" />}
    />
  );
};

export const SignPage = () => {
  const [name, setName] = useState('');
  return (
    <ToolPage
      title="Digital Signature" description="Stamp your name and timestamp on the PDF."
      buttonLabel="Sign PDF"
      outputName={(f) => `signed_${f[0]?.name || 'file.pdf'}`}
      process={(f) => signPDF(f[0], name)}
      controls={<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="max-w-xs" />}
    />
  );
};

export const EncryptPage = () => {
  const [pwd, setPwd] = useState('');
  return (
    <ToolPage
      title="Encrypt PDF" description="Apply encryption marker with your secret key."
      buttonLabel="Encrypt"
      outputName={(f) => `encrypted_${f[0]?.name || 'file.pdf'}`}
      process={(f) => {
        if (!pwd) throw new Error('Please enter an encryption key.');
        return encryptPDF(f[0], pwd);
      }}
      controls={<Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Encryption key" className="max-w-xs" />}
    />
  );
};

export const RemoveMetadataPage = () => (
  <ToolPage
    title="Remove Metadata" description="Strip author, title, and other metadata from PDF."
    buttonLabel="Remove Metadata"
    outputName={(f) => `clean_${f[0]?.name || 'file.pdf'}`}
    process={(f) => removeMetadata(f[0])}
  />
);

// ---------- Intelligence ----------
export const WatermarkPage = () => {
  const [text, setText] = useState('CONFIDENTIAL');
  return (
    <ToolPage
      title="Watermark PDF" description="Add a diagonal watermark to every page."
      buttonLabel="Add Watermark"
      outputName={(f) => `watermarked_${f[0]?.name || 'file.pdf'}`}
      process={(f) => watermarkPDF(f[0], text)}
      controls={<Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Watermark text" className="max-w-xs" />}
    />
  );
};

export const PageNumbersPage = () => (
  <ToolPage
    title="Add Page Numbers" description="Number every page (e.g. 1/10) at the bottom."
    buttonLabel="Add Numbers"
    outputName={(f) => `numbered_${f[0]?.name || 'file.pdf'}`}
    process={(f) => addPageNumbers(f[0])}
  />
);

export const HeaderFooterPage = () => {
  const [header, setHeader] = useState('');
  const [footer, setFooter] = useState('');
  return (
    <ToolPage
      title="Add Header & Footer" description="Insert custom header and footer text on every page."
      buttonLabel="Apply"
      outputName={(f) => `hf_${f[0]?.name || 'file.pdf'}`}
      process={(f) => addHeaderFooter(f[0], header, footer)}
      controls={
        <>
          <Input value={header} onChange={(e) => setHeader(e.target.value)} placeholder="Header text" />
          <Input value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="Footer text" />
        </>
      }
    />
  );
};

export const ComparePage = () => (
  <ToolPage
    title="Compare PDFs" description="Compare text content of two PDFs and download the diff report."
    multiple minFiles={2}
    uploadLabel="Drop two PDFs here"
    buttonLabel="Compare"
    outputName={() => 'comparison.txt'}
    process={(f) => comparePDFs(f[0], f[1])}
  />
);

export const OcrPage = () => (
  <ToolPage
    title="OCR PDF" description="Extract searchable text from your PDF (uses embedded text where available)."
    buttonLabel="Run OCR"
    outputName={(f) => `ocr_${f[0]?.name || 'file.pdf'}`}
    process={(f) => ocrPDF(f[0])}
  />
);

export const StatisticsPage = () => {
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  return (
    <ToolPage
      title="PDF Statistics" description="Get word count, page count, and file size."
      buttonLabel="Analyze"
      outputName={(f) => `stats_${(f[0]?.name || 'file').replace(/\.pdf$/i, '')}.txt`}
      process={async (f) => {
        const r = await pdfStatistics(f[0]);
        setStats(r.stats);
        return r.blob;
      }}
      controls={
        stats && (
          <div className="rounded-lg bg-card border border-border p-4 text-sm space-y-1">
            {Object.entries(stats).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{String(v)}</span>
              </div>
            ))}
          </div>
        )
      }
    />
  );
};

// ---------- Workflows ----------
export const WorkflowEbookPage = () => (
  <ToolPage
    title="Create E-Book" description="Combine images into a compressed PDF e-book."
    accept="image/*" multiple
    uploadLabel="Drop your images here"
    buttonLabel="Create E-Book"
    outputName={() => 'ebook.pdf'}
    process={(f) => workflowEbook(f)}
  />
);

export const WorkflowSecurePage = () => {
  const [pwd, setPwd] = useState('');
  const [wm, setWm] = useState('CONFIDENTIAL');
  return (
    <ToolPage
      title="Secure Document" description="Watermark, compress, and password-protect in one click."
      buttonLabel="Secure"
      outputName={(f) => `secure_${f[0]?.name || 'file.pdf'}`}
      process={(f) => {
        if (!pwd) throw new Error('Please enter a password.');
        return workflowSecure(f[0], pwd, wm);
      }}
      controls={
        <>
          <Input value={wm} onChange={(e) => setWm(e.target.value)} placeholder="Watermark text" />
          <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password" />
        </>
      }
    />
  );
};

export const WorkflowExtractPage = () => (
  <ToolPage
    title="Extract Content" description="Extract text and images from a PDF as a ZIP file."
    buttonLabel="Extract"
    outputName={(f) => `${(f[0]?.name || 'file').replace(/\.pdf$/i, '')}_extracted.zip`}
    process={(f) => workflowExtract(f[0])}
  />
);

// ---------- Word -> PDF replaces ConvertPages.WordToPDF ----------
export const WordToPdfPage = () => (
  <ToolPage
    title="Word to PDF" description="Convert a Word/text document to PDF."
    accept=".doc,.docx,.txt"
    uploadLabel="Drop your Word/text file here"
    buttonLabel="Convert"
    outputName={(f) => `${(f[0]?.name || 'file').replace(/\.[^.]+$/, '')}.pdf`}
    process={(f) => wordToPdf(f[0])}
  />
);

export const PdfToWordPage = () => (
  <ToolPage
    title="PDF to Word" description="Convert your PDF into an editable Word document."
    buttonLabel="Convert"
    outputName={(f) => `${(f[0]?.name || 'file').replace(/\.pdf$/i, '')}.doc`}
    process={(f) => pdfToWord(f[0])}
  />
);
