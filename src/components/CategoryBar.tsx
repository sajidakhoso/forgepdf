export type ToolCategory = 'all' | 'workflows' | 'organize' | 'optimize' | 'convert' | 'edit' | 'security' | 'intelligence';

interface CategoryBarProps {
  active: ToolCategory;
  onChange: (cat: ToolCategory) => void;
}

const categories: { id: ToolCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'organize', label: 'Organize PDF' },
  { id: 'optimize', label: 'Optimize PDF' },
  { id: 'convert', label: 'Convert PDF' },
  { id: 'edit', label: 'Edit PDF' },
  { id: 'security', label: 'PDF Security' },
  { id: 'intelligence', label: 'PDF Intelligence' },
];

const CategoryBar = ({ active, onChange }: CategoryBarProps) => (
  <>
    <style>{`.cat-bar { scrollbar-width: none; -ms-overflow-style: none; } .cat-bar::-webkit-scrollbar { display: none; }`}</style>
    <div
      className="cat-bar overflow-x-auto whitespace-nowrap py-2 px-3 rounded-xl shadow-sm border border-border"
      style={{ background: 'linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)' }}
    >
      <div className="flex gap-1 min-w-max">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`relative inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              active === cat.id
                ? 'text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:scale-[1.02] hover:-translate-y-px'
            }`}
            style={
              active === cat.id
                ? { background: 'linear-gradient(135deg, hsl(250,70%,56%) 0%, hsl(280,65%,55%) 100%)' }
                : undefined
            }
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  </>
);

export default CategoryBar;
