import { useState, useEffect } from 'react';
import { useEngine } from '../context/EngineContext';
import { Trie, type TrieNode } from '../lib/dsa/Trie';
import { Network, Plus, Search, Trash2, RotateCcw } from 'lucide-react';
import { cn } from '../components/layout/Sidebar';
import { motion } from 'framer-motion';

const TrieVisualizerView = () => {
  const { addLog } = useEngine();
  
  // Use a local Trie for visualization so it doesn't get cluttered with 100+ words
  const [localTrie] = useState(() => new Trie());
  const [words, setWords] = useState<string[]>(['program', 'programming', 'process', 'project', 'property']);
  const [inputWord, setInputWord] = useState('');
  
  const [highlightedNodes, setHighlightedNodes] = useState<Set<TrieNode>>(new Set());
  const [currentNode, setCurrentNode] = useState<TrieNode | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<number>(0);
  const [operationState, setOperationState] = useState<'IDLE' | 'SEARCHING' | 'SUCCESS' | 'FAILURE'>('IDLE');
  
  // Initialize local trie
  useEffect(() => {
    words.forEach(w => localTrie.insert(w));
    // Force re-render to draw initial tree
    setVisitedNodes(prev => prev + 1);
  }, []);

  const resetHighlights = () => {
    setHighlightedNodes(new Set());
    setCurrentNode(null);
    setOperationState('IDLE');
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const animateTraversal = async (word: string, isPrefixSearch = false) => {
    resetHighlights();
    setOperationState('SEARCHING');
    
    let current = localTrie.root;
    const highlights = new Set<TrieNode>();
    highlights.add(current);
    setHighlightedNodes(new Set(highlights));
    setCurrentNode(current);
    
    let visited = 1;
    setVisitedNodes(visited);
    
    await delay(300);

    for (const char of word) {
      if (!current.children.has(char)) {
        setOperationState('FAILURE');
        addLog(`> Trie Visualizer: Failed to find "${char}" in path.`);
        return { found: false, node: current };
      }
      
      current = current.children.get(char)!;
      highlights.add(current);
      
      setHighlightedNodes(new Set(highlights));
      setCurrentNode(current);
      visited++;
      setVisitedNodes(visited);
      
      await delay(300); // Animation step delay
    }

    const success = isPrefixSearch || current.isEndOfWord;
    setOperationState(success ? 'SUCCESS' : 'FAILURE');
    
    return { found: success, node: current };
  };

  const handleInsert = async () => {
    if (!inputWord) return;
    const word = inputWord.toLowerCase().trim();
    
    if (words.includes(word)) {
      addLog(`> Trie Visualizer: "${word}" already exists.`);
      return;
    }
    
    localTrie.insert(word);
    setWords([...words, word]);
    addLog(`> Trie Visualizer: Inserted "${word}"`);
    setInputWord('');
    
    // Animate to show it being added
    await animateTraversal(word);
  };

  const handleSearch = async () => {
    if (!inputWord) return;
    const word = inputWord.toLowerCase().trim();
    addLog(`> Trie Visualizer: Searching for exact word "${word}"`);
    await animateTraversal(word, false);
  };

  const handlePrefixSearch = async () => {
    if (!inputWord) return;
    const prefix = inputWord.toLowerCase().trim();
    addLog(`> Trie Visualizer: Prefix searching for "${prefix}"`);
    await animateTraversal(prefix, true);
  };

  const handleDelete = () => {
    if (!inputWord) return;
    const word = inputWord.toLowerCase().trim();
    if (localTrie.delete(word)) {
      setWords(words.filter(w => w !== word));
      addLog(`> Trie Visualizer: Deleted "${word}"`);
      resetHighlights();
    } else {
      addLog(`> Trie Visualizer: Failed to delete "${word}" (not found)`);
    }
    setInputWord('');
  };

  // Recursive component to render the Trie
  const RenderNode = ({ node, char, depth = 0 }: { node: TrieNode, char: string, depth?: number }) => {
    const isHighlighted = highlightedNodes.has(node);
    const isCurrent = currentNode === node;
    
    const nodeColor = isCurrent 
      ? (operationState === 'SUCCESS' ? 'bg-success border-success text-success-foreground shadow-[0_0_15px_rgba(34,197,94,0.5)]' 
         : operationState === 'FAILURE' ? 'bg-error border-error text-error-foreground' 
         : 'bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(6,182,212,0.5)]')
      : isHighlighted 
        ? 'bg-primary/20 border-primary text-primary' 
        : 'bg-zinc-800 border-zinc-600 text-zinc-300';

    return (
      <div className="flex flex-col items-center">
        <motion.div 
          layout
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center font-mono relative transition-all duration-300 z-10",
            nodeColor
          )}
        >
          <span className="text-lg font-bold">{char}</span>
          {node.isEndOfWord && (
            <div className={cn("absolute -bottom-1 w-2 h-2 rounded-full", isHighlighted ? "bg-primary" : "bg-zinc-500")} title="End of Word" />
          )}
        </motion.div>
        
        {/* Render Children */}
        {node.children.size > 0 && (
          <div className="flex gap-4 mt-6 relative">
            {/* Connecting line to children container (simplified for flex layout) */}
            <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-zinc-700 -translate-x-1/2 -z-10"></div>
            
            {/* Horizontal connection between siblings */}
            {node.children.size > 1 && (
              <div className="absolute -top-3 left-[10%] right-[10%] h-0.5 bg-zinc-700 -z-10"></div>
            )}

            {Array.from(node.children.entries()).map(([childChar, childNode], _index, arr) => (
              <div key={childChar} className="relative pt-3 flex flex-col items-center">
                {/* Vertical drops for children */}
                <div className={cn("absolute top-0 w-0.5 h-3 -z-10", 
                   highlightedNodes.has(childNode) ? "bg-primary shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "bg-zinc-700",
                   arr.length === 1 ? "left-1/2 -translate-x-1/2" : "left-1/2 -translate-x-1/2"
                )}></div>
                
                <RenderNode node={childNode} char={childChar} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trie Visualizer</h2>
          <p className="text-zinc-400 mt-1">Interactive step-by-step prefix tree operations.</p>
        </div>
        
        <div className="flex items-center gap-2 font-mono text-sm">
          <div className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800">
            Nodes: <span className="text-primary">{localTrie.nodeCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800">
            Words: <span className="text-primary">{words.length}</span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="glass p-4 rounded-xl border-[var(--border)] flex flex-wrap gap-4 items-center z-20 relative">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg py-2.5 px-4 font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="Enter word..."
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button onClick={handleInsert} className="btn-primary flex items-center gap-1.5 px-4 py-2 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4" /> Insert
          </button>
          <button onClick={handleSearch} className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 rounded-lg font-medium transition-colors">
            <Search className="w-4 h-4" /> Search
          </button>
          <button onClick={handlePrefixSearch} className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 rounded-lg font-medium transition-colors">
            <Network className="w-4 h-4" /> Prefix Search
          </button>
          <button onClick={handleDelete} className="flex items-center gap-1.5 px-4 py-2 bg-error/10 text-error hover:bg-error hover:text-error-foreground border border-error/30 rounded-lg font-medium transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <button onClick={resetHighlights} className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg font-medium transition-colors ml-auto">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="flex-1 min-h-[500px] glass rounded-xl border-[var(--border)] overflow-auto p-10 relative flex justify-center">
        {/* State Indicator */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {operationState !== 'IDLE' && (
            <div className={cn(
              "px-3 py-1.5 rounded font-mono text-sm flex items-center gap-2",
              operationState === 'SEARCHING' ? "bg-primary/20 text-primary border border-primary/30" :
              operationState === 'SUCCESS' ? "bg-success/20 text-success border border-success/30" :
              "bg-error/20 text-error border border-error/30"
            )}>
              {operationState === 'SEARCHING' && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
              {operationState}
            </div>
          )}
          {operationState !== 'IDLE' && (
            <div className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-400">
              Nodes Visited: <span className="text-zinc-200">{visitedNodes}</span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 text-xs font-mono">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-600"></div> Normal</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary/40 border border-primary"></div> Visited</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div> Current</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-success"></div> Success</div>
          <div className="flex items-center gap-2"><div className="relative w-3 h-3 rounded-full bg-zinc-800 border border-zinc-600"><div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-zinc-500 rounded-full"></div></div> End of Word</div>
        </div>

        {/* The Tree */}
        <div className="pt-8 pb-32">
          <RenderNode node={localTrie.root} char="root" />
        </div>
      </div>
    </div>
  );
};

export default TrieVisualizerView;
