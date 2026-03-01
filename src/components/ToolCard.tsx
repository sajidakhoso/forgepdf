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
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative w-full rounded-xl glass p-4 md:p-6 text-left transition-shadow hover:shadow-xl active:shadow-md"
    >
      <div className={`mb-3 md:mb-4 inline-flex rounded-lg p-2.5 md:p-3 ${bgClass}`}>
        <Icon className={`h-5 w-5 md:h-6 md:w-6 ${colorClass}`} />
      </div>
      <h3 className="font-display text-base md:text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-muted-foreground line-clamp-2">{description}</p>
    </motion.button>
  );
};

export default ToolCard;
