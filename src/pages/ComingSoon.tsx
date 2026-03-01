import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Construction } from 'lucide-react';
import { motion } from 'framer-motion';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="mx-auto mb-6 inline-flex rounded-xl bg-accent/10 p-4">
            <Construction className="h-10 w-10 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Coming Soon</h1>
          <p className="text-muted-foreground mb-6">
            This tool is under development. We're working hard to bring it to you soon!
          </p>
          <Button onClick={() => navigate('/')}>Back to Tools</Button>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ComingSoon;
