# Mumbai Traffic Intelligence - BDA Viva Voce Q&A Guide
**BE Computer Engineering - Semester VII Big Data Analytics Mini Project**

---

### Q1: What is the main objective of the "Mumbai Traffic Intelligence" project?
**Answer:**
The project is a real-time traffic monitoring and big data analytics system designed for Mumbai's major transportation corridors. It ingests continuous traffic telemetry (speeds, congestion, free-flow metrics, and incidents), stores structured/unstructured records in MongoDB and raw logs in HDFS, applies streaming algorithms (Bloom Filter and Flajolet-Martin), executes parallel MapReduce and Hive queries, models road intersections as graph networks (Girvan-Newman Community Detection), and presents actionable insights via an interactive React command-center dashboard.

---

### Q2: Why is Mumbai Traffic Telemetry classified as "Big Data"? Explain using the 3 V's.
**Answer:**
1. **Volume:** Thousands of GPS sensors, BEST buses, cabs, traffic cameras, and navigation apps produce hundreds of thousands of location and speed records daily across Mumbai's 2,000+ km road network.
2. **Velocity:** Traffic data is continuously generated every few seconds. Immediate processing is required to calculate live congestion levels, estimate travel delays, and detect real-time bottlenecks before gridlocks form.
3. **Variety:** Data arrives in multiple formats: structured GPS coordinates, semi-structured JSON API responses, unstructured incident text logs, and spatial graph road networks.

---

### Q3: Why is MongoDB used as the primary database instead of traditional RDBMS?
**Answer:**
- **Flexible Document Schema:** Traffic telemetry formats change frequently (e.g. adding new sensor metadata or API fields). MongoDB's JSON/BSON document schema handles dynamic fields effortlessly without schema migration overhead.
- **High Ingestion Throughput:** MongoDB handles high write speeds from real-time telemetry streaming.
- **Aggregation Pipeline:** Powerful built-in aggregation pipelines enable real-time calculation of average speeds, congestion counts, and area-wise grouping without transferring raw data to application code.

---

### Q4: What is the role of HDFS in this architecture?
**Answer:**
While MongoDB handles live operational data, **HDFS (Hadoop Distributed File System)** stores massive, append-only historical raw logs (e.g., `traffic_2026_10_06.json`). HDFS breaks large traffic files into 128 MB blocks distributed across DataNodes with a replication factor of 3, allowing historical batch analysis using MapReduce and Hive.

---

### Q5: Explain how the Bloom Filter works in your project.
**Answer:**
- **Purpose:** Space-efficient duplicate event detection on streaming traffic records.
- **Mechanism:** Maintains a 10,000-bit array initialized to zeros and 3 independent hash functions (MD5, SHA256, Murmur-style). When a new traffic event hash arrives, it sets the bit positions calculated by the 3 hash functions.
- **Key Property:** Zero false negatives (if the filter says an event is *not* present, it is 100% new). Small, controllable false-positive rate (~1.5%) with zero disk read overhead.

---

### Q6: Explain the Flajolet-Martin (FM) Algorithm and why it is used.
**Answer:**
- **Purpose:** Sub-linear memory estimation of unique distinct traffic telemetry events over a continuous stream.
- **Mechanism:** Hashes incoming event identifiers into 32-bit integers and tracks the maximum number of trailing zeros $R$ in their binary representation.
- **Formula:** Estimated unique elements $\approx \frac{2^R}{\phi}$ (where $\phi = 0.77351$).
- **Advantage:** Calculates distinct events using only a few bytes of RAM instead of maintaining millions of unique keys in memory.

---

### Q7: Describe your MapReduce implementation.
**Answer:**
- **Mapper:** Takes raw traffic telemetry records and emits `(road_name, current_speed_kmh)` key-value pairs.
- **Shuffle & Sort:** Groups all speeds by `road_name`.
- **Reducer:** Computes the average speed, minimum speed, and total record count for each road corridor to rank the most congested routes.

---

### Q8: What is the Girvan-Newman Algorithm and how is it applied to the Road Network?
**Answer:**
- **Graph Model:** Mumbai intersections are modeled as **Nodes**, and road connections between them as **Edges**.
- **Girvan-Newman Algorithm:** A community detection algorithm that iteratively calculates **Edge Betweenness Centrality** (the number of shortest paths passing through an edge) and removes the edge with the highest betweenness score.
- **Traffic Insight:** Automatically partitions Mumbai's road network into natural spatial communities (Western Corridor, Central/Eastern Corridor, Harbour/Navi Mumbai Corridor) without manual hardcoding.

---

### Q9: What is the difference between Live Mode and Demo Mode in your project?
**Answer:**
- **Live Mode:** Backend connects directly to live traffic APIs (e.g., TomTom Traffic API) using an API key stored securely in environment variables.
- **Demo Mode:** If no API key is provided or the external service is offline, a realistic telemetry generator simulates continuous Mumbai traffic telemetry using authentic road coordinates, baseline capacities, peak hour curves, and random traffic incidents.

---

### Q10: What are the limitations and future scope of this project?
**Answer:**
- **Current Limitations:** Runs on simulated HDFS/Hive engines locally; live traffic coverage depends on external API rate limits.
- **Future Scope:** Integration with Apache Kafka for real-time stream ingestion, training Apache Spark MLlib models for traffic prediction 1 hour in advance, and integrating live CCTV camera computer vision feeds.
