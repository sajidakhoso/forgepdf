import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Scissors, Minimize2, FileOutput, FileInput } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';

const tools = [
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into one document',
    icon: Layers,
    colorClass: 'text-tool-merge',
    bgClass: 'bg-tool-merge-light',
    path: '/merge',
  },
  {
    title: 'Split PDF',
    description: 'Extract pages from your PDF file',
    icon: Scissors,
    colorClass: 'text-tool-split',
    bgClass: 'bg-tool-split-light',
    path: '/split',
  },
  {
    title: 'Compress PDF',
    description: 'Reduce your PDF file size',
    icon: Minimize2,
    colorClass: 'text-tool-compress',
    bgClass: 'bg-tool-compress-light',
    path: '/compress',
  },
  {
    title: 'PDF to Word',
    description: 'Convert PDF to editable Word files',
    icon: FileOutput,
    colorClass: 'text-tool-pdf-word',
    bgClass: 'bg-tool-pdf-word-light',
    path: '/pdf-to-word',
  },
  {
    title: 'Word to PDF',
    description: 'Convert Word documents to PDF',
    icon: FileInput,
    colorClass: 'text-tool-word-pdf',
    bgClass: 'bg-tool-word-pdf-light',
    path: '/word-to-pdf',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-16 md:py-24 text-center max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold tracking-tight"
          >
            Every tool you need to work with PDFs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Merge, split, compress, and convert your documents — fast, free, and right in your browser.
          </motion.p>
        </section>

        <section className="container pb-20 max-w-4xl">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {tools.map((tool) => (
              <motion.div key={tool.path} variants={item}>
                <ToolCard {...tool} onClick={() => navigate(tool.path)} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
