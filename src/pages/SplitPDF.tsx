import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import ProcessingButton from '@/components/ProcessingButton';
import { splitPDF } from '@/lib/pdf-tools';
import { Input } from '@/components/ui/input';

const SplitPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [pageRange, setPageRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSplit = async () => {
    if (files.length === 0) { setError('Please upload a PDF file.'); return; }
    if (!pageRange.trim()) { setError('Please enter page ranges.'); return; }
    setLoading(true); setError(null); setDone(false);
    try {
      await splitPDF(files[0], pageRange);
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Failed to split PDF.');
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
          <h1 className="font-display text-3xl font-bold mb-2">Split PDF</h1>
          <p className="text-muted-foreground mb-8">Extract specific pages from a PDF file.</p>
          <FileUpload accept=".pdf" files={files} onFilesChange={setFiles} label="Drop your PDF file here" />
          <div className="mt-6">
            <label className="text-sm font-medium mb-2 block">Page ranges</label>
            <Input
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="e.g. 1-3, 5, 7-10"
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate ranges with commas</p>
          </div>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          {done && <p className="mt-4 text-sm text-tool-compress font-medium">✓ Download started!</p>}
          <div className="mt-6">
            <ProcessingButton onClick={handleSplit} loading={loading} disabled={files.length === 0}>
              Split PDF
            </ProcessingButton>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SplitPDF;
