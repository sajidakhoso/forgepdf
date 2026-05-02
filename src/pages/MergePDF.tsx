import { useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import ProcessingButton from '@/components/ProcessingButton';
import { mergePDFs } from '@/lib/pdf-tools';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const MergePDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) { setError('Please upload at least 2 PDF files.'); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const blob = await mergePDFs(files);
      setResult(blob);
    } catch (e: any) {
      setError(e.message || 'Failed to merge PDFs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8 md:py-12 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to tools
        </Link>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-2">Merge PDF</h1>
          <p className="text-muted-foreground mb-8">Combine multiple PDF files into a single document.</p>
          <FileUpload accept=".pdf" multiple files={files} onFilesChange={setFiles} label="Drop your PDF files here" />
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <ProcessingButton onClick={handleMerge} loading={loading} disabled={files.length < 2}>
              Merge PDFs
            </ProcessingButton>
            {result && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <ProcessingButton onClick={() => saveAs(result, 'merged.pdf')} loading={false} variant="default">
                  <Download className="mr-2 h-4 w-4" /> Download
                </ProcessingButton>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default MergePDF;
