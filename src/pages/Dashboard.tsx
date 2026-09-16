import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEngine } from '../context/EngineContext';
import { Book, Network, Zap, Clock, TerminalSquare, CheckCircle2, PlayCircle, StopCircle, Trash2 } from 'lucide-react';
import { cn } from '../components/layout/Sidebar';
const Dashboard = () => {
  const navigate = useNavigate();
  const { metrics, logs, clearLogs, addLog } = useEngine();
  const [demoState, setDemoState] = useState<'IDLE' | 'RUNNING'>('IDLE');
  const [, setDemoStep] = useState(0);

  const statCards = [
    { label: 'Dictionary Words', value: metrics.dictionarySize.toLocaleString(), icon: Book, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Trie Nodes', value: metrics.trieSize.toLocaleString(), icon: Network, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Avg Search Time', value: metrics.lastExecutionTime > 0 ? `${metrics.lastExecutionTime.toFixed(2)} ms` : '0.00 ms', icon: Clock, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'System Readiness', value: '100%', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runDemo = async () => {
    if (demoState === 'RUNNING') return;
    setDemoState('RUNNING');
    setDemoStep(1);
    clearLogs();
    addLog('--- DEMO SEQUENCE INITIATED ---');
    
    await delay(1000);
    
    if (window.location.pathname !== '/trie') {
      navigate('/trie');
    }
    addLog('Step 1: Visualizing Trie structure...');
    await delay(2000);
    
    navigate('/autocomplete');
    addLog('Step 2: Performing prefix search for "pro"...');
    await delay(2000);

    navigate('/spellcheck');
    addLog('Step 3: Detecting spelling error "programmng"...');
    await delay(2000);
    
    addLog('Step 4: Calculating Levenshtein Edit Distance...');
    await delay(2000);
    
    navigate('/analysis');
    addLog('Step 5: Displaying Algorithm Complexity...');
    await delay(3000);

    navigate('/');
    addLog('--- DEMO SEQUENCE COMPLETED ---');
    setDemoState('IDLE');
    setDemoStep(0);
  };

  const stopDemo = () => {
    setDemoState('IDLE');
    addLog('--- DEMO STOPPED ---');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden glass p-10 border-[var(--border)]">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
            <TerminalSquare className="w-4 h-4" />
            V 1.0.0
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Auto-Complete & <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Spell Checker Engine</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            Explore how Trie-based prefix searching and edit-distance algorithms power intelligent text suggestions and spell correction.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => navigate('/autocomplete')}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Try Auto-Complete
            </button>
            <button 
              onClick={() => navigate('/trie')}
              className="px-6 py-3 rounded-lg bg-zinc-800 text-zinc-100 font-semibold hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              Visualize Trie
            </button>
            
            {demoState === 'IDLE' ? (
              <button 
                onClick={runDemo}
                className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <PlayCircle className="w-5 h-5" /> RUN LIVE DEMO
              </button>
            ) : (
              <button 
                onClick={stopDemo}
                className="px-6 py-3 rounded-lg bg-error text-error-foreground font-semibold hover:bg-error/90 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                <StopCircle className="w-5 h-5 animate-pulse" /> STOP DEMO
              </button>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -right-10 top-20 text-zinc-800/20 rotate-12 select-none pointer-events-none">
          <Network className="w-[300px] h-[300px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statCards.map((stat, i) => (
              <div key={i} className="glass p-6 rounded-xl border-[var(--border)] flex items-center gap-4 hover:border-primary/50 transition-colors">
                <div className={cn("p-4 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <div className="text-sm text-zinc-400 font-medium">{stat.label}</div>
                  <div className="text-2xl font-bold font-mono">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Engine Status */}
          <div className="glass rounded-xl border-[var(--border)] p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Engine Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: 'Trie Data Structure', status: 'ONLINE' },
                { name: 'Spell Checker Module', status: 'ONLINE' },
                { name: 'Dictionary Source', status: 'LOADED' },
                { name: 'Search Engine', status: 'READY' }
              ].map((sys, i) => (
                <div key={i} className="flex flex-col gap-1 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                  <div className="text-sm text-zinc-400">{sys.name}</div>
                  <div className="flex items-center gap-2 text-sm font-semibold font-mono text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    {sys.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Execution Log */}
        <div className="glass rounded-xl border-[var(--border)] p-0 flex flex-col h-[500px] overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] bg-zinc-900/80 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-sm">
              <TerminalSquare className="w-4 h-4 text-zinc-400" />
              Execution Log
            </h3>
            <button 
              onClick={clearLogs}
              className="text-zinc-500 hover:text-error transition-colors"
              title="Clear Logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto font-mono text-xs space-y-2 bg-black/40">
            {logs.map((log) => (
              <div key={log.id} className={cn(
                "break-words",
                log.message.includes('---') ? "text-primary font-bold my-4 text-center" :
                log.message.startsWith('⚠') ? "text-warning" :
                log.message.startsWith('>') ? "text-zinc-300" :
                "text-zinc-500"
              )}>
                <span className="text-zinc-600 mr-2 opacity-50">
                  [{log.timestamp.toLocaleTimeString([], { hour12: false })}]
                </span>
                {log.message}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-zinc-600 text-center italic mt-10">
                System awaiting operations...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
