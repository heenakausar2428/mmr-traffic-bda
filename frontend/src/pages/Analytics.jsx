import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';
import { Clock, TrendingUp, AlertTriangle, Layers } from 'lucide-react';

export default function Analytics({ roads = [], speedTrends }) {
  const [congestionData, setCongestionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/congestion')
      .then(res => res.json())
      .then(data => {
        setCongestionData(data.distribution || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Prepare Speed by Road chart data
  const roadSpeedData = roads.slice(0, 10).map(r => ({
    name: r.name.length > 18 ? r.name.substring(0, 16) + '...' : r.name,
    speed: r.current_speed || r.current_speed_kmh,
    freeFlow: r.free_flow_speed || r.free_flow_speed_kmh
  }));

  // Prepare Area traffic count data
  const areaCounts = {};
  roads.forEach(r => {
    areaCounts[r.area] = (areaCounts[r.area] || 0) + 1;
  });
  const areaChartData = Object.keys(areaCounts).map(area => ({
    area,
    count: areaCounts[area]
  }));

  const hourlyTrends = speedTrends?.hourly_trends || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-100">Big Data Analytics Insights</h2>
        <p className="text-xs text-slate-400">Statistical distribution, speed bottleneck analysis, and hourly volume density curves</p>
      </div>

      {/* PEAK TRAFFIC HOURS HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#131b2a] border border-amber-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Morning Rush Peak</div>
            <div className="text-base font-bold text-amber-400 font-mono">08:30 AM - 10:30 AM</div>
            <div className="text-[10px] text-slate-500">WEH & LBS Marg heavy inbound flow</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b2a] border border-rose-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Evening Rush Peak</div>
            <div className="text-base font-bold text-rose-400 font-mono">05:30 PM - 08:30 PM</div>
            <div className="text-[10px] text-slate-500">BKC & South Mumbai exit bottlenecks</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b2a] border border-cyan-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Avg Peak Delay</div>
            <div className="text-base font-bold text-cyan-400 font-mono">34.5 Mins</div>
            <div className="text-[10px] text-slate-500">Compared to free-flow baseline</div>
          </div>
        </div>
      </div>

      {/* CHARTS GRID 1: SPEED BY ROAD & CONGESTION DONUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BAR CHART: AVERAGE SPEED BY ROAD */}
        <div className="lg:col-span-8 bg-[#131b2a] p-4 rounded-xl border border-slate-800">
          <h3 className="font-bold text-sm text-slate-100 mb-1">Average Speed vs Free Flow Speed by Corridor</h3>
          <p className="text-[11px] text-slate-400 mb-4">Comparing operational speeds against design capacity limits (km/h)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roadSpeedData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="km/h" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px', color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Bar dataKey="speed" name="Current Speed" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="freeFlow" name="Free Flow Capacity" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DONUT CHART: CONGESTION DISTRIBUTION */}
        <div className="lg:col-span-4 bg-[#131b2a] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-100 mb-1">Congestion Level Distribution</h3>
            <p className="text-[11px] text-slate-400 mb-2">Percentage breakdown of traffic congestion states</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={congestionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {congestionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px', color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS GRID 2: HOURLY VOLUME LINE & AREA DENSITY BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LINE CHART: TRAFFIC BY HOUR */}
        <div className="lg:col-span-7 bg-[#131b2a] p-4 rounded-xl border border-slate-800">
          <h3 className="font-bold text-sm text-slate-100 mb-1">Vehicle Volume Density by Hour</h3>
          <p className="text-[11px] text-slate-400 mb-4">Total vehicle throughput across all sensor points</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} interval={2} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px', color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="volume" name="Vehicles / Hour" stroke="#a855f7" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR CHART: TRAFFIC BY AREA */}
        <div className="lg:col-span-5 bg-[#131b2a] p-4 rounded-xl border border-slate-800">
          <h3 className="font-bold text-sm text-slate-100 mb-1">Monitored Corridors by Area</h3>
          <p className="text-[11px] text-slate-400 mb-4">Distribution of telemetry points across Mumbai zones</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="area" type="category" stroke="#64748b" tick={{ fontSize: 10 }} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px', color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" name="Monitored Roads" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
