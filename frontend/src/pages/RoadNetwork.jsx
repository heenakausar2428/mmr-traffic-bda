import React, { useState, useEffect } from 'react';
import { Network, GitBranch, Layers, ShieldCheck, RefreshCw } from 'lucide-react';

export default function RoadNetwork() {
  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/graph/network')
      .then(res => res.json())
      .then(data => {
        setNetworkData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !networkData) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
        Executing NetworkX Girvan-Newman Graph Community Detection...
      </div>
    );
  }

  const communityColors = [
    'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    'bg-purple-500/20 text-purple-400 border-purple-500/40',
    'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    'bg-amber-500/20 text-amber-400 border-amber-500/40'
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-100">Road Network Intelligence & Graph Analytics</h2>
        <p className="text-xs text-slate-400">Graph modeling of Mumbai intersections (Nodes) and road links (Edges) with Girvan-Newman Community Detection</p>
      </div>

      {/* GRAPH METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-[#131b2a] border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-sans font-semibold">Total Graph Nodes</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{networkData.total_nodes} Intersections</div>
          <div className="text-[10px] text-slate-500 font-sans mt-0.5">Major transit hubs</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131b2a] border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-sans font-semibold">Total Graph Edges</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{networkData.total_edges} Road Segments</div>
          <div className="text-[10px] text-slate-500 font-sans mt-0.5">Interconnecting corridors</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131b2a] border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-sans font-semibold">Graph Density</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{networkData.graph_density}</div>
          <div className="text-[10px] text-slate-500 font-sans mt-0.5">Network connectivity index</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131b2a] border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-sans font-semibold">Communities Detected</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{networkData.communities_count} Clusters</div>
          <div className="text-[10px] text-slate-500 font-sans mt-0.5">Girvan-Newman Algorithm</div>
        </div>
      </div>

      {/* GIRVAN-NEWMAN COMMUNITIES BREAKDOWN */}
      <div className="bg-[#131b2a] p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              Girvan-Newman Edge Betweenness Communities
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                NetworkX Community Detection
              </span>
            </h3>
            <p className="text-xs text-slate-400">Iterative removal of edges with highest betweenness centrality partitions Mumbai into spatial sub-networks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(networkData.communities || []).map((comm, idx) => (
            <div key={comm.community_id} className={`p-4 rounded-lg border space-y-2 ${communityColors[idx % communityColors.length]}`}>
              <div className="flex items-center justify-between font-mono text-xs font-bold">
                <span>Community #{comm.community_id}</span>
                <span>{comm.nodes_count} Nodes</span>
              </div>
              <div className="font-sans font-bold text-slate-100 text-sm">{comm.name}</div>
              <div className="text-[11px] text-slate-300 font-mono">
                Nodes: {comm.member_node_ids.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INTERSECTION CENTRALITY DIRECTORY TABLE */}
      <div className="bg-[#131b2a] p-5 rounded-xl border border-slate-800 space-y-3">
        <h3 className="font-bold text-sm text-slate-100">Intersection Hub Centrality Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <th className="py-2.5 px-3">Node ID</th>
                <th className="py-2.5 px-3">Intersection Name</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3 text-right">Degree</th>
                <th className="py-2.5 px-3 text-right">Betweenness Centrality</th>
                <th className="py-2.5 px-3 text-center">Community Cluster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {(networkData.nodes || []).map((node) => (
                <tr key={node.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">{node.id}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-200">{node.label}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-400">{node.area}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-100">{node.degree}</td>
                  <td className="py-2.5 px-3 text-right text-purple-400">{node.betweenness_centrality}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      Community #{node.community_id}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
