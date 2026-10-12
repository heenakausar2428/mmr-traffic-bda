import os
from typing import List, Dict

class PigEngine:
    """
    Apache Pig execution engine for Mumbai Traffic ETL data pipelines.
    Parses, cleanses, filters, groups, and transforms traffic data streams.
    """
    @staticmethod
    def execute_pig_etl(records: List[Dict]):
        """
        Executes Pig Latin data transformation pipeline steps:
        1. LOAD traffic_data USING PigStorage(',');
        2. FILTER invalid_records BY speed >= 0 AND speed <= 150;
        3. GROUP valid_records BY (road_id, road_name);
        4. FOREACH group GENERATE group, AVG(speed), MAX(congestion);
        5. STORE output INTO '/traffic/analytics/pig_summary';
        """
        raw_count = len(records)
        cleaned_records = []
        rejected_records = 0
        
        for r in records:
            speed = float(r.get("speed", -1))
            # Pig Filter transformation: speed between 0 and 150 km/h
            if 0 <= speed <= 150:
                cleaned_records.append(r)
            else:
                rejected_records += 1
                
        # Group By road_id
        grouped = {}
        for r in cleaned_records:
            rid = r.get("road_id", "UNKNOWN")
            if rid not in grouped:
                grouped[rid] = {
                    "road_name": r.get("road_name", rid),
                    "area": r.get("area", "Mumbai"),
                    "speeds": [],
                    "congestions": [],
                    "travel_times": []
                }
            grouped[rid]["speeds"].append(float(r.get("speed", 0)))
            grouped[rid]["congestions"].append(float(r.get("congestion_level", 0)))
            grouped[rid]["travel_times"].append(float(r.get("travel_time", 0)))
            
        pig_output = []
        for rid, data in grouped.items():
            avg_spd = round(sum(data["speeds"]) / len(data["speeds"]), 2)
            max_cong = round(max(data["congestions"]), 2)
            avg_cong = round(sum(data["congestions"]) / len(data["congestions"]), 2)
            avg_tt = round(sum(data["travel_times"]) / len(data["travel_times"]), 2)
            
            pig_output.append({
                "road_id": rid,
                "road_name": data["road_name"],
                "area": data["area"],
                "pig_avg_speed": avg_spd,
                "pig_max_congestion": max_cong,
                "pig_avg_congestion": avg_cong,
                "pig_avg_travel_time": avg_tt,
                "sample_count": len(data["speeds"])
            })
            
        pig_output.sort(key=lambda x: x["pig_avg_congestion"], reverse=True)
        
        return {
            "script_name": "traffic_analysis.pig",
            "raw_records_loaded": raw_count,
            "filtered_valid_records": len(cleaned_records),
            "rejected_corrupt_records": rejected_records,
            "pig_grouped_roads_count": len(pig_output),
            "output_hdfs_location": "/traffic/analytics/pig_summary",
            "results": pig_output
        }
