import { ReactNode, useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import ProcessingButton from '@/components/ProcessingButton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ToolPageProps {
  title: string;
  description: string;
  accept?: string;
  multiple?: boolean;
  minFiles?: number;
  uploadLabel?: string;
  buttonLabel: string;
  outputName: (files: File[]) => string;
  process: (files: File[]) => Promise<Blob>;
  controls?: ReactNode;
  hideUpload?: boolean;
  noFilesNeeded?: boolean;
  customRun?: () => Promise<Blob>;
}

const ToolPage = ({
  title, description, accept = '.pdf', multiple = false, minFiles = 1,
  uploadLabel, buttonLabel, outputName, process, controls,
  hideUpload, noFilesNeeded, customRun,
}: ToolPageProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!noFilesNeeded && files.length < minFiles) {
      setError(`Please upload ${minFiles === 1 ? 'a file' : `at least ${minFiles} files`}.`);
      return;
    }
    setLoading(true); setError(null); setResult(null);
    try {
      const blob = customRun ? await customRun() : await process(files);
      setResult(blob);
    } catch (e: any) {
      setError(e?.message || 'Operation failed.');
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
          <h1 className="font-display text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-8">{description}</p>

          {!hideUpload && (
            <FileUpload
              accept={accept}
              multiple={multiple}
              files={files}
              onFilesChange={setFiles}
              label={uploadLabel || 'Drop your file here'}
            />
          )}

          {controls && <div className="mt-6 space-y-4">{controls}</div>}

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <ProcessingButton
              onClick={handleRun}
              loading={loading}
              disabled={!noFilesNeeded && files.length < minFiles}
            >
              {buttonLabel}
            </ProcessingButton>
            {result && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <ProcessingButton
                  onClick={() => saveAs(result, outputName(files))}
                  loading={false}
                  variant="default"
                >
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

export default ToolPage;
