import React, { useState } from 'react';
import KPICard from '../components/KPICard';
import MumbaiMap from '../components/MumbaiMap';
import { Gauge, AlertTriangle, AlertOctagon, Database, Cpu, MapPin, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Overview({ summary, roads, incidents, speedTrends, onSelectRoad }) {
  const [selectedRoadId, setSelectedRoadId] = useState(null);

  const handleRoadClick = (road) => {
    setSelectedRoadId(road.road_id || road.name);
    if (onSelectRoad) onSelectRoad(road);
  };

  const topCongested = speedTrends?.most_congested_roads || [];
  const hourlyTrends = speedTrends?.hourly_trends || [];

  return (
    <div className="space-y-6">
      {/* Top Banner Subheading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Overview Command Center</h2>
          <p className="text-xs text-slate-400">Live operational telemetry & aggregate Big Data insights across Mumbai corridors</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Monitored Corridors: <span className="text-cyan-400 font-bold">{roads.length || 15}</span>
          </span>
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="CURRENT AVG SPEED"
          value={summary?.current_avg_speed_kmh || 42}
          unit="km/h"
          subtitle="Across all Mumbai arterial routes"
          icon={Gauge}
          color="emerald"
        />
        <KPICard
          title="CONGESTED ROADS"
          value={summary?.congested_roads_count || 18}
          unit="Corridors"
          subtitle="Operating below 40% free-flow speed"
          icon={AlertOctagon}
          color="rose"
        />
        <KPICard
          title="ACTIVE INCIDENTS"
          value={summary?.active_incidents_count || 7}
          unit="Active"
          subtitle="Accidents, work & blockages"
          icon={AlertTriangle}
          color="amber"
        />
        <KPICard
          title="TRAFFIC RECORDS"
          value={summary?.total_traffic_records || 125430}
          unit="Records"
          subtitle="Ingested & stored in MongoDB"
          icon={Database}
          color="cyan"
        />
        <KPICard
          title="ESTIMATED UNIQUE EVENTS"
          value={summary?.estimated_unique_events || 98421}
          unit="Events"
          subtitle="Calculated via Flajolet-Martin Alg."
          icon={Cpu}
          color="purple"
        />
        <KPICard
          title="MOST CONGESTED AREA"
          value={summary?.most_congested_area || 'Andheri'}
          unit=""
          subtitle="Lowest average speed bottleneck"
          icon={MapPin}
          color="rose"
        />
      </div>

      {/* MAIN CONTENT SPLIT: MAP (60%) & SIDE ANALYTICS (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* MAIN MUMBAI MAP (7 COLS / ~60%) */}
        <div className="lg:col-span-7 bg-[#131b2a] p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                TomTom Live Traffic Spatial Corridor Map
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  TomTom Live API
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Search roads in the map search bar or click polylines to inspect real-time delay telemetry</p>
            </div>
            {/* Color Legend */}
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Mod</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Severe</span>
            </div>
          </div>

          <div className="h-[460px]">
            <MumbaiMap roads={roads} incidents={incidents} onSelectRoad={handleRoadClick} selectedRoadId={selectedRoadId} />
          </div>
        </div>

        {/* RIGHT-SIDE ANALYTICS (5 COLS / ~40%) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          {/* TRAFFIC TREND LINE CHART */}
          <div className="bg-[#131b2a] p-4 rounded-xl border border-slate-800/80">
            <h3 className="font-bold text-sm text-slate-100 mb-1 flex items-center justify-between">
              <span>Traffic Speed Trend Over Time</span>
              <span className="text-xs font-normal text-slate-400 font-mono">24h History</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">Average speed progression during peak and non-peak hours</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} interval={3} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="km/h" domain={[15, 60]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px', color: '#ffffff' }}
                    itemStyle={{ color: '#ffffff' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="avg_speed" stroke="#38bdf8" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MOST CONGESTED ROADS RANKED LIST */}
          <div className="bg-[#131b2a] p-4 rounded-xl border border-slate-800/80 flex-1">
            <h3 className="font-bold text-sm text-slate-100 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                Most Congested Mumbai Roads
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Ranked by Speed</span>
            </h3>
            
            <div className="space-y-2.5 mt-3">
              {topCongested.slice(0, 5).map((road, idx) => {
                const speed = road.current_speed || road.current_speed_kmh;
                const freeFlow = road.free_flow_speed || road.free_flow_speed_kmh;
                const pct = Math.round((speed / freeFlow) * 100);

                return (
                  <div
                    key={road.road_name + idx}
                    onClick={() => handleRoadClick(road)}
                    className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-slate-800 text-slate-300 font-mono font-bold text-xs flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                          {road.road_name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{road.area}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-rose-400">{speed} km/h</div>
                      <div className="text-[10px] text-slate-400 font-mono">Cap: {freeFlow} km/h ({pct}%)</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
