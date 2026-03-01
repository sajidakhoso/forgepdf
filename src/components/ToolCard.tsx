import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  onClick: () => void;
}

const ToolCard = ({ title, description, icon: Icon, colorClass, bgClass, onClick }: ToolCardProps) => {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative w-full rounded-xl border border-border bg-card p-6 text-left transition-shadow hover:shadow-lg`}
    >
      <div className={`mb-4 inline-flex rounded-lg p-3 ${bgClass}`}>
        <Icon className={`h-6 w-6 ${colorClass}`} />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </motion.button>
  );
};

export default ToolCard;
