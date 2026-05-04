import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Loader2, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const SUPPORTED_EXTENSIONS = '.pdf,.doc,.docx,.txt,.rtf,.md';

interface AnalysisResult {
  summary: string[];
  highlights: string[];
  topics: string[];
}

const AISummary = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (user) {
      supabase.from('tool_usage_history').insert({
        user_id: user.id,
        tool_name: 'AI Summary',
        tool_path: '/ai-summary',
      }).then(() => {});
    }
  }, [user]);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const texts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      texts.push(content.items.map((item: any) => item.str).join(' '));
    }
    return texts.join('\n');
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const extractTextFromPlain = async (file: File): Promise<string> => {
    return await file.text();
  };

  const extractText = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'pdf':
        return extractTextFromPdf(file);
      case 'docx':
        return extractTextFromDocx(file);
      case 'doc':
        toast.info('Legacy .doc format detected — for best results, save as .docx first.');
        return extractTextFromPlain(file);
      case 'txt':
      case 'md':
      case 'rtf':
        return extractTextFromPlain(file);
      default:
        throw new Error(`Unsupported file format: .${ext}`);
    }
  };

  const handleAnalyze = async () => {
    if (!files.length) {
      toast.error('Please upload a document first.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const text = await extractText(files[0]);
      if (!text.trim()) {
        toast.error('Could not extract text from this file. It may be scanned or image-based.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('analyze-pdf', {
        body: { text },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as AnalysisResult);
      toast.success('Analysis complete!');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to tools
        </Link>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-accent" />
            <h1 className="font-display text-3xl font-bold">AI Summary & Highlights</h1>
          </div>
          <p className="text-muted-foreground mb-8">Upload a PDF, DOCX, TXT, or other document and get an AI-powered summary, key highlights, and topic extraction.</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Upload + Trigger */}
            <div className="space-y-6">
              <FileUpload accept={SUPPORTED_EXTENSIONS} multiple={false} files={files} onFilesChange={setFiles} label="Drop your document here (PDF, DOCX, TXT, MD)" />

              <Button
                onClick={handleAnalyze}
                disabled={loading || !files.length}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base py-3 h-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Summary
                  </>
                )}
              </Button>
            </div>

            {/* Right: Results sidebar */}
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center rounded-lg border border-border bg-card p-12"
                >
                  <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
                    <p className="text-sm text-muted-foreground">Analyzing your document…</p>
                  </div>
                </motion.div>
              )}

              {!loading && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-border bg-card overflow-hidden"
                >
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="w-full rounded-none border-b border-border bg-muted/50">
                      <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
                      <TabsTrigger value="highlights" className="flex-1">Highlights</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
                      {result.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {result.topics.map((topic, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent font-medium">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                      <ul className="space-y-2.5">
                        {result.summary.map((point, i) => (
                          <li key={i} className="flex gap-2 text-sm leading-relaxed">
                            <span className="text-accent mt-1 shrink-0">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="highlights" className="p-5 space-y-3 max-h-[500px] overflow-y-auto">
                      {result.highlights.map((point, i) => (
                        <div key={i} className="flex gap-3 text-sm leading-relaxed p-3 rounded-md bg-muted/40">
                          <span className="text-accent font-bold shrink-0">{i + 1}.</span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}

              {!loading && !result && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12"
                >
                  <div className="text-center space-y-2 text-muted-foreground">
                    <Upload className="h-8 w-8 mx-auto opacity-40" />
                    <p className="text-sm">Upload a document and click "AI Summary" to see results here.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default AISummary;
