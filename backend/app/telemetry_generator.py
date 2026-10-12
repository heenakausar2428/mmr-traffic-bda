import json
import random
import os
from datetime import datetime

# Embedded fallback roads dataset to guarantee non-empty telemetry in all environments
FALLBACK_ROADS = [
    {
        "road_id": "ROAD-WEH-01", "name": "Western Express Highway", "area": "Andheri",
        "length_km": 25.3, "free_flow_speed": 65, "base_speed": 32,
        "coordinates": [[19.0435, 72.8465], [19.0822, 72.8512], [19.1197, 72.8464], [19.1652, 72.8576], [19.2312, 72.8561]]
    },
    {
        "road_id": "ROAD-EEH-02", "name": "Eastern Express Highway", "area": "Ghatkopar",
        "length_km": 23.8, "free_flow_speed": 70, "base_speed": 38,
        "coordinates": [[19.0375, 72.8612], [19.0682, 72.8834], [19.1105, 72.9095], [19.1764, 72.9511], [19.2155, 72.9732]]
    },
    {
        "road_id": "ROAD-SPH-03", "name": "Sion-Panvel Highway", "area": "Vashi",
        "length_km": 28.5, "free_flow_speed": 75, "base_speed": 35,
        "coordinates": [[19.0465, 72.8885], [19.0612, 72.9234], [19.0776, 72.9982], [19.0431, 73.0234], [19.0215, 73.0645]]
    },
    {
        "road_id": "ROAD-LBS-04", "name": "LBS Marg", "area": "Kurla",
        "length_km": 21.0, "free_flow_speed": 45, "base_speed": 22,
        "coordinates": [[19.0398, 72.8682], [19.0712, 72.8795], [19.1023, 72.9152], [19.1678, 72.9465]]
    },
    {
        "road_id": "ROAD-SVR-05", "name": "SV Road", "area": "Bandra",
        "length_km": 24.2, "free_flow_speed": 50, "base_speed": 25,
        "coordinates": [[19.0567, 72.8398], [19.0889, 72.8365], [19.1178, 72.8391], [19.1823, 72.8488]]
    },
    {
        "road_id": "ROAD-JVLR-06", "name": "Jogeshwari-Vikhroli Link Road (JVLR)", "area": "Powai",
        "length_km": 10.6, "free_flow_speed": 60, "base_speed": 28,
        "coordinates": [[19.1312, 72.8523], [19.1235, 72.8812], [19.1267, 72.9098], [19.1189, 72.9324]]
    },
    {
        "road_id": "ROAD-SCLR-07", "name": "Santacruz-Chembur Link Road (SCLR)", "area": "Kurla",
        "length_km": 6.4, "free_flow_speed": 55, "base_speed": 29,
        "coordinates": [[19.0812, 72.8545], [19.0734, 72.8789], [19.0656, 72.8956]]
    },
    {
        "road_id": "ROAD-BKC-08", "name": "BKC Connector & Main Avenue", "area": "BKC",
        "length_km": 4.5, "free_flow_speed": 50, "base_speed": 34,
        "coordinates": [[19.0623, 72.8612], [19.0655, 72.8689], [19.0688, 72.8765]]
    },
    {
        "road_id": "ROAD-BWSL-10", "name": "Bandra-Worli Sea Link", "area": "Bandra",
        "length_km": 5.6, "free_flow_speed": 80, "base_speed": 62,
        "coordinates": [[19.0434, 72.8212], [19.0256, 72.8156], [19.0112, 72.8167]]
    },
    {
        "road_id": "ROAD-MCR-11", "name": "Mumbai Coastal Road", "area": "Worli",
        "length_km": 10.5, "free_flow_speed": 80, "base_speed": 64,
        "coordinates": [[18.9432, 72.8223], [18.9712, 72.8112], [19.0089, 72.8123]]
    },
    {
        "road_id": "ROAD-MTHL-12", "name": "Atal Setu (MTHL)", "area": "Navi Mumbai",
        "length_km": 21.8, "free_flow_speed": 100, "base_speed": 82,
        "coordinates": [[18.9912, 72.8612], [18.9834, 72.9345], [18.9756, 73.0012]]
    }
]

def load_mumbai_roads():
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "..", "..", "data", "demo", "mumbai_roads.json"),
        os.path.join(os.path.dirname(__file__), "..", "..", "data", "mumbai_roads.json"),
        os.path.join(os.getcwd(), "data", "demo", "mumbai_roads.json"),
        os.path.join(os.getcwd(), "data", "mumbai_roads.json"),
        os.path.join(os.getcwd(), "..", "data", "demo", "mumbai_roads.json"),
        "/app/data/demo/mumbai_roads.json",
        "/app/data/mumbai_roads.json"
    ]
    for data_path in possible_paths:
        if os.path.exists(data_path):
            try:
                with open(data_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if data and len(data) > 0:
                        return data
            except Exception:
                continue
    return FALLBACK_ROADS

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
