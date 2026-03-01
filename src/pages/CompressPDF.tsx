import { useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import ProcessingButton from '@/components/ProcessingButton';
import { compressPDF, formatFileSize } from '@/lib/pdf-tools';

const CompressPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; originalSize: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) { setError('Please upload a PDF file.'); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const blob = await compressPDF(files[0]);
      setResult({ blob, originalSize: files[0].size });
    } catch (e: any) {
      setError(e.message || 'Failed to compress PDF.');
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
          <h1 className="font-display text-3xl font-bold mb-2">Compress PDF</h1>
          <p className="text-muted-foreground mb-8">Reduce the file size of your PDF documents.</p>
          <FileUpload accept=".pdf" files={files} onFilesChange={setFiles} label="Drop your PDF file here" />
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-lg bg-card border border-border p-4">
              <p className="text-sm">
                <span className="text-muted-foreground">Original:</span>{' '}
                <span className="font-medium">{formatFileSize(result.originalSize)}</span>
                {' → '}
                <span className="text-muted-foreground">Compressed:</span>{' '}
                <span className="font-medium text-tool-compress">{formatFileSize(result.blob.size)}</span>
              </p>
            </motion.div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <ProcessingButton onClick={handleCompress} loading={loading} disabled={files.length === 0}>
              Compress PDF
            </ProcessingButton>
            {result && (
              <ProcessingButton onClick={() => saveAs(result.blob, `compressed_${files[0].name}`)} loading={false} variant="default">
                <Download className="mr-2 h-4 w-4" /> Download
              </ProcessingButton>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default CompressPDF;
