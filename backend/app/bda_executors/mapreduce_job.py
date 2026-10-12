import json
import re
from collections import defaultdict
from typing import List, Dict

class MapReduceTrafficAnalyzer:
    """
    Hadoop MapReduce executor implementing:
    1. Traffic Congestion & Speed Analytics MapReduce Job
    2. Incident Word Count MapReduce Job (Syllabus standard)
    """

    @staticmethod
    def mapper_traffic_congestion(records: List[Dict]):
        """
        Mapper Function:
        Input: Raw traffic JSON records
        Output: (key: road_id, value: (speed, congestion_level, travel_time, incident_count))
        """
        mapped_key_values = []
        for r in records:
            road_id = r.get("road_id", "UNKNOWN_ROAD")
            speed = float(r.get("speed", 0))
            congestion = float(r.get("congestion_level", 0))
            travel_time = float(r.get("travel_time", 0))
            has_incident = 1 if r.get("incident_type") else 0
            
            mapped_key_values.append((road_id, {
                "road_name": r.get("road_name", road_id),
                "area": r.get("area", "Mumbai"),
                "speed": speed,
                "congestion": congestion,
                "travel_time": travel_time,
                "incident": has_incident
            }))
        return mapped_key_values

    @staticmethod
    def reducer_traffic_congestion(mapped_key_values):
        """
        Reducer Function:
        Input: Shuffle & Sort grouped values per road_id
        Output: Aggregated statistics (avg_speed, avg_congestion, total_incidents, record_count)
        """
        # Shuffle & Sort phase
        grouped = defaultdict(list)
        for key, val in mapped_key_values:
            grouped[key].append(val)
            
        reduced_results = []
        for road_id, val_list in grouped.items():
            count = len(val_list)
            if count == 0:
                continue
                
            road_name = val_list[0]["road_name"]
            area = val_list[0]["area"]
            
            avg_speed = round(sum(v["speed"] for v in val_list) / count, 2)
            avg_congestion = round(sum(v["congestion"] for v in val_list) / count, 2)
            avg_travel_time = round(sum(v["travel_time"] for v in val_list) / count, 2)
            total_incidents = sum(v["incident"] for v in val_list)
            
            reduced_results.append({
                "road_id": road_id,
                "road_name": road_name,
                "area": area,
                "total_records": count,
                "average_speed_kmh": avg_speed,
                "average_congestion_pct": avg_congestion,
                "average_travel_time_min": avg_travel_time,
                "total_incidents": total_incidents
            })
            
        # Sort by congestion level descending
        reduced_results.sort(key=lambda x: x["average_congestion_pct"], reverse=True)
        return reduced_results

    @staticmethod
    def run_wordcount_mapreduce(text_corpus: List[str]):
        """
        Standard Syllabus MapReduce Word Count on traffic incident descriptions.
        """
        # Mapper
        mapped = []
        for line in text_corpus:
            words = re.findall(r'\w+', line.lower())
            for w in words:
                mapped.append((w, 1))
                
        # Shuffle & Sort
        grouped = defaultdict(list)
        for k, v in mapped:
            grouped[k].append(v)
            
        # Reducer
        reduced = {k: sum(v_list) for k, v_list in grouped.items()}
        sorted_wc = sorted(reduced.items(), key=lambda x: x[1], reverse=True)
        
        return [{"word": word, "frequency": freq} for word, freq in sorted_wc]
