import { useState } from 'react';
import { ArrowLeft, Download, Upload, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED = ['.ppt', '.pptx'];

const PptToPdf = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [progress, setProgress] = useState('');

  const validateFile = (f: File): string | null => {
    const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED.includes(ext)) return 'Please upload a .ppt or .pptx file.';
    if (f.size > MAX_SIZE) return 'File exceeds the 50MB size limit.';
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      toast.error(err);
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      toast.error(err);
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setProgress('Uploading file…');
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      setProgress('Converting to PDF…');

      const { data, error } = await supabase.functions.invoke('ppt-to-pdf', {
        body: { fileName: file.name, fileData: base64 },
      });

      if (error) throw new Error(error.message || 'Conversion failed');
      if (!data?.pdfData) throw new Error('No PDF data returned');

      const binaryStr = atob(data.pdfData);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'application/pdf' });

      setResult(blob);
      toast.success('Conversion complete!');

      // Log usage
      if (user) {
        supabase.from('tool_usage_history').insert({
          user_id: user.id,
          tool_name: 'PPT to PDF',
          tool_path: '/ppt-to-pdf',
        }).then(() => {});
      }
    } catch (err: any) {
      toast.error(err?.message || 'Conversion failed. Please try again.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  const outputName = file
    ? file.name.replace(/\.(pptx?|PPTX?)$/, '.pdf')
    : 'converted.pdf';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8 md:py-12 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to tools
        </Link>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-2">PPT to PDF</h1>
          <p className="text-muted-foreground mb-8">Convert PowerPoint presentations (.ppt, .pptx) to PDF format.</p>

          {/* Drop zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center transition-colors hover:border-primary/50"
          >
            <input
              type="file"
              accept=".ppt,.pptx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Drop your PowerPoint file here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Supports .ppt and .pptx (max 50MB)</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleConvert} disabled={!file || loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {progress}
                </>
              ) : (
                'Convert to PDF'
              )}
            </Button>
            {result && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Button variant="default" onClick={() => saveAs(result, outputName)}>
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PptToPdf;
