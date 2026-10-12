from typing import List, Dict, Any

class HiveSimulator:
    """
    Hive SQL Simulator demonstrating data warehousing queries over historical traffic datasets.
    """
    
    @staticmethod
    def run_predefined_queries(traffic_records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Executes key Hive analytics queries over current records dataset.
        """
        # Query 1: SELECT road_name, AVG(current_speed_kmh) FROM traffic_records GROUP BY road_name
        road_speeds = {}
        road_counts = {}
        for r in traffic_records:
            road = r.get("road_name", "Unknown")
            speed = r.get("current_speed_kmh", 0.0)
            road_speeds[road] = road_speeds.get(road, 0.0) + speed
            road_counts[road] = road_counts.get(road, 0) + 1
            
        q1_results = [
            {"road_name": road, "avg_speed_kmh": round(road_speeds[road] / road_counts[road], 1)}
            for road in road_speeds
        ]
        q1_results.sort(key=lambda x: x["avg_speed_kmh"])

        # Query 2: SELECT area, COUNT(*) as incident_susceptibility FROM traffic_records WHERE congestion_level = 'HIGH' or 'SEVERE' GROUP BY area
        area_congestion = {}
        for r in traffic_records:
            if r.get("congestion_level") in ["HIGH", "SEVERE"]:
                area = r.get("area", "Other")
                area_congestion[area] = area_congestion.get(area, 0) + 1

        q2_results = [
            {"area": area, "congested_events": count}
            for area, count in sorted(area_congestion.items(), key=lambda x: x[1], reverse=True)
        ]

        return {
            "hive_version": "Hive 3.1.3 (Simulated Engine)",
            "warehouse_location": "/user/hive/warehouse/mumbai_traffic.db/",
            "queries": [
                {
                    "id": "HIVE-Q1",
                    "title": "Average Speed by Road Corridor",
                    "sql": "SELECT road_name, AVG(current_speed_kmh) AS avg_speed FROM mumbai_traffic.traffic_records GROUP BY road_name ORDER BY avg_speed ASC;",
                    "execution_time_ms": 142,
                    "rows_returned": len(q1_results),
                    "results": q1_results[:8]
                },
                {
                    "id": "HIVE-Q2",
                    "title": "Severe Congestion Density by Area",
                    "sql": "SELECT area, COUNT(*) AS severe_event_count FROM mumbai_traffic.traffic_records WHERE congestion_level IN ('HIGH', 'SEVERE') GROUP BY area ORDER BY severe_event_count DESC;",
                    "execution_time_ms": 188,
                    "rows_returned": len(q2_results),
                    "results": q2_results
                }
            ]
        }
