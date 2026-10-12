import os
import json
import time
from datetime import datetime

class HDFSEngine:
    """
    HDFS Engine for Mumbai Traffic Data Lake management.
    Handles virtual distributed filesystem operations and HDFS CLI commands.
    """
    def __init__(self, base_dir: str = None):
        if base_dir is None:
            base_dir = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "raw", "hdfs_data_lake")
        self.base_dir = os.path.abspath(base_dir)
        self._ensure_hdfs_structure()

    def _ensure_hdfs_structure(self):
        dirs = [
            os.path.join(self.base_dir, "traffic", "raw"),
            os.path.join(self.base_dir, "traffic", "processed"),
            os.path.join(self.base_dir, "traffic", "incidents"),
            os.path.join(self.base_dir, "traffic", "analytics")
        ]
        for d in dirs:
            os.makedirs(d, exist_ok=True)

    def write_raw_traffic_event(self, event_data: dict) -> str:
        """Stores incoming raw traffic record in HDFS raw partition folder."""
        now = datetime.now()
        partition_path = os.path.join(
            self.base_dir, "traffic", "raw",
            f"year={now.year}", f"month={now.month:02d}", f"day={now.day:02d}"
        )
        os.makedirs(partition_path, exist_ok=True)
        
        filename = f"traffic_stream_{now.strftime('%H%M%S')}_{event_data.get('event_id', 'evt')[:6]}.json"
        filepath = os.path.join(partition_path, filename)
        
        with open(filepath, "w") as f:
            json.dump(event_data, f, indent=2)
            
        hdfs_path = f"/traffic/raw/year={now.year}/month={now.month:02d}/day={now.day:02d}/{filename}"
        return hdfs_path

    def list_directory(self, hdfs_path: str = "/traffic/raw"):
        """Lists files in HDFS path with size, permissions, and timestamps."""
        rel_path = hdfs_path.lstrip("/").replace("/", os.sep)
        target = os.path.join(self.base_dir, rel_path)
        
        if not os.path.exists(target):
            return {"status": "error", "message": f"HDFS Path {hdfs_path} does not exist", "files": []}
            
        file_list = []
        for root, dirs, files in os.walk(target):
            for file in files:
                full_p = os.path.join(root, file)
                stat = os.stat(full_p)
                rel_hdfs = "/" + os.path.relpath(full_p, self.base_dir).replace(os.sep, "/")
                file_list.append({
                    "permissions": "-rw-r--r--",
                    "replication": 3,
                    "owner": "hadoop",
                    "group": "supergroup",
                    "size_bytes": stat.st_size,
                    "modification_time": datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
                    "hdfs_path": rel_hdfs,
                    "filename": file
                })
        return {
            "status": "success",
            "hdfs_path": hdfs_path,
            "total_files": len(file_list),
            "files": file_list[:50]  # capped at 50 for display
        }

    def get_hdfs_summary(self):
        """Returns Data Lake overall stats."""
        total_files = 0
        total_size = 0
        categories = {"raw": 0, "processed": 0, "incidents": 0, "analytics": 0}
        
        for root, dirs, files in os.walk(self.base_dir):
            for file in files:
                total_files += 1
                fp = os.path.join(root, file)
                total_size += os.path.getsize(fp)
                if "raw" in fp:
                    categories["raw"] += 1
                elif "processed" in fp:
                    categories["processed"] += 1
                elif "incidents" in fp:
                    categories["incidents"] += 1
                elif "analytics" in fp:
                    categories["analytics"] += 1
                    
        return {
            "hdfs_uri": "hdfs://mumbai-namenode:9000",
            "total_files": total_files,
            "total_size_bytes": total_size,
            "total_size_formatted": f"{round(total_size / 1024, 2)} KB",
            "block_size": "128 MB",
            "replication_factor": 3,
            "partition_counts": categories
        }
