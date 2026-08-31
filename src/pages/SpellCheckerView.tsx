import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useEngine } from '../context/EngineContext';
import { levenshteinDistance, type EditDistanceResult } from '../lib/dsa/EditDistance';
import { SpellCheck, ArrowRight, Wand2, Calculator, PlayCircle } from 'lucide-react';
import { cn } from '../components/layout/Sidebar';

const SpellCheckerView = () => {
  const { dictionary, addLog, updateMetrics } = useEngine();
  
  const [text, setText] = useState('I am learning programmng and datastructre algorithms.');
  const [selectedWord, setSelectedWord] = useState<{word: string, index: number, rect: DOMRect} | null>(null);
  const [corrections, setCorrections] = useState<{word: string, distance: number, result: EditDistanceResult}[]>([]);
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const words = text.split(/(\s+)/); // Split by whitespace keeping the whitespace

  // Fast dictionary lookup map
  const dictMap = useMemo(() => {
    const map = new Set(dictionary.map(d => d.word.toLowerCase()));
    return map;
  }, [dictionary]);

  // Basic tokenizer that ignores punctuation for checking, but keeps it for display
  const cleanWord = (w: string) => w.replace(/[.,!?]/g, '').toLowerCase();

  const handleWordClick = (word: string, index: number, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    const cleaned = cleanWord(word);
    
    // Calculate Edit Distance for suggestions
    const start = performance.now();
    
    // Find closest matches
    const candidates = dictionary.map(dictEntry => {
      const result = levenshteinDistance(cleaned, dictEntry.word);
      return { word: dictEntry.word, distance: result.distance, result };
    }).sort((a, b) => a.distance - b.distance).slice(0, 3);
    
    const end = performance.now();
    
    updateMetrics({ lastExecutionTime: end - start });
    addLog(`> Edit Distance calculated for "${cleaned}": ${(end-start).toFixed(2)}ms`);

    setSelectedWord({ word: cleaned, index, rect });
    setCorrections(candidates);
  };

  const applyCorrection = (correction: string) => {
    if (!selectedWord) return;
    
    // Replace the specific word index in the text
    const newWords = [...words];
    // Re-attach any trailing punctuation that was stripped during checking
    const originalWord = newWords[selectedWord.index];
    const punctuationMatch = originalWord.match(/[.,!?]+$/);
    const punctuation = punctuationMatch ? punctuationMatch[0] : '';
    
    // Preserve original capitalization if possible (simple version)
    const isCapitalized = originalWord.charAt(0) === originalWord.charAt(0).toUpperCase() && originalWord.charAt(0).match(/[A-Z]/);
    const finalWord = isCapitalized ? correction.charAt(0).toUpperCase() + correction.slice(1) : correction;
    
    newWords[selectedWord.index] = finalWord + punctuation;
    
    setText(newWords.join(''));
    setSelectedWord(null);
    addLog(`> ✓ Correction applied: "${correction}"`);
  };

  const syncScroll = () => {
    if (overlayRef.current && textAreaRef.current) {
      overlayRef.current.scrollTop = textAreaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textAreaRef.current.scrollLeft;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Spell Checker Engine</h2>
          <p className="text-zinc-400 mt-1">Real-time unknown word detection and Edit Distance correction.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Editor Panel */}
        <div className="space-y-4">
          <div className="glass rounded-xl border-[var(--border)] overflow-hidden flex flex-col relative h-[400px]">
            <div className="bg-zinc-900/80 border-b border-zinc-800 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">text_input.txt</span>
              <SpellCheck className="w-4 h-4 text-zinc-500" />
            </div>
            
            <div className="relative flex-1 overflow-hidden bg-black/20">
              {/* Highlight Overlay */}
              <div 
                ref={overlayRef}
                className="absolute inset-0 p-4 font-mono text-lg whitespace-pre-wrap break-words pointer-events-auto overflow-auto text-transparent"
                aria-hidden="true"
              >
                {words.map((word, i) => {
                  const cleaned = cleanWord(word);
                  const isWord = cleaned.length > 0 && cleaned.match(/[a-z]/i);
                  const isError = isWord && !dictMap.has(cleaned);
                  
                  if (isError) {
                    return (
                      <span 
                        key={i} 
                        className="squiggly-error cursor-pointer text-transparent relative z-10"
                        onClick={(e) => handleWordClick(word, i, e)}
                        title="Click for corrections"
                      >
                        {word}
                      </span>
                    );
                  }
                  return <span key={i}>{word}</span>;
                })}
              </div>

              {/* Actual Textarea */}
              <textarea
                ref={textAreaRef}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setSelectedWord(null);
                }}
                onScroll={syncScroll}
                className="absolute inset-0 p-4 w-full h-full bg-transparent text-[var(--foreground)] font-mono text-lg resize-none focus:outline-none focus:ring-0"
                spellCheck="false"
              />
            </div>
          </div>
          
          <p className="text-xs text-zinc-500 text-center">Click on red underlined words to see algorithm-generated corrections.</p>
        </div>

        {/* Correction & Analysis Panel */}
        <div className="space-y-6">
          {selectedWord ? (
            <>
              {/* Correction Popup Card */}
              <div className="glass p-6 rounded-xl border-[var(--border)] animate-in slide-in-from-left-4 duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 blur-[50px] -z-10 rounded-full"></div>
                <h3 className="text-error font-bold mb-4 flex items-center gap-2">
                  <SpellCheck className="w-5 h-5" />
                  Spelling Error Detected
                </h3>
                
                <div className="mb-6">
                  <div className="text-sm text-zinc-400 mb-1">Unknown Word:</div>
                  <div className="font-mono text-xl line-through decoration-error text-zinc-300">{selectedWord.word}</div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-zinc-400">Algorithm Suggestions:</div>
                  {corrections.map((corr, idx) => (
                    <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-lg font-bold text-success">{corr.word}</span>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono mt-1">
                          <span className="flex items-center gap-1"><Calculator className="w-3 h-3" /> Edit Distance: {corr.distance}</span>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800">
                            {Math.max(0, 100 - (corr.distance * 15))}% Match
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => applyCorrection(corr.word)}
                        className="px-4 py-2 bg-success/10 text-success hover:bg-success hover:text-success-foreground font-semibold rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Wand2 className="w-4 h-4" /> Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Distance Matrix Vis */}
              {corrections.length > 0 && (
                <div className="glass p-6 rounded-xl border-[var(--border)] animate-in slide-in-from-bottom-4 duration-500 delay-100">
                  <h3 className="text-lg font-bold mb-4">Edit Distance Analysis</h3>
                  
                  <div className="flex items-center justify-center gap-4 mb-6 font-mono bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                    <span className="text-error">{selectedWord.word}</span>
                    <ArrowRight className="w-4 h-4 text-zinc-500" />
                    <span className="text-success">{corrections[0].word}</span>
                  </div>

                  <div className="overflow-x-auto pb-4">
                    <table className="w-full text-center border-collapse font-mono text-xs md:text-sm">
                      <thead>
                        <tr>
                          <th className="p-2 border border-zinc-800 bg-zinc-900/50"></th>
                          <th className="p-2 border border-zinc-800 bg-zinc-900/50">ε</th>
                          {corrections[0].word.split('').map((char, i) => (
                            <th key={i} className="p-2 border border-zinc-800 bg-zinc-900/50 text-success">{char}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {corrections[0].result.matrix.map((row, i) => (
                          <tr key={i}>
                            <th className="p-2 border border-zinc-800 bg-zinc-900/50">
                              {i === 0 ? 'ε' : <span className="text-error">{selectedWord.word[i - 1]}</span>}
                            </th>
                            {row.map((cell, j) => {
                              // Is this cell on the optimal path?
                              const isOnPath = corrections[0].result.operations.some(op => 
                                (op.type === 'MATCH' || op.type === 'REPLACE') && op.sourceIndex === i - 1 && op.targetIndex === j - 1 ||
                                op.type === 'INSERT' && op.sourceIndex === i && op.targetIndex === j - 1 ||
                                op.type === 'DELETE' && op.sourceIndex === i - 1 && op.targetIndex === j
                              ) || (i===0 && j===0) || (i === corrections[0].result.matrix.length - 1 && j === row.length - 1);
                              
                              return (
                                <td 
                                  key={j} 
                                  className={cn(
                                    "p-2 border border-zinc-800 transition-colors",
                                    isOnPath ? "bg-primary/20 text-primary font-bold shadow-[inset_0_0_8px_rgba(6,182,212,0.3)]" : "text-zinc-500"
                                  )}
                                >
                                  {cell}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono">
                    <span className="text-zinc-500">Path Operations:</span>
                    {corrections[0].result.operations.map((op, i) => (
                      <span key={i} className={cn(
                        "px-2 py-0.5 rounded",
                        op.type === 'MATCH' ? "bg-zinc-800 text-zinc-400" :
                        op.type === 'REPLACE' ? "bg-yellow-500/20 text-yellow-500" :
                        op.type === 'INSERT' ? "bg-success/20 text-success" :
                        "bg-error/20 text-error"
                      )}>
                        {op.type} {op.char ? `"${op.char}"` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full glass rounded-xl border-[var(--border)] flex flex-col items-center justify-center p-8 text-center text-zinc-500">
              <SpellCheck className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-medium text-lg text-zinc-400">Waiting for interaction...</p>
              <p className="text-sm mt-2 max-w-sm">Type some text and click on any red-underlined words to see the Levenshtein Distance spell correction algorithm in action.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpellCheckerView;
