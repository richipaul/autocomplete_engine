import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEngine } from '../context/EngineContext';
import { Search, ChevronRight, Activity, Zap, Network, Terminal, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../components/layout/Sidebar';

const AutoCompleteView = () => {
  const { trie, addLog, updateMetrics } = useEngine();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{word: string, frequency: number, score: number}[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [lastMetrics, setLastMetrics] = useState<any>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const start = performance.now();
      const result = trie.getSuggestions(query, 8);
      const end = performance.now();
      
      const executionTime = end - start;
      
      setSuggestions(result.suggestions);
      setSelectedIndex(-1);
      
      if (result.suggestions.length > 0) {
        setLastMetrics({
          query,
          executionTime: executionTime.toFixed(2),
          nodesVisited: result.nodesVisited,
          suggestionCount: result.suggestions.length,
          trieDepth: query.length
        });
        
        updateMetrics({ lastExecutionTime: executionTime, nodesVisited: result.nodesVisited });
        addLog(`> Prefix query: "${query}" | Found ${result.suggestions.length} suggestions | ${executionTime.toFixed(2)}ms`);
      }
    } else {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  }, [query, trie, addLog, updateMetrics]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        setQuery(suggestions[selectedIndex].word);
        setSuggestions([]);
        inputRef.current?.blur();
      } else if (suggestions.length > 0) {
        setQuery(suggestions[0].word);
        setSuggestions([]);
        inputRef.current?.blur();
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      inputRef.current?.blur();
    }
  };

  const highlightPrefix = (word: string, prefix: string) => {
    if (!word.toLowerCase().startsWith(prefix.toLowerCase())) return word;
    return (
      <>
        <span className="text-primary font-bold">{word.substring(0, prefix.length)}</span>
        <span>{word.substring(prefix.length)}</span>
      </>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Auto-Complete Engine</h2>
          <p className="text-zinc-400 mt-1">Trie-powered prefix search with real-time suggestion ranking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Search Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-xl border-[var(--border)] relative z-20">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={cn("h-6 w-6 transition-colors", isFocused ? "text-primary" : "text-zinc-500")} />
              </div>
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-4 pl-12 pr-4 text-xl placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] font-mono"
                placeholder="Start typing a word..."
                value={query}
                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                autoComplete="off"
                spellCheck="false"
              />
              
              {/* Dropdown */}
              {isFocused && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={suggestion.word}
                      className={cn(
                        "px-4 py-3 cursor-pointer flex items-center justify-between border-b border-zinc-800/50 last:border-0 transition-colors",
                        selectedIndex === index ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-zinc-800/50 border-l-2 border-l-transparent"
                      )}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setQuery(suggestion.word);
                        setSuggestions([]);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center gap-3 font-mono text-lg">
                        <Search className="w-4 h-4 text-zinc-500" />
                        {highlightPrefix(suggestion.word, query)}
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">PREFIX MATCH</span>
                        <span>Freq: {suggestion.frequency}</span>
                        <span>Score: {suggestion.score.toFixed(2)}</span>
                        {selectedIndex === index && (
                          <span className="text-zinc-400">⏎</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {isFocused && query.length > 0 && suggestions.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl p-4 z-30 text-zinc-400 text-center font-mono">
                  No suggestions found.
                </div>
              )}
            </div>
          </div>

          {/* Trie Visualization Preview */}
          {query.length > 0 && (
            <div className="glass p-6 rounded-xl border-[var(--border)] overflow-hidden relative">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                Trie Traversal Path
              </h3>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-2 font-mono text-xl">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center text-sm">root</div>
                </div>
                {query.split('').map((char, index) => (
                  <React.Fragment key={index}>
                    <ChevronRight className="w-5 h-5 text-primary animate-pulse" />
                    <div className="flex flex-col items-center animate-in zoom-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                        {char}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <button 
                  onClick={() => navigate('/trie')}
                  className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 transition-colors"
                >
                  Open Full Trie Visualization <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Analysis */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-xl border-[var(--border)]">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <Activity className="w-5 h-5 text-secondary" />
              Search Analysis
            </h3>
            
            {lastMetrics ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Query</div>
                    <div className="font-mono text-zinc-200">"{lastMetrics.query}"</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Complexity</div>
                    <div className="font-mono text-secondary">O(L + K)</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Execution Time</div>
                    <div className="font-mono text-success flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lastMetrics.executionTime} ms
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Nodes Visited</div>
                    <div className="font-mono text-primary">{lastMetrics.nodesVisited}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="text-xs text-zinc-500 mb-3">Search Pipeline</div>
                  <div className="space-y-2 font-mono text-xs">
                    {[
                      { step: 'Normalize Input', icon: CheckCircle2 },
                      { step: 'Traverse Trie', icon: CheckCircle2 },
                      { step: 'Locate Prefix Node', icon: CheckCircle2 },
                      { step: 'DFS Suggestions', icon: CheckCircle2 },
                      { step: `Rank ${lastMetrics.suggestionCount} Results`, icon: CheckCircle2 }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-zinc-300 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
                        <item.icon className="w-3 h-3 text-success" />
                        {item.step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-zinc-500 text-sm italic text-center py-8">
                Type a prefix to see analysis.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoCompleteView;
