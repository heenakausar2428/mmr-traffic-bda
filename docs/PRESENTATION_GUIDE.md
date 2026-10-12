# Mumbai Traffic Intelligence - Presentation & Viva Voce Guide
> **BE Computer Engineering - Semester VII Big Data Analytics Mini Project**

---

## 🎯 1. The 60-Second Elevator Pitch (What to say first)

"Good morning Professor. Our project is titled **Mumbai Traffic Intelligence: Real-Time Traffic Monitoring & Big Data Analytics**. 

Mumbai’s major corridors—such as the Western Express Highway, Eastern Express Highway, BKC, Sion-Panvel Highway, Coastal Road, and Atal Setu—generate hundreds of thousands of continuous GPS telemetry records. Processing this stream requires addressing **Volume, Velocity, and Variety**.

Instead of using traditional SQL databases, our project implements core Big Data techniques: **MongoDB** for document storage, **Bloom Filters** for space-efficient duplicate detection, the **Flajolet-Martin Algorithm** for streaming unique event estimation, **MapReduce** and **Hive** for parallel aggregation, **NetworkX Girvan-Newman Graph Analytics** for road community detection, and **R (`ggplot2`)** for statistical density modeling. All data feeds into a real-time command-center dashboard integrated with the **TomTom Traffic API**."

---

## 🎬 2. Presentation Flow: What to Show When

### 📍 Step 1: Overview Command Center (Main Dashboard)
* **What to Show:**
  * **Top Header:** Point to `● LIVE DATA (TOMTOM API)` badge, current system clock, and TomTom API integration.
  * **KPI Metric Cards:** Explain the 6 live metrics: `CURRENT AVG SPEED`, `CONGESTED ROADS`, `ACTIVE INCIDENTS`, `TRAFFIC RECORDS`, `ESTIMATED UNIQUE EVENTS`, `MOST CONGESTED AREA`.
  * **TomTom Spatial Map (Center ~60% width):** Show the vector dark map tiles, dual-stroke polylines color-coded by congestion (`Green: Low`, `Yellow: Moderate`, `Orange: High`, `Red: Severe`), and incident pins.
* **Interactive Demo:**
  * Type `Western Express Highway` or `BKC` into the map search bar. Show how the map flies to the road segment, highlights it in cyan, and opens its live delay popup!

### 📍 Step 2: Live Traffic & Telemetry Sync
* **What to Show:**
  * Click the **Sync** button in the header or watch the 3-second auto-sync.
  * Point out the **Flashing Speed Deltas (`▲ +4.9 km/h` or `▼ -3.8 km/h`)** next to corridor speeds to prove real-time streaming telemetry drift.

### 📍 Step 3: Big Data Analytics Page (Core Exam Focus!)
* **What to Show:**
  * Click on the **Big Data** sidebar tab to display the 7 syllabus concept cards.
  * **Bloom Filter Details:** Click *View Details*. Explain the 10,000-bit array visualization, 3 hash functions (MD5, SHA256, Murmur), $O(1)$ space complexity, zero false negatives, and false positive rate (~1.5%).
  * **Flajolet-Martin Algorithm Details:** Click *View Details*. Explain sub-linear memory cardinality estimation using binary trailing zeros ($R$). Explain the formula $\text{Estimate} = \frac{2^R}{\phi}$ (where $\phi = 0.77351$). Show that actual count (98,421) vs FM estimate (96,874) has only ~1.5% error!
  * **MapReduce Details:** Click *View Details*. Explain the 3 stages: **Mapper** $\rightarrow$ **Shuffle & Sort** $\rightarrow$ **Reducer** calculating average road speeds.
  * **Hive & HDFS Details:** Click *View Details*. Show Hive SQL queries (`SELECT road_name, AVG(current_speed)...`) and raw HDFS JSON files (`traffic_2026_10_06.json`, 128 MB blocks, 3x replication).

### 📍 Step 4: Road Network Intelligence (Graph Analytics)
* **What to Show:**
  * Click **Road Network** tab.
  * Explain graph modeling: Intersections = **Nodes**, Road links = **Edges**.
  * Highlight **Girvan-Newman Community Detection**: Explain how edge betweenness centrality partitioning automatically divides Mumbai into spatial clusters (Western Corridor, Central/Eastern Corridor, Harbour & Navi Mumbai) without hardcoded rules.

### 📍 Step 5: R Analytics Page
* **What to Show:**
  * Click **R Analytics** tab.
  * Show the statistical scatter density plot generated via R + `ggplot2` and the executable `traffic_analysis.R` script viewer.

### 📍 Step 6: About & Architecture Page
* **What to Show:**
  * Click **About / Arch** tab.
  * Show the end-to-end visual flow diagram and explain the 3 V's of Big Data in Mumbai traffic context.

---

## 🛠️ 3. Summary Table of Implemented BDA Features

| BDA Syllabus Concept | What Feature it Powers | Algorithmic / Technical Detail |
| :--- | :--- | :--- |
| **MongoDB** | Operational document storage | JSON/BSON documents, aggregation pipelines for area speed averages |
| **Bloom Filter** | Duplicate event detection | $O(1)$ space, 10,000-bit array, 3 hash functions, zero false negatives |
| **Flajolet-Martin (FM)** | Streaming unique event counter | Trailing zeros $R$, formula $\frac{2^R}{\phi}$, sub-linear RAM memory |
| **MapReduce Engine** | Distributed speed aggregation | Mapper stage, Shuffle/Sort grouping by key, Reducer aggregation |
| **Hive SQL Engine** | Data warehousing queries | SQL-on-Hadoop querying over partitioned historical traffic logs |
| **HDFS Storage** | Raw telemetry log storage | Partitioned files (`traffic_2026_10_06.json`), 128MB block size, 3x replication |
| **Graph Network (NetworkX)** | Community cluster detection | **Girvan-Newman algorithm** based on Edge Betweenness Centrality |
| **R Analytics (`ggplot2`)** | Statistical density visualization | Speed vs Volume LOESS non-linear regression curve modeling |
