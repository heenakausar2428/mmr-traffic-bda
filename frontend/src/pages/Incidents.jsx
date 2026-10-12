import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Construction, Droplets, Car, Clock, MapPin } from 'lucide-react';
import MumbaiMap from '../components/MumbaiMap';

export default function Incidents({ incidents = [], roads = [] }) {
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredIncidents = incidents.filter(inc => {
    const matchSev = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchType = typeFilter === 'ALL' || inc.type === typeFilter;
    return matchSev && matchType;
  });

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'ACCIDENT':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'CONSTRUCTION':
        return <Construction className="w-5 h-5 text-amber-400" />;
      case 'WATERLOGGING':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      default:
        return <Car className="w-5 h-5 text-orange-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Incident Command Center</h2>
          <p className="text-xs text-slate-400">Real-time traffic blockages, accidents, construction works, and monsoon waterlogging reports</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Incident Types</option>
            <option value="ACCIDENT">Accident</option>
            <option value="CONSTRUCTION">Construction</option>
            <option value="WATERLOGGING">Waterlogging</option>
            <option value="SLOW_TRAFFIC">Slow Traffic</option>
          </select>
        </div>
      </div>

      {/* MAP & INCIDENTS FEED SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TOMTOM MAP VIEW WITH INCIDENT MARKERS */}
        <div className="lg:col-span-7 bg-[#131b2a] p-4 rounded-xl border border-slate-800">
          <h3 className="font-bold text-sm text-slate-100 mb-3 flex items-center gap-2">
            Incident Geospatial Map Locations
            <span className="text-xs font-mono text-cyan-400">({filteredIncidents.length} Markers)</span>
          </h3>
          <div className="h-[480px]">
            <MumbaiMap roads={roads} incidents={filteredIncidents} />
          </div>
        </div>

        {/* INCIDENTS CARDS LIST */}
        <div className="lg:col-span-5 bg-[#131b2a] p-4 rounded-xl border border-slate-800 flex flex-col h-[520px]">
          <h3 className="font-bold text-sm text-slate-100 mb-3">
            Active Incident Reports
          </h3>

          <div className="overflow-y-auto space-y-3 pr-1 flex-1">
            {filteredIncidents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                No active incidents matching selected filters
              </div>
            ) : (
              filteredIncidents.map((inc) => {
                let sevBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                if (inc.severity === 'CRITICAL' || inc.severity === 'HIGH') {
                  sevBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                }

                return (
                  <div
                    key={inc.incident_id || inc.description}
                    className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getIncidentIcon(inc.type)}
                        <span className="font-bold text-xs text-slate-200">{inc.type}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border font-mono ${sevBadge}`}>
                        {inc.severity} Severity
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {inc.road_name} ({inc.area})
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug">
                      {inc.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Reported: {inc.reported_time || '10:42 PM'}
                      </span>
                      <span className="text-emerald-400 font-bold uppercase">● {inc.status}</span>
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
