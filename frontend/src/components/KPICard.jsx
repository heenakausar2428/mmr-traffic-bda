import React from 'react';

export default function KPICard({ title, value, unit, subtitle, icon: Icon, color = 'cyan' }) {
  const colorStyles = {
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
      text: 'text-cyan-400'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      text: 'text-emerald-400'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/20 text-amber-400',
      text: 'text-amber-400'
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      iconBg: 'bg-rose-500/20 text-rose-400',
      text: 'text-rose-400'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-500/20 text-purple-400',
      text: 'text-purple-400'
    }
  };

  const style = colorStyles[color] || colorStyles.cyan;

  return (
    <div className={`p-4 rounded-xl bg-[#131b2a] border ${style.border} hover:border-slate-700 transition-all duration-300 shadow-lg shadow-black/20 group`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg ${style.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
      </div>

      {subtitle && (
        <p className="text-[11px] text-slate-500 mt-1.5 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}
