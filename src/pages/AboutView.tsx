import { Info, Code2, Cpu, GitBranch, KeySquare } from 'lucide-react';

const AboutView = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-zinc-100 to-zinc-500 bg-clip-text text-transparent">Auto-Complete & Spell Checker Engine</h2>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-400">
          Data Structures & Algorithms Laboratory
        </div>
      </div>

      <div className="glass p-8 rounded-2xl border-[var(--border)] space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <Info className="w-6 h-6 text-primary" /> Project Objective
        </h3>
        <p className="text-zinc-300 leading-relaxed text-lg">
          This application demonstrates the practical, real-world application of foundational Data Structures and Algorithms in modern text-processing systems. It bridges the gap between theoretical algorithmic complexity and interactive software engineering by visually exposing the internal operations of a search engine and spell-checker.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-2xl border-[var(--border)]">
          <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
            <Cpu className="w-5 h-5 text-secondary" /> Core Concepts
          </h3>
          <ul className="space-y-3 font-mono text-sm text-zinc-300">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Trie (Prefix Tree)</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Prefix Search & String Matching</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Hashing / Dictionary Lookup</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Levenshtein Edit Distance</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Dynamic Programming</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Depth-First Search (DFS)</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> Time & Space Complexity Analysis</li>
          </ul>
        </div>

        <div className="glass p-8 rounded-2xl border-[var(--border)]">
          <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
            <Code2 className="w-5 h-5 text-success" /> Built Using
          </h3>
          <ul className="space-y-3 font-mono text-sm text-zinc-300">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> React & Vite</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> TypeScript</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> Tailwind CSS</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> Lucide Icons</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> Client-Side Processing</li>
          </ul>
        </div>
      </div>

      <div className="glass p-8 rounded-2xl border-[var(--border)] space-y-6 bg-primary/5 border-primary/20">
        <h3 className="text-2xl font-bold flex items-center gap-3 text-primary">
          <GitBranch className="w-6 h-6" /> Why use a Trie?
        </h3>
        <p className="text-zinc-300 leading-relaxed">
          A standard linear search through a dictionary for auto-complete suggestions requires scanning every single word, resulting in <code className="bg-black/30 px-2 py-0.5 rounded text-primary">O(N × L)</code> complexity. 
        </p>
        <p className="text-zinc-300 leading-relaxed">
          By structuring the dictionary into a <strong>Trie (Prefix Tree)</strong>, we can locate the exact prefix node in <code className="bg-black/30 px-2 py-0.5 rounded text-primary">O(P)</code> time (where P is the prefix length). From there, a simple Depth-First Search instantly yields all valid suffixes without ever scanning unrelated words. This turns an <code className="bg-black/30 px-2 py-0.5 rounded text-error">O(N)</code> bottleneck into an <code className="bg-black/30 px-2 py-0.5 rounded text-success">O(1)</code> scale-independent operation.
        </p>
      </div>

      <footer className="pt-12 pb-8 text-center text-zinc-500 space-y-2">
        <div className="font-bold flex items-center justify-center gap-2">
          <KeySquare className="w-4 h-4" /> AutoComplete Engine • DSA Lab Project
        </div>
        <div className="text-sm">Built to demonstrate practical applications of Data Structures & Algorithms.</div>
      </footer>
    </div>
  );
};

export default AboutView;
