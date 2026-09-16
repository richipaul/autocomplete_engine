import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import { EngineProvider } from './context/EngineContext';
import Dashboard from './pages/Dashboard';
import AutoCompleteView from './pages/AutoCompleteView';
import SpellCheckerView from './pages/SpellCheckerView';
import TrieVisualizerView from './pages/TrieVisualizerView';
import DictionaryView from './pages/DictionaryView';
import AlgorithmAnalysisView from './pages/AlgorithmAnalysisView';
import AboutView from './pages/AboutView';

function App() {
  return (
    <EngineProvider>
      <Router>
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
            {/* Background ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            
            <div className="max-w-6xl mx-auto h-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/autocomplete" element={<AutoCompleteView />} />
                <Route path="/spellcheck" element={<SpellCheckerView />} />
                <Route path="/trie" element={<TrieVisualizerView />} />
                <Route path="/dictionary" element={<DictionaryView />} />
                <Route path="/analysis" element={<AlgorithmAnalysisView />} />
                <Route path="/about" element={<AboutView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </EngineProvider>
  );
}

export default App;
