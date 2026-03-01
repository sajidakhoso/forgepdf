import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcessingButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'default' | 'accent';
}

const ProcessingButton = ({ onClick, loading, disabled, children, variant = 'accent' }: ProcessingButtonProps) => (
  <Button
    onClick={onClick}
    disabled={loading || disabled}
    className={`min-w-[160px] font-semibold text-base px-8 py-3 h-auto ${
      variant === 'accent'
        ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-md'
        : ''
    }`}
  >
    {loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processing…
      </>
    ) : (
      children
    )}
  </Button>
);

export default ProcessingButton;
