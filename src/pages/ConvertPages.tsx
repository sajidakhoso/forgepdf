import { ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ConvertPageProps {
  title: string;
  description: string;
}

const ConvertPage = ({ title, description }: ConvertPageProps) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1 container py-8 md:py-12 max-w-2xl">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to tools
      </Link>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
        <div className="inline-flex rounded-full bg-secondary p-4 mb-6">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-4">{description}</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          This feature requires a backend service with an API key (e.g., CloudConvert). Connect Lovable Cloud to enable server-side document conversion.
        </p>
      </motion.div>
    </main>
    <Footer />
  </div>
);

export const PDFToWord = () => (
  <ConvertPage title="PDF to Word" description="Convert your PDF documents to editable Word files." />
);

export const WordToPDF = () => (
  <ConvertPage title="Word to PDF" description="Convert Word documents to professional PDF files." />
);
