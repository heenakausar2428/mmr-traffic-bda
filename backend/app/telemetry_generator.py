import json
import random
import os
from datetime import datetime

def load_mumbai_roads():
    data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "demo", "mumbai_roads.json")
    if os.path.exists(data_path):
        with open(data_path, "r") as f:
            return json.load(f)
    return []

MUMBAI_ROADS = load_mumbai_roads()

# Persistent state for dynamic speed drift across refreshes
ROAD_SPEED_STATE = {}

INCIDENT_TYPES = [
    {"type": "ACCIDENT", "severity": "HIGH", "desc": "Multi-vehicle collision near flyover"},
    {"type": "CONSTRUCTION", "severity": "MEDIUM", "desc": "Metro line girder placement & lane closure"},
    {"type": "WATERLOGGING", "severity": "CRITICAL", "desc": "Underpass congestion during rain"},
    {"type": "SLOW_TRAFFIC", "severity": "LOW", "desc": "High vehicle density during rush hour"},
    {"type": "BREAKDOWN", "severity": "LOW", "desc": "Stalled BEST Bus causing bottleneck"}
]

def generate_telemetry_snapshot():
    """
    Generates a realistic snapshot of current Mumbai traffic telemetry records.
    Drifts speeds continuously so live updates are visibly active.
    """
    global ROAD_SPEED_STATE
    records = []
    roads_summary = []
    incidents = []
    now_str = datetime.now().strftime("%I:%M:%S %p")

    for idx, road in enumerate(MUMBAI_ROADS):
        road_id = road["road_id"]
        road_name = road["name"]
        area = road["area"]
        free_flow = road["free_flow_speed"]
        base_speed = road["base_speed"]
        coords = road["coordinates"]

        # Initialize or drift current speed
        if road_id not in ROAD_SPEED_STATE:
            current_speed = base_speed
        else:
            prev_speed = ROAD_SPEED_STATE[road_id]
            # Drift by noticeable delta (-5 to +5 km/h)
            delta = random.choice([-5.2, -3.8, -2.1, 1.8, 3.4, 4.9, 6.1])
            current_speed = round(max(14.0, min(free_flow, prev_speed + delta)), 1)

        ROAD_SPEED_STATE[road_id] = current_speed

        # Calculate speed change delta for frontend visual flashing
        prev_speed_val = ROAD_SPEED_STATE.get(f"{road_id}_prev", current_speed)
        speed_delta = round(current_speed - prev_speed_val, 1)
        ROAD_SPEED_STATE[f"{road_id}_prev"] = current_speed

        # Determine Congestion Level
        speed_ratio = current_speed / free_flow
        if speed_ratio >= 0.70:
            congestion = "LOW"
        elif speed_ratio >= 0.45:
            congestion = "MODERATE"
        elif speed_ratio >= 0.30:
            congestion = "HIGH"
        else:
            congestion = "SEVERE"

        # Calculate Travel Time in Mins
        length_km = road["length_km"]
        travel_time = round((length_km / max(current_speed, 5.0)) * 60, 1)

        event_hash = f"HASH-{road_id}-{random.randint(100, 999)}"
        mid_coord = coords[len(coords) // 2]

        record = {
            "record_id": f"REC-{random.randint(10000, 99999)}",
            "road_id": road_id,
            "road_name": road_name,
            "area": area,
            "current_speed_kmh": current_speed,
            "speed_delta_kmh": speed_delta,
            "free_flow_speed_kmh": free_flow,
            "congestion_level": congestion,
            "travel_time_mins": travel_time,
            "timestamp": now_str,
            "event_hash": event_hash,
            "coordinates": {"lat": mid_coord[0], "lng": mid_coord[1]},
            "polyline": coords
        }
        records.append(record)

        # Incident generation for select roads
        if idx in [0, 3, 5, 7, 10]:
            inc_type = INCIDENT_TYPES[idx % len(INCIDENT_TYPES)]
            incidents.append({
                "incident_id": f"INC-10{idx}",
                "road_name": road_name,
                "area": area,
                "type": inc_type["type"],
                "severity": inc_type["severity"],
                "status": "ACTIVE",
                "description": inc_type["desc"],
                "reported_time": now_str,
                "location": {"lat": mid_coord[0], "lng": mid_coord[1]}
            })

        roads_summary.append({
            "road_id": road_id,
            "name": road_name,
            "area": area,
            "length_km": length_km,
            "current_speed": current_speed,
            "speed_delta": speed_delta,
            "free_flow_speed": free_flow,
            "congestion_level": congestion,
            "travel_time": travel_time,
            "last_updated": now_str,
            "coordinates": coords
        })

    return records, roads_summary, incidents
