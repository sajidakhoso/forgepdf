import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MergePDF from "./pages/MergePDF";
import SplitPDF from "./pages/SplitPDF";
import CompressPDF from "./pages/CompressPDF";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AISummary from "./pages/AISummary";
import {
  RotatePage, DeletePagesPage, ReorderPagesPage, ExtractPagesPage,
  OptimizeWebPage, ReduceSizePage, PdfToPdfAPage,
  PdfToJpgPage, JpgToPdfPage, PdfToPptPage, PdfToExcelPage, PdfToTextPage, HtmlToPdfPage,
  AddTextPage, AddImagePage, AddShapesPage, HighlightPage, RedactPage, AddNotesPage,
  UnlockPage, ProtectPage, PermissionsPage, SignPage, EncryptPage, RemoveMetadataPage,
  WatermarkPage, PageNumbersPage, HeaderFooterPage, ComparePage, OcrPage, StatisticsPage,
  WorkflowEbookPage, WorkflowSecurePage, WorkflowExtractPage,
  WordToPdfPage, PdfToWordPage,
} from "./pages/AllTools";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Organize */}
              <Route path="/merge" element={<MergePDF />} />
              <Route path="/split" element={<SplitPDF />} />
              <Route path="/rotate" element={<RotatePage />} />
              <Route path="/delete-pages" element={<DeletePagesPage />} />
              <Route path="/reorder-pages" element={<ReorderPagesPage />} />
              <Route path="/extract-pages" element={<ExtractPagesPage />} />

              {/* Optimize */}
              <Route path="/compress" element={<CompressPDF />} />
              <Route path="/optimize-web" element={<OptimizeWebPage />} />
              <Route path="/reduce-size" element={<ReduceSizePage />} />
              <Route path="/pdf-to-pdfa" element={<PdfToPdfAPage />} />

              {/* Convert */}
              <Route path="/pdf-to-word" element={<PdfToWordPage />} />
              <Route path="/word-to-pdf" element={<WordToPdfPage />} />
              <Route path="/pdf-to-jpg" element={<PdfToJpgPage />} />
              <Route path="/jpg-to-pdf" element={<JpgToPdfPage />} />
              <Route path="/pdf-to-ppt" element={<PdfToPptPage />} />
              <Route path="/pdf-to-excel" element={<PdfToExcelPage />} />
              <Route path="/pdf-to-text" element={<PdfToTextPage />} />
              <Route path="/html-to-pdf" element={<HtmlToPdfPage />} />

              {/* Edit */}
              <Route path="/add-text" element={<AddTextPage />} />
              <Route path="/add-image" element={<AddImagePage />} />
              <Route path="/add-shapes" element={<AddShapesPage />} />
              <Route path="/highlight" element={<HighlightPage />} />
              <Route path="/redact" element={<RedactPage />} />
              <Route path="/add-notes" element={<AddNotesPage />} />

              {/* Security */}
              <Route path="/unlock" element={<UnlockPage />} />
              <Route path="/protect" element={<ProtectPage />} />
              <Route path="/permissions" element={<PermissionsPage />} />
              <Route path="/sign" element={<SignPage />} />
              <Route path="/encrypt" element={<EncryptPage />} />
              <Route path="/remove-metadata" element={<RemoveMetadataPage />} />

              {/* Intelligence */}
              <Route path="/watermark" element={<WatermarkPage />} />
              <Route path="/page-numbers" element={<PageNumbersPage />} />
              <Route path="/header-footer" element={<HeaderFooterPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/ocr" element={<OcrPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />

              {/* AI */}
              <Route path="/ai-summary" element={<AISummary />} />

              {/* Workflows */}
              <Route path="/workflow-ebook" element={<WorkflowEbookPage />} />
              <Route path="/workflow-secure" element={<WorkflowSecurePage />} />
              <Route path="/workflow-extract" element={<WorkflowExtractPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
