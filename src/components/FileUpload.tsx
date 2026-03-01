import { useCallback, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatFileSize, MAX_FILE_SIZE } from '@/lib/pdf-tools';

interface FileUploadProps {
  accept: string;
  multiple?: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
  label?: string;
}

const FileUpload = ({ accept, multiple = false, files, onFilesChange, label }: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (newFiles: FileList | File[]) => {
    const valid: File[] = [];
    for (const file of Array.from(newFiles)) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} exceeds 50MB limit`);
        return null;
      }
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const acceptedExts = accept.split(',').map(a => a.trim());
      if (!acceptedExts.some(a => ext === a || file.type.includes(a.replace('.', '')))) {
        setError(`${file.name} is not a supported file type`);
        return null;
      }
      valid.push(file);
    }
    setError(null);
    return valid;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const validated = validateFiles(e.dataTransfer.files);
    if (validated) {
      onFilesChange(multiple ? [...files, ...validated] : validated.slice(0, 1));
    }
  }, [files, multiple, onFilesChange, accept]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validated = validateFiles(e.target.files);
      if (validated) {
        onFilesChange(multiple ? [...files, ...validated] : validated.slice(0, 1));
      }
    }
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 md:p-12 text-center transition-all cursor-pointer
          ${dragOver ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-border hover:border-muted-foreground/40'}
        `}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
        <Upload className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
        <p className="text-lg font-medium text-foreground">
          {label || 'Drop your files here'}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          or click to browse · Max 50MB per file
        </p>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file, i) => (
              <motion.div
                key={`${file.name}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between rounded-lg bg-card border border-border p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="p-1 rounded-md hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
