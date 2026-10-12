import networkx as nx
from collections import defaultdict

class CliquePercolationMethod:
    """
    Clique Percolation Method (CPM) for detecting overlapping communities in road networks.
    Finds k-cliques and percolates adjacent cliques sharing (k-1) nodes.
    """
    def __init__(self, graph: nx.Graph = None):
        if graph is not None:
            self.graph = graph
        else:
            self._load_default_mumbai_graph()

    def _load_default_mumbai_graph(self):
        self.graph = nx.Graph()
        mumbai_triangles_and_edges = [
            # Triangle 1: Bandra - Santacruz - Kurla
            ("Bandra (Kalanagar)", "Santacruz (SV Road)"),
            ("Santacruz (SV Road)", "Kurla (BKC)"),
            ("Kurla (BKC)", "Bandra (Kalanagar)"),
            # Triangle 2: Sion - Kurla - Ghatkopar
            ("Sion Circle", "Kurla (LBS)"),
            ("Kurla (LBS)", "Ghatkopar Junction"),
            ("Ghatkopar Junction", "Sion Circle"),
            # Triangle 3: Andheri - Jogeshwari - Powai
            ("Andheri (Airport)", "Jogeshwari (WEH)"),
            ("Jogeshwari (WEH)", "Powai (JVLR)"),
            ("Powai (JVLR)", "Andheri (Airport)"),
            # Overlapping connectors
            ("Bandra (Kalanagar)", "Sion Circle"),
            ("Santacruz (SV Road)", "Andheri (Airport)"),
            ("Powai (JVLR)", "Vikhroli (EEH)"),
            ("Vikhroli (EEH)", "Ghatkopar Junction"),
            ("Sion Circle", "Vashi Toll Plaza"),
            ("Vashi Toll Plaza", "CBD Belapur"),
            ("Nariman Point", "Worli Sea Face"),
            ("Worli Sea Face", "Bandra (Kalanagar)")
        ]
        for u, v in mumbai_triangles_and_edges:
            self.graph.add_edge(u, v)

    def find_overlapping_communities(self, k: int = 3):
        """
        Finds k-clique communities using CPM algorithm.
        """
        # Find all maximal cliques
        cliques = [set(c) for c in nx.find_cliques(self.graph) if len(c) >= k]
        
        # Build clique adjacency graph where cliques sharing >= (k-1) nodes are connected
        clique_graph = nx.Graph()
        clique_graph.add_nodes_from(range(len(cliques)))
        
        for i in range(len(cliques)):
            for j in range(i + 1, len(cliques)):
                if len(cliques[i].intersection(cliques[j])) >= (k - 1):
                    clique_graph.add_edge(i, j)
                    
        # Connected components in clique graph correspond to CPM communities
        cpm_communities = []
        for component in nx.connected_components(clique_graph):
            community_nodes = set()
            for clique_idx in component:
                community_nodes.update(cliques[clique_idx])
            cpm_communities.append(list(community_nodes))
            
        # Identify overlapping nodes (nodes present in > 1 community)
        node_community_count = defaultdict(int)
        for comm in cpm_communities:
            for node in comm:
                node_community_count[node] += 1
                
        overlapping_nodes = [node for node, count in node_community_count.items() if count > 1]
        
        return {
            "k_value": k,
            "total_k_cliques_found": len(cliques),
            "cliques_list": [list(c) for c in cliques],
            "num_cpm_communities": len(cpm_communities),
            "communities": cpm_communities,
            "overlapping_junctions": overlapping_nodes
        }
