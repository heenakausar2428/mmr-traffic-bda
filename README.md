# Mumbai Traffic Intelligence
> **BE Computer Engineering Semester VII — Big Data Analytics (BDA) Mini Project**  
> *Tagline: Real-Time Traffic Monitoring & Big Data Analytics*

---

## 🚦 Project Overview
**Mumbai Traffic Intelligence** is an end-to-end real-time traffic monitoring and big data analytics platform built for Mumbai's major transportation corridors (Western Express Highway, Eastern Express Highway, Sion-Panvel Highway, LBS Marg, SV Road, JVLR, SCLR, BKC Connector, Coastal Road, Atal Setu MTHL, etc.).

The application collects continuous telemetry, streams it through space-efficient BDA algorithms (**Bloom Filter**, **Flajolet-Martin Algorithm**), stores records in **MongoDB** and **HDFS**, executes parallel **MapReduce** and **Hive** analytical queries, models road intersections as graph networks (**Girvan-Newman Community Detection**), and visualizes insights on a command-center **React + Vite + Leaflet** dashboard.

---

## 🏗️ Core BDA Concepts Implemented

1. **MongoDB Document Database:** Real-time operational document store with aggregation pipelines.
2. **Bloom Filter:** Space-efficient $O(1)$ duplicate event detection using a 10,000-bit array and 3 hash functions.
3. **Flajolet-Martin (FM) Algorithm:** Sub-linear memory estimation of unique distinct events using binary trailing zero patterns.
4. **MapReduce Engine:** Parallel Map, Shuffle & Sort, and Reduce phases for calculating average road speeds.
5. **Hive SQL Engine:** Data warehousing SQL queries over partitioned historical traffic datasets.
6. **HDFS Storage:** Partitioned distributed file storage representation (`data/raw/traffic_2026_10_06.json`).
7. **Graph Network Analytics:** NetworkX graph modeling of Mumbai intersections with **Girvan-Newman Community Detection**.
8. **R Analytics (`ggplot2`):** Statistical density scatter plots and LOESS non-linear regression curves (`r-analytics/traffic_analysis.R`).

---

## 💻 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Leaflet / React-Leaflet, Recharts, Lucide Icons, Framer Motion.
- **Backend:** Python FastAPI, Uvicorn, PyMongo, NetworkX, NumPy, Requests.
- **Database:** MongoDB Community Edition (with automatic in-memory fallback store if MongoDB daemon is offline).

---

## ⚡ Quick Start & Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
*The FastAPI backend will launch on `http://localhost:8000`.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The React dashboard will launch on `http://localhost:3000`.*

---

## 📚 Viva Voce Guide
A comprehensive Viva Q&A document covering all BDA syllabus topics, 3 V's of Big Data, MapReduce pipelines, Bloom Filter math, Flajolet-Martin formulas, and Girvan-Newman graph theory is available in [`docs/VIVA.md`](docs/VIVA.md).
