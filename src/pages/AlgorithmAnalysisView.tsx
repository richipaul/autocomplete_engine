import { LineChart, Network, Calculator, Hash } from 'lucide-react';
import { cn } from '../components/layout/Sidebar';

const AlgorithmAnalysisView = () => {
  const algorithms = [
    {
      name: 'Trie (Prefix Tree)',
      icon: Network,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      purpose: 'Efficient prefix-based searching and auto-completion.',
      complexities: [
        { label: 'Insertion', value: 'O(L)', note: 'L is length of word' },
        { label: 'Search', value: 'O(L)', note: 'Fast exact match' },
        { label: 'Prefix Search', value: 'O(P + K)', note: 'P is prefix length, K is number of suggestions' }
      ]
    },
    {
      name: 'Levenshtein Distance',
      icon: Calculator,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      border: 'border-secondary/20',
      purpose: 'Finding the minimum number of edits (insert, delete, replace) required to transform one word into another.',
      complexities: [
        { label: 'Time', value: 'O(m × n)', note: 'm and n are lengths of the two words' },
        { label: 'Space', value: 'O(m × n)', note: 'Matrix size' }
      ]
    },
    {
      name: 'Hash Table / Dictionary',
      icon: Hash,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      purpose: 'Fast exact-word lookup for spell checking validation.',
      complexities: [
        { label: 'Average Search', value: 'O(1)', note: 'Constant time lookup' },
        { label: 'Insertion', value: 'O(1)', note: 'Average case' }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Algorithm Analysis</h2>
        <p className="text-zinc-400 mt-1">Technical breakdown of the data structures and algorithms powering the engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {algorithms.map((algo, i) => (
          <div key={i} className={cn("glass p-6 rounded-xl border transition-colors", algo.border, "hover:border-[var(--primary)]")}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2.5 rounded-lg", algo.bg)}>
                <algo.icon className={cn("w-5 h-5", algo.color)} />
              </div>
              <h3 className="text-lg font-bold">{algo.name}</h3>
            </div>
            
            <div className="text-sm text-zinc-300 mb-6 leading-relaxed">
              <span className="text-zinc-500 font-semibold block mb-1">PURPOSE</span>
              {algo.purpose}
            </div>

            <div className="space-y-3">
              <span className="text-zinc-500 font-semibold text-xs mb-1 block uppercase tracking-wider">Complexity</span>
              {algo.complexities.map((comp, j) => (
                <div key={j} className="flex flex-col bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-zinc-300">{comp.label}</span>
                    <span className={cn("font-mono font-bold", algo.color)}>{comp.value}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{comp.note}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-6 rounded-xl border-[var(--border)] mt-8">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <LineChart className="w-5 h-5 text-primary" />
          Complexity Comparison
        </h3>

        <div className="space-y-4 max-w-3xl">
          {[
            { op: 'Hash Lookup', time: 'O(1)', width: '5%', color: 'bg-success' },
            { op: 'Trie Search', time: 'O(L)', width: '15%', color: 'bg-primary' },
            { op: 'Trie Prefix Search', time: 'O(P + K)', width: '25%', color: 'bg-blue-500' },
            { op: 'Linear Search', time: 'O(n)', width: '60%', color: 'bg-warning' },
            { op: 'Edit Distance', time: 'O(m × n)', width: '100%', color: 'bg-error' },
          ].map((comp, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="w-48 text-sm font-medium text-zinc-300 shrink-0">{comp.op}</div>
              <div className="w-24 font-mono text-sm text-zinc-500 shrink-0">{comp.time}</div>
              <div className="flex-1 bg-zinc-900 rounded-full h-3 overflow-hidden border border-zinc-800">
                <div className={cn("h-full rounded-full transition-all duration-1000", comp.color)} style={{ width: comp.width }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmAnalysisView;
