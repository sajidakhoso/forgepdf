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
import { PDFToWord, WordToPDF } from "./pages/ConvertPages";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ComingSoon from "./pages/ComingSoon";

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
            <Route path="/merge" element={<MergePDF />} />
            <Route path="/split" element={<SplitPDF />} />
            <Route path="/compress" element={<CompressPDF />} />
            <Route path="/pdf-to-word" element={<PDFToWord />} />
            <Route path="/word-to-pdf" element={<WordToPDF />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* All other tool routes → Coming Soon */}
            {[
              '/pdf-to-ppt', '/pdf-to-excel', '/pdf-to-jpg', '/jpg-to-pdf',
              '/pdf-to-text', '/html-to-pdf', '/rotate', '/delete-pages',
              '/reorder-pages', '/extract-pages', '/optimize-web', '/reduce-size',
              '/pdf-to-pdfa', '/add-text', '/add-image', '/add-shapes',
              '/highlight', '/redact', '/add-notes', '/unlock', '/protect',
              '/permissions', '/sign', '/encrypt', '/remove-metadata',
              '/watermark', '/page-numbers', '/header-footer', '/compare',
              '/ocr', '/statistics', '/workflow-ebook', '/workflow-secure',
              '/workflow-extract',
            ].map((p) => (
              <Route key={p} path={p} element={<ComingSoon />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
