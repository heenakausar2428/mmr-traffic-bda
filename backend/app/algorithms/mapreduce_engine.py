from collections import defaultdict
from typing import List, Dict, Any

class MapReduceEngine:
    """
    Simulated MapReduce engine demonstrating Map, Shuffle/Sort, and Reduce phases
    for road speed aggregation & incident frequency counting across Mumbai traffic records.
    """

    @staticmethod
    def map_phase(records: List[Dict[str, Any]]) -> List[tuple]:
        """
        Mapper Step:
        Input: Raw traffic records
        Output: Key-Value pairs (road_name, current_speed_kmh)
        """
        intermediate_pairs = []
        for record in records:
            road = record.get("road_name", "Unknown Road")
            speed = record.get("current_speed_kmh", 0.0)
            intermediate_pairs.append((road, speed))
        return intermediate_pairs

    @staticmethod
    def shuffle_sort_phase(mapped_pairs: List[tuple]) -> Dict[str, List[float]]:
        """
        Shuffle & Sort Step:
        Groups all values by key (road_name).
        """
        grouped = defaultdict(list)
        for key, value in mapped_pairs:
            grouped[key].append(value)
        return dict(grouped)

    @staticmethod
    def reduce_phase(grouped_data: Dict[str, List[float]]) -> List[Dict[str, Any]]:
        """
        Reducer Step:
        Computes aggregate metrics (Average Speed, Record Count) for each road.
        """
        reduced_results = []
        for road_name, speeds in grouped_data.items():
            if speeds:
                avg_speed = round(sum(speeds) / len(speeds), 1)
                min_speed = round(min(speeds), 1)
                max_speed = round(max(speeds), 1)
                reduced_results.append({
                    "road_name": road_name,
                    "avg_speed_kmh": avg_speed,
                    "min_speed_kmh": min_speed,
                    "max_speed_kmh": max_speed,
                    "total_records_processed": len(speeds)
                })
        
        # Sort by avg_speed ascending (most congested first)
        reduced_results.sort(key=lambda x: x["avg_speed_kmh"])
        return reduced_results

    @classmethod
    def execute_job(cls, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Executes full MapReduce pipeline and returns detailed step breakdown.
        """
        mapped = cls.map_phase(records)
        shuffled = cls.shuffle_sort_phase(mapped)
        reduced = cls.reduce_phase(shuffled)

        # Prepare visual sample outputs for the frontend details view
        mapper_sample = [{"key": k, "value": v} for k, v in mapped[:6]]
        shuffle_sample = {k: v[:3] for k, v in list(shuffled.items())[:4]}

        return {
            "job_id": "MR-JOB-MUMBAI-SPEED-AGGREGATE",
            "input_records_count": len(records),
            "mapper_output_count": len(mapped),
            "reducer_keys_count": len(reduced),
            "mapper_sample": mapper_sample,
            "shuffle_sort_sample": shuffle_sample,
            "reducer_results": reduced,
            "status": "Completed"
        }
