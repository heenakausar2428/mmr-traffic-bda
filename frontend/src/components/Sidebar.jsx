import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  BarChart3, 
  Route, 
  AlertTriangle, 
  Cpu, 
  Network, 
  FilePieChart, 
  Info 
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live-traffic', label: 'Live Traffic', icon: Radio },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'road-analysis', label: 'Road Analysis', icon: Route },
  { id: 'road-network', label: 'Road Network', icon: Network },
  { id: 'r-analytics', label: 'R Analytics', icon: FilePieChart },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { id: 'big-data', label: 'Big Data', icon: Cpu },
  { id: 'about', label: 'About / Arch', icon: Info },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-[#0d1424] border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-100 tracking-wide leading-tight">Mumbai Traffic</h1>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-cyan-400">Intelligence Platform</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-[#090e1a]/60">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>BDA Syllabus</span>
          <span className="text-cyan-400 font-mono font-semibold">Sem VII</span>
        </div>
        <div className="text-[11px] text-slate-500">BE Computer Engineering</div>
      </div>
    </aside>
  );
}
