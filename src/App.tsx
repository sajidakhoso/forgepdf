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
            <Route path="/pdf-to-ppt" element={<ComingSoon />} />
            <Route path="/pdf-to-excel" element={<ComingSoon />} />
            <Route path="/pdf-to-jpg" element={<ComingSoon />} />
            <Route path="/jpg-to-pdf" element={<ComingSoon />} />
            <Route path="/rotate" element={<ComingSoon />} />
            <Route path="/protect" element={<ComingSoon />} />
            <Route path="/edit" element={<ComingSoon />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
