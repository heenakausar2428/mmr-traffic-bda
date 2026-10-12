import React from 'react';
import { X, Cpu, Database, Server, GitMerge, FileCode, CheckCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BdaDetailsModal({ concept, data, onClose }) {
  if (!concept) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#131b2a] border border-slate-700 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 relative space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-slate-800 hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{concept.title} Pipeline Details</h3>
            <p className="text-xs text-slate-400">{concept.subtitle}</p>
          </div>
        </div>

        {/* BLOOM FILTER DETAILS VIEW */}
        {concept.id === 'bloom' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <div className="text-slate-400 text-[10px] uppercase">Total Events</div>
                <div className="text-lg font-bold text-slate-100 mt-1">{(data?.total_events_processed || 125430).toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <div className="text-slate-400 text-[10px] uppercase">Possible Duplicates</div>
                <div className="text-lg font-bold text-amber-400 mt-1">{(data?.possible_duplicates_detected || 2341).toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <div className="text-slate-400 text-[10px] uppercase">Est. False Positive Rate</div>
                <div className="text-lg font-bold text-cyan-400 mt-1">{data?.estimated_false_positive_rate || 0.012}%</div>
              </div>
            </div>

            {/* Architecture Diagram */}
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-semibold text-slate-300 text-xs">Bloom Filter Execution Flow:</div>
              <div className="flex items-center justify-center gap-2 font-mono text-[11px]">
                <span className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  Incoming Telemetry Stream
                </span>
                <span className="text-cyan-400">→</span>
                <span className="px-3 py-1.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold">
                  Bloom Filter (10,000 bits, 3 Hashes)
                </span>
                <span className="text-cyan-400">→</span>
                <span className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold">
                  New Event / Duplicate Flag
                </span>
              </div>
            </div>

            {/* Sample Bit Array Rendering */}
            <div>
              <div className="font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Bit Array State Visualization (First 100 Bits)</span>
                <span className="font-mono text-[10px] text-cyan-400">Filled: {data?.fill_ratio_percent || 14.5}%</span>
              </div>
              <div className="grid grid-cols-20 gap-1 bg-slate-950 p-3 rounded-lg border border-slate-800">
                {(data?.sample_bit_array || Array(100).fill(0).map((_, i) => i % 3 === 0 ? 1 : 0)).map((bit, idx) => (
                  <span
                    key={idx}
                    className={`h-4 rounded-[2px] flex items-center justify-center text-[9px] font-mono ${
                      bit === 1 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-700'
                    }`}
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FLAJOLET-MARTIN DETAILS VIEW */}
        {concept.id === 'fm' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <div className="text-slate-400 text-[10px] uppercase">Actual Distinct Events</div>
                <div className="text-lg font-bold text-slate-100 mt-1">{(data?.actual_distinct_events || 98421).toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <div className="text-slate-400 text-[10px] uppercase">FM Estimated Events</div>
                <div className="text-lg font-bold text-purple-400 mt-1">{(data?.fm_estimated_events || 96874).toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <div className="text-slate-400 text-[10px] uppercase">Estimation Error</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">{data?.estimation_error_percent || 1.57}%</div>
              </div>
            </div>

            {/* Comparison Bar Chart */}
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <div className="font-semibold text-slate-300 mb-3">Actual vs FM Estimated Cardinality Comparison</div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Actual Count', count: data?.actual_distinct_events || 98421, fill: '#38bdf8' },
                    { name: 'FM Algorithm Estimate', count: data?.fm_estimated_events || 96874, fill: '#a855f7' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300">
              <div>Correction Factor $\phi$: 0.77351</div>
              <div>Max Trailing Zeros $R$ per Hash: [16, 17, 16, 15]</div>
              <p className="text-[10px] text-slate-400 mt-1">
                Note: Flajolet-Martin is a streaming probabilistic algorithm that estimates cardinality in $O(1)$ space using binary bit operations.
              </p>
            </div>
          </div>
        )}

        {/* MAPREDUCE DETAILS VIEW */}
        {concept.id === 'mapreduce' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 font-mono">
              <div className="text-cyan-400 font-bold">Job ID: {data?.job_id || 'MR-JOB-MUMBAI-SPEED'}</div>
              <div className="text-slate-400">Input Records: {data?.input_records_count || 125430} | Mapper Pairs: {data?.mapper_output_count || 125430}</div>
            </div>

            {/* Pipeline Stage Visualizer */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-cyan-400 mb-2">1. Mapper Phase</div>
                <div className="space-y-1 font-mono text-[10px] text-slate-300">
                  {(data?.mapper_sample || [
                    { key: "Western Express Highway", value: 31.4 },
                    { key: "LBS Marg", value: 22.0 }
                  ]).map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-1.5 rounded">
                      ({item.key}, {item.value})
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-amber-400 mb-2">2. Shuffle & Sort</div>
                <div className="space-y-1 font-mono text-[10px] text-slate-300">
                  {Object.entries(data?.shuffle_sort_sample || { "Western Express Highway": [31.4, 30.5, 32.1] }).map(([key, vals], idx) => (
                    <div key={idx} className="bg-slate-950 p-1.5 rounded truncate">
                      {key}: [{vals.join(', ')}]
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-emerald-400 mb-2">3. Reducer Output</div>
                <div className="space-y-1 font-mono text-[10px] text-slate-300">
                  {(data?.reducer_results || []).slice(0, 3).map((res, idx) => (
                    <div key={idx} className="bg-slate-950 p-1.5 rounded">
                      {res.road_name}: {res.avg_speed_kmh} km/h
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HIVE DETAILS VIEW */}
        {concept.id === 'hive' && (
          <div className="space-y-4 text-xs font-mono">
            {(data?.queries || []).map((q, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-sans font-bold text-cyan-400 text-sm">{q.title}</div>
                <div className="bg-slate-950 p-2.5 rounded text-slate-200 text-[11px] overflow-x-auto">
                  {q.sql}
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Execution Time: {q.execution_time_ms} ms</span>
                  <span>Rows Returned: {q.rows_returned}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HDFS DETAILS VIEW */}
        {concept.id === 'hdfs' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-cyan-400 font-bold text-sm">HDFS Cluster Configuration</div>
              <div>Namenode: {data?.namenode || 'hdfs://namenode.mumbai-traffic.local:9000'}</div>
              <div>Block Size: {data?.block_size || '128 MB'} | Replication Factor: {data?.replication_factor || 3}</div>
            </div>

            <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-3">Filename</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Records</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {(data?.raw_datasets || []).map((file, idx) => (
                    <tr key={idx}>
                      <td className="p-3 text-cyan-400 font-bold">{file.filename}</td>
                      <td className="p-3">{file.size}</td>
                      <td className="p-3">{file.records_count.toLocaleString()}</td>
                      <td className="p-3 text-emerald-400">{file.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium"
          >
            Close Pipeline Details
          </button>
        </div>
      </div>
    </div>
  );
}
