import React from 'react';
import { Network, Database, Cpu, HardDrive, Terminal, ShieldCheck, Layers, BookOpen } from 'lucide-react';

export default function AboutArchitecture() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100">Architecture & BDA Syllabus Alignment</h2>
        <p className="text-xs text-slate-400">BE Computer Engineering Semester VII - Big Data Analytics Mini Project Specification</p>
      </div>

      {/* VISUAL ARCHITECTURE FLOW DIAGRAM */}
      <div className="bg-[#131b2a] p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          End-to-End System Architecture
        </h3>

        <div className="p-6 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
          <div className="min-w-[700px] flex flex-col items-center gap-6 font-mono text-xs">
            {/* Layer 1: Ingestion */}
            <div className="w-full flex items-center justify-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-bold">
                TRAFFIC TELEMETRY SOURCE
                <div className="text-[10px] text-cyan-400 font-normal">TomTom API / Simulated Telemetry Generator</div>
              </div>
              <span className="text-cyan-400 text-base">↓</span>
              <div className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                FASTAPI INGESTION ENGINE
                <div className="text-[10px] text-slate-300 font-normal">Validation & Geographic Sanitization</div>
              </div>
            </div>

            <span className="text-cyan-400 text-base">↓</span>

            {/* Layer 2: Streaming Filters */}
            <div className="w-full flex items-center justify-center gap-6">
              <div className="px-4 py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-center">
                BLOOM FILTER
                <div className="text-[10px] text-slate-300 font-normal">O(1) Duplicate Event Detection</div>
              </div>
              <div className="px-4 py-2.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-center">
                FLAJOLET-MARTIN
                <div className="text-[10px] text-slate-300 font-normal">Streaming Unique Count Estimation</div>
              </div>
            </div>

            <span className="text-cyan-400 text-base">↓</span>

            {/* Layer 3: Storage & Analytics */}
            <div className="w-full grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-bold">
                MONGODB
                <div className="text-[10px] text-slate-300 font-normal">Real-Time Document Database</div>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-center font-bold">
                MAPREDUCE & HIVE
                <div className="text-[10px] text-slate-300 font-normal">Parallel Aggregation & Queries</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-center font-bold">
                HDFS RAW STORAGE
                <div className="text-[10px] text-slate-300 font-normal">Distributed Partition Files</div>
              </div>
            </div>

            <span className="text-cyan-400 text-base">↓</span>

            {/* Layer 4: Frontend */}
            <div className="w-full p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-slate-700 text-center font-bold text-slate-100">
              REACT + VITE + LEAFLET + RECHARTS COMMAND CENTER DASHBOARD
            </div>
          </div>
        </div>
      </div>

      {/* WHY BIG DATA? 3 V'S SECTION */}
      <div className="bg-[#131b2a] p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Why Traffic Telemetry is Big Data: The 3 V's
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="font-bold text-cyan-400 text-sm">1. Volume</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thousands of GPS sensors, BEST buses, cabs, traffic cameras, and navigation apps produce over 125,000 telemetry records daily across Mumbai's 2,000+ km road network.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="font-bold text-amber-400 text-sm">2. Velocity</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traffic data is continuously streamed every few seconds. Real-time processing is required to compute live congestion, delay estimates, and active bottlenecks.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="font-bold text-emerald-400 text-sm">3. Variety</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Telemetry arrives in multiple formats: structured GPS coordinates, semi-structured JSON API responses, unstructured incident text logs, and spatial graph road networks.
            </p>
          </div>
        </div>
      </div>

      {/* BDA SYLLABUS MAPPING TABLE */}
      <div className="bg-[#131b2a] p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          BDA Syllabus Concept Implementation Mapping
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <th className="py-2.5 px-4">Syllabus Module</th>
                <th className="py-2.5 px-4">Project Application</th>
                <th className="py-2.5 px-4">Implementation Location</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="py-2.5 px-4 font-bold text-cyan-400">MongoDB</td>
                <td className="py-2.5 px-4 font-sans">Operational telemetry document storage</td>
                <td className="py-2.5 px-4">backend/app/database.py</td>
                <td className="py-2.5 px-4 text-center text-emerald-400 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-cyan-400">Bloom Filter</td>
                <td className="py-2.5 px-4 font-sans">Duplicate telemetry event detection</td>
                <td className="py-2.5 px-4">backend/app/algorithms/bloom_filter.py</td>
                <td className="py-2.5 px-4 text-center text-emerald-400 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-cyan-400">Flajolet-Martin</td>
                <td className="py-2.5 px-4 font-sans">Unique stream cardinality estimation</td>
                <td className="py-2.5 px-4">backend/app/algorithms/flajolet_martin.py</td>
                <td className="py-2.5 px-4 text-center text-emerald-400 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-cyan-400">MapReduce</td>
                <td className="py-2.5 px-4 font-sans">Parallel road speed aggregation</td>
                <td className="py-2.5 px-4">backend/app/algorithms/mapreduce_engine.py</td>
                <td className="py-2.5 px-4 text-center text-emerald-400 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-cyan-400">Hive</td>
                <td className="py-2.5 px-4 font-sans">Historical data warehousing SQL queries</td>
                <td className="py-2.5 px-4">backend/app/algorithms/hive_simulator.py</td>
                <td className="py-2.5 px-4 text-center text-emerald-400 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-cyan-400">HDFS</td>
                <td className="py-2.5 px-4 font-sans">Raw historical partition file storage</td>
                <td className="py-2.5 px-4">data/raw/traffic_2026_10_06.json</td>
                <td className="py-2.5 px-4 text-center text-emerald-400 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-cyan-400">Graph Analytics</td>
                <td className="py-2.5 px-4 font-sans">Girvan-Newman community detection</td>
                <td className="py-2.5 px-4">backend/app/algorithms/graph_analyzer.py</td>
                <td className="py-2.5 px-4 text-center text-emerald-400 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-cyan-400">R Analytics</td>
                <td className="py-2.5 px-4 font-sans">Statistical density scatter visualization</td>
                <td className="py-2.5 px-4">r-analytics/traffic_analysis.R</td>
                <td className="py-2.5 px-4 text-center text-emerald-400 font-bold">Implemented</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
