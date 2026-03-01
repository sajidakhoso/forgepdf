import { motion } from 'framer-motion';

export type ToolCategory = 'all' | 'workflows' | 'organize' | 'optimize' | 'convert' | 'edit' | 'security' | 'intelligence';

interface CategoryBarProps {
  active: ToolCategory;
  onChange: (cat: ToolCategory) => void;
}

const categories: { id: ToolCategory; label: string; gradient: string }[] = [
  { id: 'all', label: 'All', gradient: 'from-primary to-primary' },
  { id: 'workflows', label: 'Workflows', gradient: 'from-[hsl(250,70%,56%)] to-[hsl(280,65%,55%)]' },
  { id: 'organize', label: 'Organize PDF', gradient: 'from-[hsl(250,70%,56%)] to-[hsl(280,65%,55%)]' },
  { id: 'optimize', label: 'Optimize PDF', gradient: 'from-[hsl(330,80%,60%)] to-[hsl(0,84%,60%)]' },
  { id: 'convert', label: 'Convert PDF', gradient: 'from-[hsl(200,95%,60%)] to-[hsl(180,95%,55%)]' },
  { id: 'edit', label: 'Edit PDF', gradient: 'from-[hsl(330,80%,60%)] to-[hsl(45,95%,50%)]' },
  { id: 'security', label: 'PDF Security', gradient: 'from-[hsl(160,65%,42%)] to-[hsl(170,95%,55%)]' },
  { id: 'intelligence', label: 'PDF Intelligence', gradient: 'from-[hsl(180,80%,50%)] to-[hsl(260,70%,30%)]' },
];

const CategoryBar = ({ active, onChange }: CategoryBarProps) => (
  <div className="relative overflow-x-auto scrollbar-none">
    <div className="flex gap-1 min-w-max px-1 py-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            active === cat.id
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {cat.label}
          {active === cat.id && (
            <motion.div
              layoutId="category-underline"
              className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r ${cat.gradient}`}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  </div>
);

export default CategoryBar;
