import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers, Scissors, Minimize2, FileOutput, FileInput,
  Presentation, Table2, Image, RotateCw, ShieldCheck,
  Pen, ArrowRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';
import { Star, Users, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tools = [
  { title: 'Merge PDF', description: 'Combine multiple PDFs into one document', icon: Layers, colorClass: 'text-tool-merge', bgClass: 'bg-tool-merge-light', path: '/merge' },
  { title: 'Split PDF', description: 'Extract pages from your PDF file', icon: Scissors, colorClass: 'text-tool-split', bgClass: 'bg-tool-split-light', path: '/split' },
  { title: 'Compress PDF', description: 'Reduce your PDF file size', icon: Minimize2, colorClass: 'text-tool-compress', bgClass: 'bg-tool-compress-light', path: '/compress' },
  { title: 'PDF to Word', description: 'Convert PDF to editable Word files', icon: FileOutput, colorClass: 'text-tool-pdf-word', bgClass: 'bg-tool-pdf-word-light', path: '/pdf-to-word' },
  { title: 'Word to PDF', description: 'Convert Word documents to PDF', icon: FileInput, colorClass: 'text-tool-word-pdf', bgClass: 'bg-tool-word-pdf-light', path: '/word-to-pdf' },
  { title: 'PDF to PowerPoint', description: 'Turn PDFs into editable presentations', icon: Presentation, colorClass: 'text-tool-ppt', bgClass: 'bg-tool-ppt-light', path: '/pdf-to-ppt' },
  { title: 'PDF to Excel', description: 'Extract PDF tables into spreadsheets', icon: Table2, colorClass: 'text-tool-excel', bgClass: 'bg-tool-excel-light', path: '/pdf-to-excel' },
  { title: 'PDF to JPG', description: 'Convert each page to a JPG image', icon: Image, colorClass: 'text-tool-jpg', bgClass: 'bg-tool-jpg-light', path: '/pdf-to-jpg' },
  { title: 'JPG to PDF', description: 'Convert images to PDF in seconds', icon: FileInput, colorClass: 'text-tool-jpg', bgClass: 'bg-tool-jpg-light', path: '/jpg-to-pdf' },
  { title: 'Rotate PDF', description: 'Rotate pages to the correct orientation', icon: RotateCw, colorClass: 'text-tool-rotate', bgClass: 'bg-tool-rotate-light', path: '/rotate' },
  { title: 'Protect PDF', description: 'Encrypt and password-protect your PDF', icon: ShieldCheck, colorClass: 'text-tool-protect', bgClass: 'bg-tool-protect-light', path: '/protect' },
  { title: 'Edit PDF', description: 'Add text, images, and annotations', icon: Pen, colorClass: 'text-tool-edit', bgClass: 'bg-tool-edit-light', path: '/edit' },
];

const stats = [
  { icon: FileText, value: '2.5M+', label: 'PDFs Processed' },
  { icon: Users, value: '150K+', label: 'Happy Users' },
  { icon: Zap, value: '99.9%', label: 'Uptime' },
  { icon: Star, value: '4.9/5', label: 'User Rating' },
];

const testimonials = [
  { name: 'Sarah Mitchell', role: 'Marketing Director', avatar: 'SM', quote: 'Forge PDF replaced 3 different tools for our team. The merge and compress features alone save us hours every week.', rating: 5 },
  { name: 'James Rodriguez', role: 'Freelance Designer', avatar: 'JR', quote: 'Lightning fast and works right in the browser. No more uploading sensitive client files to random websites.', rating: 5 },
  { name: 'Emily Chen', role: 'Legal Associate', avatar: 'EC', quote: 'The split tool is a game-changer for legal docs. I can extract exactly the pages I need in seconds.', rating: 5 },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-28" style={{ background: 'var(--gradient-hero)' }}>
          <div className="container text-center max-w-3xl relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block mb-4 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground"
            >
              ✨ All-in-one PDF toolkit — 100% free
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight"
            >
              Your PDFs,{' '}
              <span className="gradient-text">Supercharged</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto"
            >
              Merge, split, compress, convert & protect — powerful PDF tools running entirely in your browser. No uploads. No waiting.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-3 justify-center"
            >
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 shadow-lg" onClick={() => navigate('/merge')}>
                Get Started <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button size="lg" variant="outline" className="glass" onClick={() => navigate('/about')}>
                Learn More
              </Button>
            </motion.div>
          </div>
          {/* Decorative blobs */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        </section>

        {/* Tools Grid */}
        <section className="container py-16 max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold text-center mb-2"
          >
            Every PDF tool you need
          </motion.h2>
          <p className="text-muted-foreground text-center mb-10">12 powerful tools, zero installs required</p>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {tools.map((tool) => (
              <motion.div key={tool.path} variants={item}>
                <ToolCard {...tool} onClick={() => navigate(tool.path)} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Stats */}
        <section className="py-14 gradient-primary">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="mx-auto h-6 w-6 text-primary-foreground/80 mb-2" />
                  <p className="font-display text-3xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/70 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container py-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold text-center mb-2">
              Loved by <span className="gradient-text">thousands</span>
            </h2>
            <p className="text-muted-foreground text-center mb-10">
              See what our users have to say about Forge PDF
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <motion.div
                  key={t.name}
                  whileHover={{ y: -4 }}
                  className="glass rounded-xl p-6 flex flex-col"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground flex-1 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="container pb-20 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-10"
          >
            <h2 className="font-display text-2xl font-bold mb-2">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">Create a free account and start working with PDFs today</p>
            <Button size="lg" className="gradient-primary text-primary-foreground border-0" onClick={() => navigate('/auth')}>
              Sign Up Free <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
