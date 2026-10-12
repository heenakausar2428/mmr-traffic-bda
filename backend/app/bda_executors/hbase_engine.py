from datetime import datetime
from typing import List, Dict

class HBaseEngine:
    """
    Apache HBase engine for high-volume time-series traffic records.
    Row Key Format: {road_id}_{timestamp_compact} (e.g. ROAD_WEH_01_20261006_225500)
    Column Families:
    - 'info': road_name, area
    - 'metrics': speed, congestion_level, travel_time
    - 'incidents': type, severity
    """
    def __init__(self):
        # In-memory NoSQL HBase store table: 'mumbai_traffic_timeseries'
        self.table = {}

    def _generate_row_key(self, road_id: str, timestamp_str: str) -> str:
        """Constructs compound HBase row key optimized for time-series range scans."""
        compact_ts = timestamp_str.replace("-", "").replace(":", "").replace("T", "_").replace(" ", "_")
        return f"{road_id}_{compact_ts}"

    def put_record(self, record: Dict):
        """Puts a single traffic record into HBase column families."""
        road_id = record.get("road_id", "ROAD_UNKNOWN")
        ts = record.get("timestamp", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        row_key = self._generate_row_key(road_id, ts)
        
        self.table[row_key] = {
            "row_key": row_key,
            "info:road_name": record.get("road_name", ""),
            "info:area": record.get("area", ""),
            "metrics:speed": str(record.get("speed", 0)),
            "metrics:free_flow_speed": str(record.get("free_flow_speed", 0)),
            "metrics:congestion_level": str(record.get("congestion_level", 0)),
            "metrics:travel_time": str(record.get("travel_time", 0)),
            "incidents:type": str(record.get("incident_type") or "None"),
            "incidents:timestamp": ts
        }
        return row_key

    def scan_records(self, road_prefix: str = None, limit: int = 50) -> List[Dict]:
        """Scans HBase table by row key prefix or returns latest records."""
        results = []
        for key in sorted(self.table.keys(), reverse=True):
            if road_prefix and not key.startswith(road_prefix):
                continue
            results.append(self.table[key])
            if len(results) >= limit:
                break
        return results

    def get_table_stats(self):
        return {
            "table_name": "mumbai_traffic_timeseries",
            "column_families": ["info", "metrics", "incidents"],
            "total_rows": len(self.table),
            "row_key_design": "road_id_timestamp (e.g. ROAD_WEH_01_20261006_225500)",
            "storage_type": "NoSQL / Column-Oriented (HBase)"
        }
