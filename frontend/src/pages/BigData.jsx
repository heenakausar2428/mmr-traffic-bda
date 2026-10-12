import React, { useState } from 'react';
import BdaDetailsModal from '../components/BdaDetailsModal';
import { Database, HardDrive, Cpu, Terminal, Filter, Activity, BarChart2, CheckCircle2 } from 'lucide-react';

const bdaConcepts = [
  {
    id: 'bloom',
    title: 'Bloom Filter',
    tech: 'Probabilistic Data Structure',
    desc: 'Space-efficient duplicate traffic telemetry event detection with zero false negatives.',
    status: 'Active',
    icon: Filter,
    color: 'cyan',
    endpoint: '/api/algorithms/bloom'
  },
  {
    id: 'fm',
    title: 'Flajolet-Martin Algorithm',
    tech: 'Streaming Cardinality Estimation',
    desc: 'Sub-linear memory estimation of unique distinct traffic telemetry events using binary trailing zeros.',
    status: 'Active',
    icon: Activity,
    color: 'purple',
    endpoint: '/api/algorithms/fm'
  },
  {
    id: 'mapreduce',
    title: 'MapReduce Engine',
    tech: 'Parallel Data Aggregation',
    desc: 'Parallel Mapper, Shuffle/Sort, and Reducer pipeline for calculating average road speeds.',
    status: 'Processed',
    icon: Cpu,
    color: 'amber',
    endpoint: '/api/algorithms/mapreduce'
  },
  {
    id: 'hive',
    title: 'Hive SQL Analytics',
    tech: 'Data Warehousing',
    desc: 'Historical SQL queries executed over partitioned Hadoop traffic datasets.',
    status: 'Available',
    icon: Terminal,
    color: 'emerald',
    endpoint: '/api/algorithms/hive'
  },
  {
    id: 'hdfs',
    title: 'HDFS Distributed Storage',
    tech: 'Distributed File System',
    desc: 'Append-only raw traffic dataset storage across 128 MB blocks with 3x replication factor.',
    status: 'Available',
    icon: HardDrive,
    color: 'blue',
    endpoint: '/api/hdfs/files'
  },
  {
    id: 'mongodb',
    title: 'MongoDB NoSQL Store',
    tech: 'Document Database',
    desc: 'Real-time operational store for telemetry snapshots, road coordinates, and active incidents.',
    status: 'Connected',
    icon: Database,
    color: 'emerald',
    endpoint: '/api/analytics/summary'
  },
  {
    id: 'r',
    title: 'R Statistical Analytics',
    tech: 'R + ggplot2 Renderer',
    desc: 'Statistical density, boxplot distributions, and regression charts generated using R scripts.',
    status: 'Available',
    icon: BarChart2,
    color: 'purple',
    endpoint: null
  }
];

export default function BigData() {
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleViewDetails = async (concept) => {
    setSelectedConcept(concept);
    if (!concept.endpoint) return;

    setLoading(true);
    try {
      const res = await fetch(concept.endpoint);
      const data = await res.json();
      setModalData(data);
    } catch (err) {
      console.error('Error fetching BDA details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-100">Big Data Analytics (BDA) Modules</h2>
        <p className="text-xs text-slate-400">BE Computer Engineering Semester VII syllabus concepts implemented for Mumbai Traffic Intelligence</p>
      </div>

      {/* BDA CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bdaConcepts.map((concept) => {
          const Icon = concept.icon;

          return (
            <div
              key={concept.id}
              className="p-5 rounded-xl bg-[#131b2a] border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    {concept.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-100">{concept.title}</h3>
                <span className="text-[11px] font-semibold text-cyan-400 font-mono block mb-2">{concept.tech}</span>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{concept.desc}</p>
              </div>

              <button
                onClick={() => handleViewDetails(concept)}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold transition-all flex items-center justify-center gap-2 group-hover:text-cyan-400"
              >
                <span>View Details</span>
                <span className="text-cyan-400">→</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL DRAWER */}
      {selectedConcept && (
        <BdaDetailsModal
          concept={selectedConcept}
          data={modalData}
          onClose={() => {
            setSelectedConcept(null);
            setModalData(null);
          }}
        />
      )}
    </div>
  );
}
