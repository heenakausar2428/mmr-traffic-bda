import networkx as nx

class GirvanNewmanAnalyzer:
    """
    Girvan-Newman algorithm implementation for Mumbai road network community detection.
    Iteratively removes edges with highest edge betweenness centrality to split the graph.
    """
    def __init__(self, edges=None):
        self.graph = nx.Graph()
        if edges:
            for u, v, weight in edges:
                self.graph.add_edge(u, v, weight=weight)
        else:
            # Default authentic Mumbai road network graph
            self._load_default_mumbai_graph()

    def _load_default_mumbai_graph(self):
        mumbai_edges = [
            ("Bandra (Kalanagar)", "Andheri (Airport)", 8.5),
            ("Andheri (Airport)", "Borivali (Magathane)", 12.0),
            ("Sion Circle", "Ghatkopar Junction", 7.2),
            ("Ghatkopar Junction", "Thane (Teen Hath)", 14.5),
            ("Sion Circle", "Vashi Toll Plaza", 11.8),
            ("Sion Circle", "Kurla (LBS)", 3.5),
            ("Kurla (LBS)", "Ghatkopar Junction", 4.5),
            ("Bandra (Kalanagar)", "Santacruz (SV Road)", 3.0),
            ("Santacruz (SV Road)", "Andheri (Airport)", 6.2),
            ("Bandra (Kalanagar)", "Kurla (BKC)", 4.5),
            ("Jogeshwari (WEH)", "Powai (JVLR)", 5.0),
            ("Powai (JVLR)", "Vikhroli (EEH)", 5.6),
            ("Santacruz (WEH)", "Chembur (SCLR)", 6.4),
            ("Vashi Toll Plaza", "CBD Belapur", 10.0),
            ("Nariman Point", "Worli Sea Face", 9.8),
            ("Worli Sea Face", "Bandra (Kalanagar)", 4.2),
            ("Chembur (SCLR)", "Ghatkopar Junction", 3.0),
        ]
        for u, v, w in mumbai_edges:
            self.graph.add_edge(u, v, weight=w)

    def run_community_detection(self, num_communities: int = 3):
        """
        Executes Girvan-Newman step by step until desired number of communities are found.
        Returns list of community node sets and removed bottleneck edges.
        """
        G = self.graph.copy()
        removed_edges = []
        
        while G.number_of_edges() > 0:
            components = list(nx.connected_components(G))
            if len(components) >= num_communities:
                break
                
            # Calculate edge betweenness centrality
            betweenness = nx.edge_betweenness_centrality(G)
            max_edge = max(betweenness, key=betweenness.get)
            
            removed_edges.append({
                "source": max_edge[0],
                "target": max_edge[1],
                "betweenness_score": round(betweenness[max_edge], 4)
            })
            
            G.remove_edge(*max_edge)
            
        final_communities = [list(c) for c in nx.connected_components(G)]
        
        # Calculate modularity of partition
        modularity = round(nx.community.modularity(self.graph, [set(c) for c in final_communities]), 4)
        
        return {
            "num_communities_found": len(final_communities),
            "communities": final_communities,
            "removed_bottleneck_edges": removed_edges,
            "modularity_score": modularity,
            "total_nodes": self.graph.number_of_nodes(),
            "total_edges": self.graph.number_of_edges()
        }
