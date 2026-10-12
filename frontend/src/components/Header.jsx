import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw } from 'lucide-react';

export default function Header({ summaryData, onRefresh, loading }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLive = summaryData?.mode === 'LIVE';

  return (
    <header className="bg-[#0d1424] border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
      {/* Left Title */}
      <div>
        <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
          Mumbai Traffic Intelligence
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Big Data Platform
          </span>
        </h1>
        <p className="text-[11px] text-slate-400">Real-Time Traffic Monitoring & Big Data Analytics</p>
      </div>

      {/* Right Controls - Minimal & Un-crowded */}
      <div className="flex items-center gap-4 text-xs font-mono">
        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className={`font-bold text-[11px] ${isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isLive ? 'LIVE DATA' : 'DEMO MODE'}
          </span>
        </div>

        {/* Real-time Clock */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timeStr || '03:25:16 AM'}</span>
        </div>

        {/* Sync Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync</span>
        </button>
      </div>
    </header>
  );
}
