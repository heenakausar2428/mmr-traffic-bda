import React, { useState, useMemo } from 'react';
import { Search, Route, ArrowUpRight, ArrowDownRight, Clock, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function LiveCorridorGrid({ roads = [], onSelectRoad }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCongestion, setSelectedCongestion] = useState('ALL');

  const filteredRoads = useMemo(() => {
    return roads.filter(road => {
      const matchSearch = road.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          road.area.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCongestion = selectedCongestion === 'ALL' || road.congestion_level === selectedCongestion;
      return matchSearch && matchCongestion;
    });
  }, [roads, searchQuery, selectedCongestion]);

  return (
    <div className="bg-[#131b2a] p-5 rounded-xl border border-slate-800/80 shadow-xl space-y-4 flex flex-col justify-between min-h-[460px]">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Route className="w-4 h-4 text-cyan-400" />
            Live Mumbai Traffic Corridor Grid
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              Live Updates Active
            </span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time telemetry drift across all monitored arterial corridors in Mumbai</p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search road (e.g. WEH, BKC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <select
            value={selectedCongestion}
            onChange={(e) => setSelectedCongestion(e.target.value)}
            className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Levels</option>
            <option value="LOW">Low</option>
            <option value="MODERATE">Moderate</option>
            <option value="HIGH">High</option>
            <option value="SEVERE">Severe</option>
          </select>
        </div>
      </div>

      {/* CORRIDORS MATRIX GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[380px] pr-1">
        {filteredRoads.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs font-mono">
            No road corridors matching search query
          </div>
        ) : (
          filteredRoads.map((road) => {
            const speed = road.current_speed || road.current_speed_kmh;
            const freeFlow = road.free_flow_speed || road.free_flow_speed_kmh;
            const congestion = road.congestion_level || road.congestion;
            const delta = road.speed_delta || 0;
            const pct = Math.round((speed / freeFlow) * 100);

            let statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            let barColor = 'bg-emerald-500';
            if (congestion === 'MODERATE') {
              statusBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
              barColor = 'bg-amber-500';
            } else if (congestion === 'HIGH') {
              statusBadge = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
              barColor = 'bg-orange-500';
            } else if (congestion === 'SEVERE') {
              statusBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
              barColor = 'bg-rose-500';
            }

            return (
              <div
                key={road.road_id || road.name}
                onClick={() => onSelectRoad && onSelectRoad(road)}
                className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all duration-200 flex flex-col justify-between gap-2 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors font-sans">
                      {road.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{road.area} • {road.length_km} km</div>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border font-mono ${statusBadge}`}>
                    {congestion}
                  </span>
                </div>

                {/* Speed Metrics & Flashing Delta */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-lg font-extrabold text-cyan-400 font-mono">{speed}</span>
                    <span className="text-[10px] text-slate-400 ml-1 font-mono">km/h</span>
                  </div>

                  {/* Dynamic Speed Change Delta */}
                  <div className={`text-[10px] font-bold font-mono flex items-center gap-0.5 ${
                    delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {delta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{delta > 0 ? `+${delta}` : delta} km/h</span>
                  </div>
                </div>

                {/* Progress Capacity Bar */}
                <div className="w-full space-y-1">
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(100, Math.max(10, pct))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>Capacity: {pct}%</span>
                    <span>Delay: {road.travel_time || road.travel_time_mins}m</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
