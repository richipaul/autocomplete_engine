import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  SpellCheck, 
  Network, 
  BookA, 
  LineChart, 
  Info,
  TerminalSquare
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/autocomplete', label: 'Auto-Complete', icon: Search },
  { path: '/spellcheck', label: 'Spell Checker', icon: SpellCheck },
  { path: '/trie', label: 'Trie Visualizer', icon: Network },
  { path: '/dictionary', label: 'Dictionary', icon: BookA },
  { path: '/analysis', label: 'Algorithm Analysis', icon: LineChart },
  { path: '/about', label: 'About', icon: Info },
];

const Sidebar = () => {
  return (
    <aside className="w-64 flex flex-col bg-[var(--card)] border-r border-[var(--border)] h-full z-10 transition-all duration-300">
      <div className="p-6 border-b border-[var(--border)]">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
          <TerminalSquare className="w-6 h-6 text-primary" />
          AutoComplete Engine
        </h1>
        <div className="mt-2 text-xs uppercase tracking-widest text-zinc-500 font-semibold">
          DSA LAB PROJECT
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium",
              isActive 
                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border border-transparent"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--border)] bg-zinc-900/50">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          ENGINE ONLINE
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
