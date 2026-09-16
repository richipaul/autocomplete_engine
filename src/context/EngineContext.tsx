import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { Trie } from '../lib/dsa/Trie';
import { INITIAL_DICTIONARY, type DictionaryWord } from '../data/dictionary';

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
}

export interface EngineMetrics {
  nodesVisited: number;
  lastExecutionTime: number;
  trieSize: number;
  dictionarySize: number;
}

interface EngineContextProps {
  trie: Trie;
  dictionary: DictionaryWord[];
  addWord: (word: string) => void;
  deleteWord: (word: string) => void;
  logs: LogEntry[];
  addLog: (message: string) => void;
  clearLogs: () => void;
  metrics: EngineMetrics;
  updateMetrics: (newMetrics: Partial<EngineMetrics>) => void;
}

const EngineContext = createContext<EngineContextProps | undefined>(undefined);

export const EngineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trie] = useState(() => new Trie());
  const [dictionary, setDictionary] = useState<DictionaryWord[]>(INITIAL_DICTIONARY);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<EngineMetrics>({
    nodesVisited: 0,
    lastExecutionTime: 0,
    trieSize: 0,
    dictionarySize: INITIAL_DICTIONARY.length,
  });

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), timestamp: new Date(), message },
    ]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const updateMetrics = useCallback((newMetrics: Partial<EngineMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...newMetrics }));
  }, []);

  // Initialize Trie on mount
  useEffect(() => {
    const start = performance.now();
    INITIAL_DICTIONARY.forEach((entry) => {
      trie.insert(entry.word, entry.frequency);
    });
    const end = performance.now();
    
    updateMetrics({
      trieSize: trie.nodeCount,
      dictionarySize: INITIAL_DICTIONARY.length,
      lastExecutionTime: end - start
    });
    
    addLog(`Engine initialized in ${(end - start).toFixed(2)}ms`);
    addLog(`Dictionary loaded: ${INITIAL_DICTIONARY.length} words`);
    addLog(`Trie constructed with ${trie.nodeCount} nodes`);
  }, [trie, addLog, updateMetrics]);

  const addWord = useCallback((word: string) => {
    const cleanWord = word.trim().toLowerCase();
    if (!cleanWord) return;
    
    if (dictionary.some(d => d.word === cleanWord)) {
      addLog(`⚠ Word already exists: "${cleanWord}"`);
      return;
    }

    const start = performance.now();
    trie.insert(cleanWord, 100); // Default frequency for new words
    const end = performance.now();

    setDictionary(prev => [...prev, { word: cleanWord, frequency: 100 }]);
    
    updateMetrics({
      trieSize: trie.nodeCount,
      dictionarySize: dictionary.length + 1,
      lastExecutionTime: end - start
    });
    
    addLog(`> Added word: "${cleanWord}" in ${(end-start).toFixed(2)}ms`);
  }, [dictionary, trie, addLog, updateMetrics]);

  const deleteWord = useCallback((word: string) => {
    const cleanWord = word.trim().toLowerCase();
    const start = performance.now();
    const success = trie.delete(cleanWord);
    const end = performance.now();

    if (success) {
      setDictionary(prev => prev.filter(d => d.word !== cleanWord));
      updateMetrics({
        trieSize: trie.nodeCount,
        dictionarySize: dictionary.length - 1,
        lastExecutionTime: end - start
      });
      addLog(`> Deleted word: "${cleanWord}" in ${(end-start).toFixed(2)}ms`);
    } else {
      addLog(`> Failed to delete: "${cleanWord}" (Not found)`);
    }
  }, [dictionary.length, trie, addLog, updateMetrics]);

  return (
    <EngineContext.Provider
      value={{
        trie,
        dictionary,
        addWord,
        deleteWord,
        logs,
        addLog,
        clearLogs,
        metrics,
        updateMetrics,
      }}
    >
      {children}
    </EngineContext.Provider>
  );
};

export const useEngine = () => {
  const context = useContext(EngineContext);
  if (context === undefined) {
    throw new Error('useEngine must be used within an EngineProvider');
  }
  return context;
};
