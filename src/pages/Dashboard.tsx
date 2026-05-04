import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  FileText, HardDrive, Clock, Trash2, Download, FolderOpen,
  Search, LayoutGrid, List, FolderPlus, Settings, RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

interface SavedFile {
  id: string;
  file_name: string;
  conversion_type: string;
  file_size: number;
  file_data: string | null;
  created_at: string;
}

type DashTab = 'files' | 'trash' | 'settings';
type ViewMode = 'list' | 'grid';

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<DashTab>('files');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
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

  const conversionTypes = ['all', ...new Set(files.map((f) => f.conversion_type))];

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.file_name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || f.conversion_type === filterType;
    return matchesSearch && matchesType;
  });

  if (authLoading) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6 md:py-10">
        <div className="container max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
              {(() => {
                const name = profile?.full_name?.trim();
                const isValid = name && name.toLowerCase() !== 'user' && !name.includes('@') && !/^user(name)?\d*/i.test(name);
                return isValid
                  ? <>Welcome back, <span className="gradient-text">{name.split(' ')[0]}</span> 👋</>
                  : <>Welcome! 👋</>;
              })()}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mb-6 md:mb-8">Manage your saved files and recent activity</p>
          </motion.div>

          {/* Stats */}
          <div className="grid gap-3 grid-cols-3 mb-6 md:mb-8">
            {[
              { icon: FileText, label: 'Total Files', value: files.length.toString() },
              { icon: HardDrive, label: 'Storage Used', value: formatSize(totalSize) },
              { icon: Clock, label: 'Last Activity', value: files[0] ? format(new Date(files[0].created_at), 'MMM d') : 'None' },
            ].map((s) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-3 md:p-5">
                <s.icon className="h-4 w-4 md:h-5 md:w-5 text-primary mb-1.5" />
                <p className="text-lg md:text-2xl font-bold font-display">{s.value}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tab Bar */}
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6 border-b border-border pb-3 overflow-x-auto">
            {([
              { id: 'files' as DashTab, label: 'My Files', icon: FolderOpen },
              { id: 'trash' as DashTab, label: 'Trash', icon: Trash2 },
              { id: 'settings' as DashTab, label: 'Settings', icon: Settings },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 text-xs md:text-sm font-medium pb-1 border-b-2 whitespace-nowrap transition-colors ${
                  tab === t.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <t.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'files' && (
            <>
              {/* Toolbar */}
              <div className="flex flex-col gap-3 mb-4 md:mb-6">
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search files..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-9 md:h-10 text-sm"
                    />
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9 md:h-10 md:w-10" onClick={() => setViewMode('list')}>
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9 md:h-10 md:w-10" onClick={() => setViewMode('grid')}>
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-9 md:h-10 rounded-md border border-input bg-background px-3 text-sm w-full sm:w-auto sm:max-w-[200px]"
                >
                  {conversionTypes.map((t) => (
                    <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Loading files...</div>
              ) : filteredFiles.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 md:py-16 glass rounded-xl px-4">
                  <FolderOpen className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <h3 className="font-display text-base md:text-lg font-semibold mb-2">
                    {search || filterType !== 'all' ? 'No matching files' : 'No saved files yet'}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm mb-4">
                    {search || filterType !== 'all' ? 'Try a different search or filter' : 'Convert a PDF and save it to see it here'}
                  </p>
                  {!search && filterType === 'all' && (
                    <Button onClick={() => navigate('/')} className="gradient-primary text-primary-foreground border-0">
                      Go to Tools
                    </Button>
                  )}
                </motion.div>
              ) : viewMode === 'list' ? (
                <div className="space-y-2 md:space-y-3">
                  {filteredFiles.map((file, i) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="glass rounded-xl p-3 md:p-4 flex items-center gap-3"
                    >
                      <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs md:text-sm truncate">{file.file_name}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          {file.conversion_type} · {formatSize(file.file_size)} · {format(new Date(file.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {file.file_data && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9" onClick={() => downloadFile(file)}>
                            <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9" onClick={() => deleteFile(file.id)}>
                          <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-destructive" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
                  {filteredFiles.map((file, i) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="glass rounded-xl p-4 md:p-5 flex flex-col"
                    >
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg gradient-primary flex items-center justify-center mb-2 md:mb-3">
                        <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                      </div>
                      <p className="font-medium text-xs md:text-sm truncate mb-0.5">{file.file_name}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-4">
                        {file.conversion_type} · {formatSize(file.file_size)}
                      </p>
                      <p className="text-[10px] md:text-xs text-muted-foreground mb-3 md:mb-4">{format(new Date(file.created_at), 'MMM d, yyyy')}</p>
                      <div className="flex gap-1.5 mt-auto">
                        {file.file_data && (
                          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => downloadFile(file)}>
                            <Download className="h-3 w-3 mr-1" /> Download
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => deleteFile(file.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'trash' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 md:py-16 glass rounded-xl px-4">
              <RotateCcw className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="font-display text-base md:text-lg font-semibold mb-2">Trash is empty</h3>
              <p className="text-muted-foreground text-xs md:text-sm">Deleted files will appear here for 30 days</p>
            </motion.div>
          )}

          {tab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-5 md:p-6 max-w-lg">
              <h3 className="font-display text-base md:text-lg font-semibold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs md:text-sm font-medium text-muted-foreground">Username</label>
                  <p className="text-foreground text-sm md:text-base">{profile?.full_name || profile?.username || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground text-sm md:text-base">{profile?.email || user?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-muted-foreground">Storage</label>
                  <p className="text-foreground text-sm md:text-base">{formatSize(totalSize)} used</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
