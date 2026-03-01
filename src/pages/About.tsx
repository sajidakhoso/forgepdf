import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Heart } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Privacy First', description: 'Your files never leave your browser. We process everything client-side — zero uploads to external servers.' },
  { icon: Zap, title: 'Lightning Fast', description: 'Built on modern web tech for instant processing. No waiting, no queues, just results.' },
  { icon: Globe, title: 'Accessible Everywhere', description: 'Works on any device with a browser. No downloads, no plugins, no compatibility headaches.' },
  { icon: Heart, title: 'Free & Open', description: 'Core tools are completely free. We believe everyone deserves great PDF tools.' },
];

const About = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      <section className="py-16 md:py-24" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold tracking-tight"
          >
            About <span className="gradient-text">Forge PDF</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            We started Forge PDF because working with PDFs shouldn't require expensive software or trusting random websites with your documents. Our mission is to give everyone fast, private, and powerful PDF tools — right in the browser.
          </motion.p>
        </div>
      </section>

      <section className="container py-16 max-w-4xl">
        <h2 className="font-display text-2xl font-bold text-center mb-10">What we stand for</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="glass rounded-xl p-6"
            >
              <div className="mb-4 inline-flex rounded-lg gradient-primary p-3">
                <v.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container pb-20 max-w-3xl text-center">
        <div className="glass rounded-2xl p-10">
          <h2 className="font-display text-2xl font-bold mb-2">Built by <span className="gradient-text-secondary">Anglowie</span></h2>
          <p className="text-muted-foreground">Crafted with passion and attention to detail. We're committed to making PDF management effortless for everyone.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
