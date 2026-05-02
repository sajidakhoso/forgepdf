import {
  Layers, Scissors, RotateCw, Trash2, GripVertical, FileOutput,
  Minimize2, Globe, ArrowDownCircle, Archive,
  FileInput, Image, Presentation, Table2, FileText, Code,
  Type, ImagePlus, Shapes, Highlighter, EyeOff, StickyNote,
  Lock, Unlock, ShieldCheck, Pen, KeyRound, FileX,
  Droplets, Hash, AlignLeft, GitCompare, ScanText, BarChart3,
  BookOpen, ShieldAlert, PackageOpen
} from 'lucide-react';
import type { ToolCategory } from '@/components/CategoryBar';
import { LucideIcon } from 'lucide-react';

export interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  colorVar: string;
  path: string;
}

export const tools: Tool[] = [
  // ⭐ Popular Conversion Tools (featured at top)
  { title: 'PDF to Word', description: 'Convert PDF to editable DOCX', icon: FileOutput, category: 'convert', colorVar: 'pdf-word', path: '/pdf-to-word' },
  { title: 'Word to PDF', description: 'Convert Word documents to PDF', icon: FileInput, category: 'convert', colorVar: 'word-pdf', path: '/word-to-pdf' },
  { title: 'PDF to JPG', description: 'Convert pages to JPG images', icon: Image, category: 'convert', colorVar: 'jpg', path: '/pdf-to-jpg' },
  { title: 'JPG to PDF', description: 'Convert images to PDF', icon: FileInput, category: 'convert', colorVar: 'jpg', path: '/jpg-to-pdf' },
  { title: 'PDF to Excel', description: 'Extract tables to spreadsheets', icon: Table2, category: 'convert', colorVar: 'excel', path: '/pdf-to-excel' },

  // Organize PDF
  { title: 'Merge PDF', description: 'Combine multiple PDFs into one', icon: Layers, category: 'organize', colorVar: 'merge', path: '/merge' },
  { title: 'Split PDF', description: 'Separate pages from your PDF', icon: Scissors, category: 'organize', colorVar: 'split', path: '/split' },
  { title: 'Rotate PDF', description: 'Rotate pages 90°, 180°, 270°', icon: RotateCw, category: 'organize', colorVar: 'rotate', path: '/rotate' },
  { title: 'Delete Pages', description: 'Remove specific pages from PDF', icon: Trash2, category: 'organize', colorVar: 'split', path: '/delete-pages' },
  { title: 'Reorder Pages', description: 'Drag & drop page rearrangement', icon: GripVertical, category: 'organize', colorVar: 'merge', path: '/reorder-pages' },
  { title: 'Extract Pages', description: 'Extract selected pages as new PDF', icon: FileOutput, category: 'organize', colorVar: 'rotate', path: '/extract-pages' },

  // Optimize PDF
  { title: 'Compress PDF', description: 'Reduce your PDF file size', icon: Minimize2, category: 'optimize', colorVar: 'compress', path: '/compress' },
  { title: 'Optimize for Web', description: 'Make PDFs web-friendly', icon: Globe, category: 'optimize', colorVar: 'compress', path: '/optimize-web' },
  { title: 'Reduce PDF Size', description: 'Advanced compression options', icon: ArrowDownCircle, category: 'optimize', colorVar: 'compress', path: '/reduce-size' },
  { title: 'PDF to PDF/A', description: 'Convert to archive format', icon: Archive, category: 'optimize', colorVar: 'compress', path: '/pdf-to-pdfa' },

  // Convert PDF (remaining)
  { title: 'PDF to PowerPoint', description: 'Turn PDFs into presentations', icon: Presentation, category: 'convert', colorVar: 'ppt', path: '/pdf-to-ppt' },
  { title: 'PDF to Text', description: 'Extract plain text from PDF', icon: FileText, category: 'convert', colorVar: 'pdf-word', path: '/pdf-to-text' },
  { title: 'HTML to PDF', description: 'Convert web pages to PDF', icon: Code, category: 'convert', colorVar: 'rotate', path: '/html-to-pdf' },

  // Edit PDF
  { title: 'Add Text', description: 'Insert text anywhere on PDF', icon: Type, category: 'edit', colorVar: 'edit', path: '/add-text' },
  { title: 'Add Image', description: 'Insert images and logos', icon: ImagePlus, category: 'edit', colorVar: 'edit', path: '/add-image' },
  { title: 'Add Shapes', description: 'Draw rectangles, circles, arrows', icon: Shapes, category: 'edit', colorVar: 'edit', path: '/add-shapes' },
  { title: 'Highlight Text', description: 'Mark important text sections', icon: Highlighter, category: 'edit', colorVar: 'jpg', path: '/highlight' },
  { title: 'Redact Text', description: 'Remove sensitive information', icon: EyeOff, category: 'edit', colorVar: 'protect', path: '/redact' },
  { title: 'Add Notes', description: 'Attach sticky notes & comments', icon: StickyNote, category: 'edit', colorVar: 'edit', path: '/add-notes' },

  // PDF Security
  { title: 'Unlock PDF', description: 'Remove password protection', icon: Unlock, category: 'security', colorVar: 'protect', path: '/unlock' },
  { title: 'Add Password', description: 'Protect PDF with password', icon: Lock, category: 'security', colorVar: 'protect', path: '/protect' },
  { title: 'Change Permissions', description: 'Set print/copy restrictions', icon: ShieldCheck, category: 'security', colorVar: 'compress', path: '/permissions' },
  { title: 'Digital Signature', description: 'Add digital signature to PDF', icon: Pen, category: 'security', colorVar: 'sign', path: '/sign' },
  { title: 'Encrypt PDF', description: '128-bit AES encryption', icon: KeyRound, category: 'security', colorVar: 'protect', path: '/encrypt' },
  { title: 'Remove Metadata', description: 'Clear author, date & more', icon: FileX, category: 'security', colorVar: 'protect', path: '/remove-metadata' },

  // PDF Intelligence
  { title: 'Watermark PDF', description: 'Add text or image watermark', icon: Droplets, category: 'intelligence', colorVar: 'rotate', path: '/watermark' },
  { title: 'Add Page Numbers', description: 'Number your PDF pages', icon: Hash, category: 'intelligence', colorVar: 'merge', path: '/page-numbers' },
  { title: 'Add Header/Footer', description: 'Insert headers & footers', icon: AlignLeft, category: 'intelligence', colorVar: 'split', path: '/header-footer' },
  { title: 'Compare PDFs', description: 'Show differences between PDFs', icon: GitCompare, category: 'intelligence', colorVar: 'edit', path: '/compare' },
  { title: 'OCR PDF', description: 'Scanned PDF to searchable text', icon: ScanText, category: 'intelligence', colorVar: 'pdf-word', path: '/ocr' },
  { title: 'PDF Statistics', description: 'Count words, pages & more', icon: BarChart3, category: 'intelligence', colorVar: 'excel', path: '/statistics' },

  // Workflows
  { title: 'Create E-Book', description: 'Images → Merge → Compress', icon: BookOpen, category: 'workflows', colorVar: 'merge', path: '/workflow-ebook' },
  { title: 'Secure Document', description: 'Password → Watermark → Compress', icon: ShieldAlert, category: 'workflows', colorVar: 'protect', path: '/workflow-secure' },
  { title: 'Extract Content', description: 'Extract images + text → ZIP', icon: PackageOpen, category: 'workflows', colorVar: 'compress', path: '/workflow-extract' },
];
