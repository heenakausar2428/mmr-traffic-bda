import networkx as nx
from typing import List, Dict, Any

class RoadNetworkAnalyzer:
    """
    Graph Network Analysis for Mumbai Road Network using NetworkX.
    Models major intersections as Nodes, connecting road links as Edges,
    and computes dynamic Girvan-Newman community detection clusters.
    """

    @staticmethod
    def build_mumbai_graph():
        G = nx.Graph()

        # Nodes (Intersections / Key Transit Hubs)
        intersections = [
            {"id": "N1", "label": "Bandra Reclamation Interchange", "area": "Western Mumbai", "lat": 19.0435, "lng": 72.8465},
            {"id": "N2", "label": "Andheri Chakala Metro Junction", "area": "Western Mumbai", "lat": 19.1197, "lng": 72.8464},
            {"id": "N3", "label": "Kalanagar Junction (BKC Entrance)", "area": "Western Mumbai", "lat": 19.0623, "lng": 72.8612},
            {"id": "N4", "label": "Dadar TT Circle", "area": "South Mumbai", "lat": 19.0189, "lng": 72.8432},
            {"id": "N5", "label": "Sion Circle Flyover", "area": "Central Mumbai", "lat": 19.0465, "lng": 72.8682},
            {"id": "N6", "label": "Kurla SCLR Junction", "area": "Central Mumbai", "lat": 19.0734, "lng": 72.8789},
            {"id": "N7", "label": "Ghatkopar EEH Junction", "area": "Eastern Mumbai", "lat": 19.1023, "lng": 72.9095},
            {"id": "N8", "label": "Powai JVLR Junction", "area": "Eastern Mumbai", "lat": 19.1235, "lng": 72.8812},
            {"id": "N9", "label": "Vashi Toll Naka Bridge", "area": "Navi Mumbai", "lat": 19.0612, "lng": 72.9982},
            {"id": "N10", "label": "Belapur CBD Highway Hub", "area": "Navi Mumbai", "lat": 19.0215, "lng": 73.0645},
            {"id": "N11", "label": "Chembur Naka Interchange", "area": "Eastern Mumbai", "lat": 19.0612, "lng": 72.8890},
            {"id": "N12", "label": "Worli Naka Coastal Entrance", "area": "South Mumbai", "lat": 19.0089, "lng": 72.8123}
        ]

        for n in intersections:
            G.add_node(n["id"], label=n["label"], area=n["area"], lat=n["lat"], lng=n["lng"])

        # Edges (Road Segment connections)
        edges = [
            ("N1", "N2", {"name": "Western Express Highway", "weight": 8.5}),
            ("N1", "N3", {"name": "SV Road Link", "weight": 2.1}),
            ("N1", "N4", {"name": "Bandra-Worli Sea Link", "weight": 5.6}),
            ("N1", "N12", {"name": "Coastal Road Extension", "weight": 4.2}),
            ("N2", "N8", {"name": "JVLR Corridor", "weight": 6.8}),
            ("N3", "N6", {"name": "BKC Connector", "weight": 3.4}),
            ("N4", "N5", {"name": "DR Ambedkar Road", "weight": 2.8}),
            ("N5", "N6", {"name": "LBS Marg North", "weight": 3.2}),
            ("N5", "N11", {"name": "Eastern Freeway Link", "weight": 4.1}),
            ("N6", "N7", {"name": "SCLR Extension", "weight": 4.5}),
            ("N7", "N8", {"name": "EEH Ghatkopar Link", "weight": 5.0}),
            ("N7", "N11", {"name": "LBS Eastern Link", "weight": 3.9}),
            ("N11", "N9", {"name": "Sion-Panvel Highway", "weight": 11.2}),
            ("N9", "N10", {"name": "Palm Beach Corridor", "weight": 9.4})
        ]

        for u, v, data in edges:
            G.add_edge(u, v, name=data["name"], weight=data["weight"])

        return G, intersections

    @classmethod
    def analyze_network(cls) -> Dict[str, Any]:
        G, intersections = cls.build_mumbai_graph()

        # Degree Centrality
        degree_centrality = nx.degree_centrality(G)
        betweenness = nx.betweenness_centrality(G)

        # Girvan-Newman Community Detection Algorithm
        # Progressively removes edges with highest edge betweenness centrality to split graph into communities
        comp = nx.community.girvan_newman(G)
        # Get first partition (top 3 communities)
        first_tuple = tuple(sorted(c) for c in next(comp))
        
        # If possible, get a 3-community split if available
        if len(first_tuple) < 3:
            try:
                second_tuple = tuple(sorted(c) for c in next(comp))
                communities = second_tuple
            except StopIteration:
                communities = first_tuple
        else:
            communities = first_tuple

        community_list = []
        community_names = ["Western Corridor Cluster", "Central & Eastern Corridor Cluster", "Harbour & Navi Mumbai Cluster", "South Mumbai Cluster"]
        
        node_community_map = {}
        for idx, comm in enumerate(communities):
            comm_name = community_names[idx % len(community_names)]
            comm_nodes = list(comm)
            community_list.append({
                "community_id": idx + 1,
                "name": comm_name,
                "nodes_count": len(comm_nodes),
                "member_node_ids": comm_nodes
            })
            for node_id in comm_nodes:
                node_community_map[node_id] = idx + 1

        # Format node output
        nodes_output = []
        for n in intersections:
            n_id = n["id"]
            nodes_output.append({
                "id": n_id,
                "label": n["label"],
                "area": n["area"],
                "lat": n["lat"],
                "lng": n["lng"],
                "degree": G.degree(n_id),
                "degree_centrality": round(degree_centrality[n_id], 3),
                "betweenness_centrality": round(betweenness[n_id], 3),
                "community_id": node_community_map.get(n_id, 1)
            })

        # Sort by most connected / highest degree centrality
        most_connected = sorted(nodes_output, key=lambda x: x["betweenness_centrality"], reverse=True)

        edges_output = []
        for u, v, data in G.edges(data=True):
            edges_output.append({
                "source": u,
                "target": v,
                "road_name": data.get("name", "Road Link"),
                "distance_km": data.get("weight", 1.0)
            })

        return {
            "total_nodes": G.number_of_nodes(),
            "total_edges": G.number_of_edges(),
            "graph_density": round(nx.density(G), 3),
            "algorithm": "Girvan-Newman Community Detection",
            "communities_count": len(communities),
            "communities": community_list,
            "nodes": nodes_output,
            "edges": edges_output,
            "most_connected_hubs": most_connected[:5],
            "status": "Processed"
        }
