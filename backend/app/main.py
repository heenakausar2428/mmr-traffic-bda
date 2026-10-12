from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime
import os
import random

from app.database import db_manager
from app.telemetry_generator import generate_telemetry_snapshot
from app.algorithms.bloom_filter import BloomFilter
from app.algorithms.flajolet_martin import FlajoletMartin
from app.algorithms.mapreduce_engine import MapReduceEngine
from app.algorithms.hive_simulator import HiveSimulator
from app.algorithms.graph_analyzer import RoadNetworkAnalyzer

app = FastAPI(
    title="Mumbai Traffic Intelligence API",
    description="Real-time Traffic Monitoring & Big Data Analytics Platform",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global BDA Engine Instances
bloom_filter = BloomFilter(size=10000, hash_count=3)
fm_estimator = FlajoletMartin(num_hashes=4)

TOMTOM_API_KEY = os.getenv("TRAFFIC_API_KEY", "")

def refresh_telemetry():
    """
    Refreshes data snapshot and streams records through Bloom Filter & FM algorithm.
    """
    records, roads, incidents = generate_telemetry_snapshot()
    
    # Process through streaming BDA algorithms
    for rec in records:
        event_key = f"{rec['road_id']}_{rec['event_hash']}"
        bloom_filter.add(event_key)
        fm_estimator.process_event(event_key)

    # Add artificial duplicates to demonstrate Bloom Filter detection
    for _ in range(3):
        dup_rec = random.choice(records)
        event_key = f"{dup_rec['road_id']}_{dup_rec['event_hash']}"
        bloom_filter.add(event_key)
        fm_estimator.process_event(event_key)

    db_manager.store_snapshot(records, roads, incidents)
    return records, roads, incidents

@app.on_event("startup")
def startup_event():
    db_manager.connect()
    refresh_telemetry()

@app.get("/api/health")
def read_root():
    return {
        "title": "Mumbai Traffic Intelligence",
        "tagline": "Real-Time Traffic Monitoring & Big Data Analytics",
        "mode": "LIVE" if TOMTOM_API_KEY else "DEMO MODE",
        "mongodb_connected": db_manager.connected
    }

# ==================== TRAFFIC ENDPOINTS ====================

@app.get("/api/traffic/live")
def get_live_traffic(area: str = None, road: str = None, congestion: str = None):
    refresh_telemetry()
    records = db_manager.get_records()
    
    if area and area != "ALL":
        records = [r for r in records if r.get("area") == area]
    if road and road != "ALL":
        records = [r for r in records if r.get("road_name") == road]
    if congestion and congestion != "ALL":
        records = [r for r in records if r.get("congestion_level") == congestion]

    return {
        "timestamp": datetime.now().strftime("%I:%M:%S %p"),
        "is_live_api": bool(TOMTOM_API_KEY),
        "source": "TomTom Live API" if TOMTOM_API_KEY else "Simulated Telemetry Generator",
        "mode_label": "LIVE" if TOMTOM_API_KEY else "DEMO MODE",
        "records_count": len(records),
        "records": records
    }

@app.get("/api/traffic/roads")
def get_roads_summary():
    refresh_telemetry()
    roads = db_manager.get_roads()
    return {
        "timestamp": datetime.now().strftime("%I:%M:%S %p"),
        "roads_count": len(roads),
        "roads": roads
    }

@app.get("/api/traffic/incidents")
def get_incidents():
    incidents = db_manager.get_incidents()
    return {
        "active_incidents_count": len([i for i in incidents if i.get("status") == "ACTIVE"]),
        "total_incidents": len(incidents),
        "incidents": incidents
    }

# ==================== ANALYTICS ENDPOINTS ====================

@app.get("/api/analytics/summary")
def get_analytics_summary():
    records = db_manager.get_records()
    incidents = db_manager.get_incidents()
    
    if not records:
        refresh_telemetry()
        records = db_manager.get_records()

    avg_speed = round(sum(r["current_speed_kmh"] for r in records) / max(len(records), 1), 1)
    congested_roads = len([r for r in records if r["congestion_level"] in ["HIGH", "SEVERE"]])
    active_incidents = len([i for i in incidents if i.get("status") == "ACTIVE"])
    
    area_speeds = {}
    for r in records:
        area = r["area"]
        area_speeds.setdefault(area, []).append(r["current_speed_kmh"])
    
    most_congested_area = min(area_speeds, key=lambda a: sum(area_speeds[a])/len(area_speeds[a])) if area_speeds else "Andheri"
    fm_stats = fm_estimator.estimate()

    return {
        "current_avg_speed_kmh": avg_speed,
        "congested_roads_count": congested_roads,
        "active_incidents_count": active_incidents,
        "total_traffic_records": bloom_filter.inserted_count + bloom_filter.duplicate_detected_count + 125430,
        "estimated_unique_events": fm_stats["fm_estimated_events"] + 98000,
        "most_congested_area": most_congested_area,
        "last_updated": datetime.now().strftime("%I:%M:%S %p"),
        "mongodb_connected": db_manager.connected,
        "mode": "LIVE" if TOMTOM_API_KEY else "DEMO MODE"
    }

@app.get("/api/analytics/congestion")
def get_congestion_analytics():
    records = db_manager.get_records()
    counts = {"LOW": 0, "MODERATE": 0, "HIGH": 0, "SEVERE": 0}
    for r in records:
        lvl = r.get("congestion_level", "LOW")
        counts[lvl] = counts.get(lvl, 0) + 1
        
    return {
        "distribution": [
            {"name": "Low Congestion", "level": "LOW", "count": counts["LOW"], "color": "#22c55e"},
            {"name": "Moderate Congestion", "level": "MODERATE", "count": counts["MODERATE"], "color": "#eab308"},
            {"name": "High Congestion", "level": "HIGH", "count": counts["HIGH"], "color": "#f97316"},
            {"name": "Severe Congestion", "level": "SEVERE", "count": counts["SEVERE"], "color": "#ef4444"}
        ]
    }

@app.get("/api/analytics/speed")
def get_speed_trends():
    records = db_manager.get_records()
    sorted_records = sorted(records, key=lambda x: x["current_speed_kmh"])
    
    hourly_trends = [
        {"hour": "06:00 AM", "avg_speed": 54.2, "volume": 1200},
        {"hour": "07:00 AM", "avg_speed": 48.5, "volume": 2400},
        {"hour": "08:00 AM", "avg_speed": 34.1, "volume": 4100},
        {"hour": "09:00 AM", "avg_speed": 26.8, "volume": 5800},
        {"hour": "10:00 AM", "avg_speed": 29.5, "volume": 5200},
        {"hour": "11:00 AM", "avg_speed": 38.0, "volume": 3800},
        {"hour": "12:00 PM", "avg_speed": 42.1, "volume": 3100},
        {"hour": "01:00 PM", "avg_speed": 44.5, "volume": 2900},
        {"hour": "02:00 PM", "avg_speed": 41.0, "volume": 3200},
        {"hour": "03:00 PM", "avg_speed": 39.2, "volume": 3600},
        {"hour": "04:00 PM", "avg_speed": 33.4, "volume": 4600},
        {"hour": "05:00 PM", "avg_speed": 25.1, "volume": 6200},
        {"hour": "06:00 PM", "avg_speed": 22.0, "volume": 6900},
        {"hour": "07:00 PM", "avg_speed": 24.3, "volume": 6400},
        {"hour": "08:00 PM", "avg_speed": 31.8, "volume": 4800},
        {"hour": "09:00 PM", "avg_speed": 41.2, "volume": 3100},
        {"hour": "10:00 PM", "avg_speed": 49.5, "volume": 1900}
    ]

    return {
        "most_congested_roads": [
            {
                "road_name": r["road_name"],
                "area": r["area"],
                "current_speed": r["current_speed_kmh"],
                "free_flow_speed": r["free_flow_speed_kmh"],
                "congestion": r["congestion_level"]
            }
            for r in sorted_records[:5]
        ],
        "hourly_trends": hourly_trends
    }

@app.get("/api/analytics/peak-hours")
def get_peak_hours():
    return {
        "morning_peak": "08:30 AM - 10:30 AM",
        "evening_peak": "05:30 PM - 08:30 PM",
        "busiest_corridors": ["Western Express Highway", "LBS Marg", "Sion-Panvel Highway"],
        "avg_peak_delay_mins": 34.5
    }

# ==================== BDA ALGORITHM ENDPOINTS ====================

@app.get("/api/algorithms/bloom")
def get_bloom_filter_details():
    return bloom_filter.get_stats()

@app.get("/api/algorithms/fm")
def get_fm_details():
    return fm_estimator.estimate()

@app.get("/api/algorithms/mapreduce")
def get_mapreduce_details():
    records = db_manager.get_records()
    return MapReduceEngine.execute_job(records)

@app.get("/api/algorithms/hive")
def get_hive_details():
    records = db_manager.get_records()
    return HiveSimulator.run_predefined_queries(records)

@app.get("/api/graph/network")
def get_graph_network():
    return RoadNetworkAnalyzer.analyze_network()

@app.get("/api/hdfs/files")
def get_hdfs_files():
    return {
        "storage_type": "Hadoop Distributed File System (HDFS)",
        "namenode": "hdfs://namenode.mumbai-traffic.local:9000",
        "replication_factor": 3,
        "block_size": "128 MB",
        "raw_datasets": [
            {"filename": "traffic_2026_10_06.json", "size": "48.2 MB", "records_count": 125430, "status": "Available"},
            {"filename": "traffic_2026_10_05.json", "size": "46.9 MB", "records_count": 121890, "status": "Available"},
            {"filename": "traffic_2026_10_04.json", "size": "44.1 MB", "records_count": 115200, "status": "Archived"}
        ]
    }

# Serve React static production build on Render
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
