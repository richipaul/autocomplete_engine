import React, { useState, useMemo } from 'react';
import { useEngine } from '../context/EngineContext';
import { BookA, Search, Plus, Trash2, ArrowUpDown } from 'lucide-react';
import { cn } from '../components/layout/Sidebar';

const DictionaryView = () => {
  const { dictionary, addWord, deleteWord } = useEngine();
  const [searchQuery, setSearchQuery] = useState('');
  const [newWord, setNewWord] = useState('');
  const [sortField, setSortField] = useState<'word' | 'frequency' | 'length'>('word');
  const [sortAsc, setSortAsc] = useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWord) {
      addWord(newWord);
      setNewWord('');
    }
  };

  const handleSort = (field: 'word' | 'frequency' | 'length') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredAndSortedDict = useMemo(() => {
    let result = dictionary.filter(d => d.word.toLowerCase().includes(searchQuery.toLowerCase()));
    
    result.sort((a, b) => {
      let valA: any = a[sortField === 'length' ? 'word' : sortField];
      let valB: any = b[sortField === 'length' ? 'word' : sortField];
      
      if (sortField === 'length') {
        valA = valA.length;
        valB = valB.length;
      }
      
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [dictionary, searchQuery, sortField, sortAsc]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dictionary Management</h2>
          <p className="text-zinc-400 mt-1">Manage the corpus of words used by the Auto-Complete engine.</p>
        </div>
        
        <div className="flex items-center gap-2 font-mono text-sm">
          <div className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center gap-2 font-bold">
            <BookA className="w-4 h-4" />
            {dictionary.length} Words
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass rounded-xl border-[var(--border)] overflow-hidden flex flex-col h-[600px]">
          {/* Toolbar */}
          <div className="p-4 border-b border-[var(--border)] bg-zinc-900/50 flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                className="w-full bg-black/20 border border-zinc-700 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="Search dictionary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="text-xs text-zinc-500 font-mono">
              Showing {filteredAndSortedDict.length} results
            </div>
          </div>
          
          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead className="sticky top-0 bg-zinc-900 z-10 shadow-md">
                <tr>
                  {['WORD', 'FREQUENCY', 'LENGTH'].map(col => {
                    const field = col.toLowerCase() as any;
                    return (
                      <th 
                        key={col} 
                        className="p-4 text-xs font-bold tracking-wider text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors border-b border-zinc-800"
                        onClick={() => handleSort(field)}
                      >
                        <div className="flex items-center gap-1">
                          {col}
                          {sortField === field && (
                            <ArrowUpDown className={cn("w-3 h-3", sortAsc ? "text-primary" : "text-primary rotate-180")} />
                          )}
                        </div>
                      </th>
                    )
                  })}
                  <th className="p-4 text-xs font-bold tracking-wider text-zinc-400 border-b border-zinc-800 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedDict.map((item) => (
                  <tr key={item.word} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group">
                    <td className="p-4 font-mono text-zinc-200 font-medium">{item.word}</td>
                    <td className="p-4 font-mono text-zinc-400">{item.frequency}</td>
                    <td className="p-4 font-mono text-zinc-400">{item.word.length}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => deleteWord(item.word)}
                        className="p-2 text-zinc-500 hover:text-error hover:bg-error/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete word"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAndSortedDict.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono">No words found matching "{searchQuery}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Word Panel */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-xl border-[var(--border)]">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-success" />
              Add Word
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">New Word</label>
                <input
                  type="text"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2.5 px-3 font-mono focus:outline-none focus:ring-1 focus:ring-success focus:border-success transition-all"
                  placeholder="e.g. dynamic"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-success/20 text-success hover:bg-success hover:text-success-foreground font-semibold rounded-lg transition-colors border border-success/30 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add to Dictionary
              </button>
            </form>
            <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-zinc-500 leading-relaxed">
              Adding a word will automatically insert it into the Trie data structure and make it available for auto-completion and spell checking immediately.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DictionaryView;
