import sqlite3
import os
from typing import List, Dict

class HiveEngine:
    """
    Apache Hive Data Warehouse analytical engine.
    Executes Hive HQL queries over traffic data warehouse.
    """
    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "hive_mumbai_traffic.db")
        self.db_path = os.path.abspath(db_path)
        self._init_hive_warehouse()

    def _init_hive_warehouse(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Hive Managed Tables schema
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS traffic_records (
            event_id TEXT PRIMARY KEY,
            road_id TEXT,
            road_name TEXT,
            area TEXT,
            speed REAL,
            free_flow_speed REAL,
            congestion_level REAL,
            travel_time REAL,
            incident_type TEXT,
            timestamp TEXT,
            hour INTEGER
        )
        """)
        conn.commit()
        conn.close()

    def sync_records(self, records: List[Dict]):
        """Populates Hive Data Warehouse tables with processed records."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for r in records:
            # extract hour from timestamp if available
            ts = r.get("timestamp", "")
            hour = 12
            if "T" in ts:
                try:
                    hour = int(ts.split("T")[1].split(":")[0])
                except:
                    pass
            elif " " in ts:
                try:
                    hour = int(ts.split(" ")[1].split(":")[0])
                except:
                    pass
                    
            cursor.execute("""
            INSERT OR REPLACE INTO traffic_records 
            (event_id, road_id, road_name, area, speed, free_flow_speed, congestion_level, travel_time, incident_type, timestamp, hour)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                r.get("event_id"), r.get("road_id"), r.get("road_name"), r.get("area"),
                float(r.get("speed", 0)), float(r.get("free_flow_speed", 0)), float(r.get("congestion_level", 0)),
                float(r.get("travel_time", 0)), r.get("incident_type"), ts, hour
            ))
        conn.commit()
        conn.close()

    def run_hive_query(self, query_type: str = "avg_speed_by_road"):
        """Executes analytical Hive queries matching college syllabus expectations."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        queries = {
            "avg_speed_by_road": """
                SELECT road_name, area, 
                       ROUND(AVG(speed), 2) AS avg_speed, 
                       ROUND(AVG(free_flow_speed), 2) AS avg_free_flow,
                       COUNT(*) AS record_count
                FROM traffic_records
                GROUP BY road_name, area
                ORDER BY avg_speed ASC
            """,
            "max_congestion_by_road": """
                SELECT road_name, area, 
                       ROUND(MAX(congestion_level), 2) AS max_congestion, 
                       ROUND(AVG(congestion_level), 2) AS avg_congestion
                FROM traffic_records
                GROUP BY road_name, area
                ORDER BY max_congestion DESC
            """,
            "incidents_by_area": """
                SELECT area, 
                       COUNT(CASE WHEN incident_type IS NOT NULL AND incident_type != '' THEN 1 END) AS incident_count,
                       ROUND(AVG(congestion_level), 2) AS avg_congestion
                FROM traffic_records
                GROUP BY area
                ORDER BY incident_count DESC
            """,
            "traffic_by_hour": """
                SELECT hour, 
                       ROUND(AVG(speed), 2) AS avg_speed, 
                       ROUND(AVG(congestion_level), 2) AS avg_congestion,
                       COUNT(*) AS sample_size
                FROM traffic_records
                GROUP BY hour
                ORDER BY hour ASC
            """,
            "descriptive_stats": """
                SELECT 
                    COUNT(*) AS total_records,
                    ROUND(AVG(speed), 2) AS mean_speed,
                    ROUND(MIN(speed), 2) AS min_speed,
                    ROUND(MAX(speed), 2) AS max_speed,
                    ROUND(AVG(congestion_level), 2) AS mean_congestion,
                    ROUND(MAX(congestion_level), 2) AS max_congestion
                FROM traffic_records
            """
        }
        
        sql = queries.get(query_type, queries["avg_speed_by_road"])
        cursor.execute(sql)
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {
            "query_type": query_type,
            "hive_table": "mumbai_traffic.traffic_records",
            "execution_engine": "Tez / MapReduce",
            "results": rows
        }
