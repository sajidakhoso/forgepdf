import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, FileText, Zap, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';
import CategoryBar, { type ToolCategory } from '@/components/CategoryBar';
import { tools } from '@/data/tools';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const Index = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [category, setCategory] = useState<ToolCategory>('all');
  const [recentTools, setRecentTools] = useState<{ tool_name: string; tool_path: string; created_at: string }[]>([]);

  useEffect(() => {
    if (user) {
      supabase
        .from('tool_usage_history')
        .select('tool_name, tool_path, created_at')
        .order('created_at', { ascending: false })
        .limit(6)
        .then(({ data }) => {
          if (data) {
            // Deduplicate by tool_path, keep most recent
            const seen = new Set<string>();
            const unique = data.filter(d => {
              if (seen.has(d.tool_path)) return false;
              seen.add(d.tool_path);
              return true;
            });
            setRecentTools(unique.slice(0, 5));
          }
        });
    }
  }, [user]);

  const getDisplayName = () => {
    if (!profile) return null;
    const name = profile.full_name?.trim();
    if (
      !name ||
      name.toLowerCase() === 'user' ||
      name.includes('@') ||
      name === profile.username ||
      /^user\d+/i.test(name) ||
      /^username\d*/i.test(name)
    ) {
      return null;
    }
    return name.split(' ')[0];
  };

  const getGreeting = () => {
    const firstName = getDisplayName();
    const isReturning = recentTools.length > 0;
    if (firstName) {
      return isReturning ? `Welcome back, ${firstName}!` : `Welcome, ${firstName}!`;
    }
    return 'Welcome!';
  };

  const filtered = category === 'all' ? tools : tools.filter((t) => t.category === category);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-12 md:py-28 px-4" style={{ background: 'var(--gradient-hero)' }}>
          <div className="container text-center max-w-3xl relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block mb-3 md:mb-4 px-3 md:px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground"
            >
              ✨ All-in-one PDF toolkit — 100% free
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl md:text-6xl font-bold tracking-tight leading-tight"
            >
              Your PDFs,{' '}
              <span className="gradient-text">Supercharged</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 md:mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto"
            >
              Merge, split, compress, convert & protect — 40+ powerful PDF tools running entirely in your browser.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 shadow-lg w-full sm:w-auto" onClick={() => navigate('/merge')}>
                Get Started <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button size="lg" variant="outline" className="glass w-full sm:w-auto" onClick={() => navigate('/about')}>
                Learn More
              </Button>
            </motion.div>
          </div>
          <div className="absolute top-0 left-1/4 w-48 md:w-72 h-48 md:h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 md:w-72 h-48 md:h-72 bg-accent/10 rounded-full blur-3xl" />
        </section>
        {/* Greeting + Recent Tools for logged-in users */}
        {user && profile && (
          <section className="container py-8 md:py-10 max-w-6xl px-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-display text-xl md:text-2xl font-bold mb-1">
                {getGreeting()} <span className="inline-block">👋</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-4">Welcome back to Forge PDF</p>
            </motion.div>

            {recentTools.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground">Recently Used</h3>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {recentTools.map((rt, i) => {
                    const toolData = tools.find(t => t.path === rt.tool_path);
                    if (!toolData) return null;
                    return (
                      <button
                        key={i}
                        onClick={() => navigate(rt.tool_path)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-border hover:border-primary/30 transition-all shrink-0"
                      >
                        <toolData.icon className={`h-4 w-4 text-tool-${toolData.colorVar}`} />
                        <span className="text-sm font-medium whitespace-nowrap">{rt.tool_name}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </section>
        )}

        {/* Category Bar + Tools Grid */}
        <section id="tools-section" className="container py-10 md:py-16 max-w-6xl px-4">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold text-center mb-2"
          >
            Every PDF tool you need
          </motion.h2>
          <p className="text-muted-foreground text-center mb-4 md:mb-6 text-sm md:text-base">40+ powerful tools, zero installs required</p>

          <div className="mb-6 md:mb-8">
            <CategoryBar active={category} onChange={setCategory} />
          </div>

          <motion.div
            key={category}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((tool) => (
              <motion.div key={tool.path} variants={item}>
                <ToolCard
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  colorClass={`text-tool-${tool.colorVar}`}
                  bgClass={`bg-tool-${tool.colorVar}-light`}
                  onClick={() => navigate(tool.path)}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Stats */}
        <section className="py-10 md:py-14 gradient-primary">
          <div className="container max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="mx-auto h-5 w-5 md:h-6 md:w-6 text-primary-foreground/80 mb-1.5" />
                  <p className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-xs md:text-sm text-primary-foreground/70 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container py-10 md:py-16 max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-2">
              Loved by <span className="gradient-text">thousands</span>
            </h2>
            <p className="text-muted-foreground text-center mb-6 md:mb-10 text-sm md:text-base">See what our users have to say about Forge PDF</p>
            <div className="grid gap-4 md:gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <motion.div key={t.name} whileHover={{ y: -4 }} className="glass rounded-xl p-5 md:p-6 flex flex-col">
                  <div className="flex gap-1 mb-3 md:mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 md:h-4 md:w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-foreground flex-1 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs md:text-sm font-semibold shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="container pb-14 md:pb-20 max-w-2xl text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 md:p-10"
          >
            <h2 className="font-display text-xl md:text-2xl font-bold mb-2">Ready to get started?</h2>
            <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">Create a free account and start working with PDFs today</p>
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 w-full sm:w-auto" onClick={() => navigate('/auth')}>
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
