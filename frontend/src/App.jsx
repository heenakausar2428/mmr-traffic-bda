import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import LiveTraffic from './pages/LiveTraffic';
import Analytics from './pages/Analytics';
import RoadAnalysis from './pages/RoadAnalysis';
import Incidents from './pages/Incidents';
import BigData from './pages/BigData';
import RoadNetwork from './pages/RoadNetwork';
import RAnalytics from './pages/RAnalytics';
import AboutArchitecture from './pages/AboutArchitecture';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [summaryData, setSummaryData] = useState(null);
  const [roadsData, setRoadsData] = useState([]);
  const [incidentsData, setIncidentsData] = useState([]);
  const [speedTrendsData, setSpeedTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAllData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const [sumRes, roadsRes, incRes, speedRes] = await Promise.all([
        fetch('/api/analytics/summary'),
        fetch('/api/traffic/roads'),
        fetch('/api/traffic/incidents'),
        fetch('/api/analytics/speed')
      ]);

      const [sum, rds, inc, speed] = await Promise.all([
        sumRes.json(),
        roadsRes.json(),
        incRes.json(),
        speedRes.json()
      ]);

      setSummaryData(sum);
      setRoadsData(rds.roads || []);
      setIncidentsData(inc.incidents || []);
      setSpeedTrendsData(speed);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    // Auto sync telemetry every 3 seconds for continuous live telemetry drift
    const interval = setInterval(() => {
      fetchAllData(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="flex h-screen bg-[#0b0f17] text-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          summaryData={summaryData} 
          onRefresh={() => fetchAllData(false)} 
          loading={loading}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <Overview
              summary={summaryData}
              roads={roadsData}
              incidents={incidentsData}
              speedTrends={speedTrendsData}
              onSelectRoad={(road) => {
                setActiveTab('road-analysis');
              }}
            />
          )}

          {activeTab === 'live-traffic' && (
            <LiveTraffic
              roads={roadsData}
              incidents={incidentsData}
              summary={summaryData}
              onRefresh={() => fetchAllData(false)}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics
              roads={roadsData}
              speedTrends={speedTrendsData}
            />
          )}

          {activeTab === 'road-analysis' && (
            <RoadAnalysis
              roads={roadsData}
              incidents={incidentsData}
            />
          )}

          {activeTab === 'incidents' && (
            <Incidents
              incidents={incidentsData}
              roads={roadsData}
            />
          )}

          {activeTab === 'big-data' && (
            <BigData />
          )}

          {activeTab === 'road-network' && (
            <RoadNetwork />
          )}

          {activeTab === 'r-analytics' && (
            <RAnalytics />
          )}

          {activeTab === 'about' && (
            <AboutArchitecture />
          )}
        </main>
      </div>
    </div>
  );
}
