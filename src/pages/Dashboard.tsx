import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { FileText, HardDrive, Clock, Trash2, Download, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';

interface SavedFile {
  id: string;
  file_name: string;
  conversion_type: string;
  file_size: number;
  file_data: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchFiles();
  }, [user]);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('saved_files')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setFiles(data);
    setLoading(false);
  };

  const deleteFile = async (id: string) => {
    const { error } = await supabase.from('saved_files').delete().eq('id', id);
    if (!error) {
      setFiles((f) => f.filter((file) => file.id !== id));
      toast({ title: '🗑️ File deleted' });
    }
  };

  const downloadFile = (file: SavedFile) => {
    if (!file.file_data) return;
    const link = document.createElement('a');
    link.href = file.file_data;
    link.download = file.file_name;
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const totalSize = files.reduce((sum, f) => sum + f.file_size, 0);

  if (authLoading) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl font-bold mb-1">
              Welcome back, <span className="gradient-text">{profile?.username || 'User'}</span>
            </h1>
            <p className="text-muted-foreground mb-8">Manage your saved files and recent activity</p>
          </motion.div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            {[
              { icon: FileText, label: 'Total Files', value: files.length.toString() },
              { icon: HardDrive, label: 'Storage Used', value: formatSize(totalSize) },
              { icon: Clock, label: 'Last Activity', value: files[0] ? format(new Date(files[0].created_at), 'MMM d') : 'None' },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-5"
              >
                <s.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-2xl font-bold font-display">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Files */}
          <h2 className="font-display text-xl font-semibold mb-4">My Files</h2>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading files...</div>
          ) : files.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 glass rounded-xl"
            >
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">No saved files yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Convert a PDF and save it to see it here</p>
              <Button onClick={() => navigate('/')} className="gradient-primary text-primary-foreground border-0">
                Go to Tools
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {files.map((file, i) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.conversion_type} · {formatSize(file.file_size)} · {format(new Date(file.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {file.file_data && (
                      <Button variant="ghost" size="icon" onClick={() => downloadFile(file)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => deleteFile(file.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
