import React, { useState, useMemo } from 'react';
import MumbaiMap from '../components/MumbaiMap';
import { Search, Filter, Radio, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function LiveTraffic({ roads = [], incidents = [], summary, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [selectedCongestion, setSelectedCongestion] = useState('ALL');

  const areaList = useMemo(() => {
    const set = new Set(roads.map(r => r.area));
    return ['ALL', ...Array.from(set)];
  }, [roads]);

  const filteredRoads = useMemo(() => {
    return roads.filter(road => {
      const matchesSearch = road.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            road.area.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea = selectedArea === 'ALL' || road.area === selectedArea;
      const matchesCongestion = selectedCongestion === 'ALL' || road.congestion_level === selectedCongestion;

      return matchesSearch && matchesArea && matchesCongestion;
    });
  }, [roads, searchQuery, selectedArea, selectedCongestion]);

  const isLiveMode = summary?.mode === 'LIVE';

  return (
    <div className="space-y-6">
      {/* Top Title & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#131b2a] p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">Live Traffic Control</h2>
            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
              isLiveMode 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveMode ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveMode ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span>{isLiveMode ? '● LIVE (TOMTOM API)' : '● DEMO MODE'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Connected to TomTom Live Traffic API tile services and flow segment telemetry
          </p>
        </div>

        {/* Filter Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search road or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Areas</option>
            {areaList.filter(a => a !== 'ALL').map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>

          <select
            value={selectedCongestion}
            onChange={(e) => setSelectedCongestion(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Congestion Levels</option>
            <option value="LOW">Low Congestion</option>
            <option value="MODERATE">Moderate Congestion</option>
            <option value="HIGH">High Congestion</option>
            <option value="SEVERE">Severe Congestion</option>
          </select>
        </div>
      </div>

      {/* FULL TOMTOM MAP VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#131b2a] p-4 rounded-xl border border-slate-800">
          <div className="h-[520px]">
            <MumbaiMap roads={filteredRoads} incidents={incidents} />
          </div>
        </div>

        {/* SIDEBAR LIVE ROADS FEED */}
        <div className="lg:col-span-4 bg-[#131b2a] p-4 rounded-xl border border-slate-800 flex flex-col h-[550px]">
          <h3 className="font-bold text-sm text-slate-100 mb-3 flex items-center justify-between">
            <span>Filtered Road Feeds ({filteredRoads.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">Live Telemetry</span>
          </h3>

          <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
            {filteredRoads.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No roads match current filters
              </div>
            ) : (
              filteredRoads.map((road) => {
                const speed = road.current_speed || road.current_speed_kmh;
                const freeFlow = road.free_flow_speed || road.free_flow_speed_kmh;
                const congestion = road.congestion_level || road.congestion;

                let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                if (congestion === 'MODERATE') badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                if (congestion === 'HIGH') badgeColor = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
                if (congestion === 'SEVERE') badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';

                return (
                  <div
                    key={road.road_id || road.name}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{road.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{road.area} • {road.length_km} km</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-cyan-400">{speed} km/h</div>
                      <span className={`inline-block text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border mt-0.5 font-mono ${badgeColor}`}>
                        {congestion}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
