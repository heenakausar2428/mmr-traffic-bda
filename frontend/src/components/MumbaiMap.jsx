import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, Layers, MapPin, Gauge, Navigation } from 'lucide-react';

// Fix default Leaflet marker icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Google Maps style incident pins
const incidentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [22, 35],
  iconAnchor: [11, 35],
  popupAnchor: [1, -30],
  shadowSize: [35, 35]
});

// Google Maps Signature Traffic Colors
const getCongestionColor = (level) => {
  switch (level) {
    case 'LOW':
      return '#00e676'; // Google Traffic Green
    case 'MODERATE':
      return '#ffea00'; // Google Traffic Yellow
    case 'HIGH':
      return '#ff9100'; // Google Traffic Orange
    case 'SEVERE':
      return '#ff1744'; // Google Traffic Red
    default:
      return '#29b6f6';
  }
};

// Map controller helper to smoothly fly to focused road
function MapFlyTo({ centerZoom }) {
  const map = useMap();
  if (centerZoom) {
    map.flyTo(centerZoom.center, centerZoom.zoom, { duration: 1.2 });
  }
  return null;
}

export default function MumbaiMap({ roads = [], incidents = [], onSelectRoad, selectedRoadId = null }) {
  const mumbaiCenter = [19.0760, 72.8777];
  const [mapStyle, setMapStyle] = useState('google_dark');
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [focusedCenterZoom, setFocusedCenterZoom] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Official Google Maps Tile Layer endpoints
  const googleTileLayers = {
    google_dark: {
      url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps',
      className: 'google-map-dark-filter'
    },
    google_standard: {
      url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps',
      className: ''
    },
    google_satellite: {
      url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Imagery',
      className: ''
    },
    google_terrain: {
      url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps Terrain',
      className: ''
    }
  };

  // Search suggestions
  const searchSuggestions = roads.filter(r => 
    mapSearchQuery && (
      r.name.toLowerCase().includes(mapSearchQuery.toLowerCase()) ||
      r.area.toLowerCase().includes(mapSearchQuery.toLowerCase())
    )
  );

  const handleSelectSearchResult = (road) => {
    const coords = road.polyline || road.coordinates || [];
    if (coords.length > 0) {
      const midCoord = coords[Math.floor(coords.length / 2)];
      setFocusedCenterZoom({ center: midCoord, zoom: 13 });
    }
    setMapSearchQuery(road.name);
    setShowSearchResults(false);
    if (onSelectRoad) onSelectRoad(road);
  };

  const currentLayer = googleTileLayers[mapStyle] || googleTileLayers.google_dark;

  return (
    <div className="w-full h-full min-h-[460px] rounded-2xl overflow-hidden border border-slate-700/80 relative z-10 shadow-2xl flex flex-col group">
      {/* Top Floating Google Maps Style Search & Layer Controls */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        {/* Floating Glass Search Input */}
        <div className="relative w-full sm:w-80 pointer-events-auto">
          <div className="relative shadow-xl">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              placeholder="Search Google Maps corridor (e.g. WEH, BKC)..."
              value={mapSearchQuery}
              onChange={(e) => {
                setMapSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-10 pr-3 py-2 bg-[#0f172a]/90 backdrop-blur-md border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-400 shadow-2xl focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          {/* Search Dropdown Results */}
          {showSearchResults && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0f172a]/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-40 divide-y divide-slate-800 font-mono">
              {searchSuggestions.map((road) => (
                <button
                  key={road.road_id || road.name}
                  onClick={() => handleSelectSearchResult(road)}
                  className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-100 font-sans">{road.name}</div>
                    <div className="text-[10px] text-slate-400">{road.area}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-bold">{road.current_speed || road.current_speed_kmh} km/h</div>
                    <div className="text-[9px] text-slate-500">{road.congestion_level || road.congestion}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Floating Map Layer Switcher Buttons */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#0f172a]/90 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-700/80 shadow-2xl text-[10px] font-medium text-slate-300 font-mono">
          <Layers className="w-3.5 h-3.5 text-cyan-400 ml-1 mr-0.5" />
          <button
            onClick={() => setMapStyle('google_dark')}
            className={`px-2.5 py-1 rounded-lg transition-all ${mapStyle === 'google_dark' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40' : 'hover:text-slate-100'}`}
          >
            Google Dark
          </button>
          <button
            onClick={() => setMapStyle('google_standard')}
            className={`px-2.5 py-1 rounded-lg transition-all ${mapStyle === 'google_standard' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40' : 'hover:text-slate-100'}`}
          >
            Google Maps
          </button>
          <button
            onClick={() => setMapStyle('google_satellite')}
            className={`px-2.5 py-1 rounded-lg transition-all ${mapStyle === 'google_satellite' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40' : 'hover:text-slate-100'}`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Main Leaflet Map Canvas */}
      <div className={`flex-1 w-full h-full relative ${currentLayer.className}`}>
        <MapContainer
          center={mumbaiCenter}
          zoom={11}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {/* Google Maps Base Tile Layer */}
          <TileLayer
            attribution={currentLayer.attribution}
            url={currentLayer.url}
          />

          {/* Smooth Fly-To Helper */}
          <MapFlyTo centerZoom={focusedCenterZoom} />

          {/* Mumbai Road Traffic Polylines (Google Maps Dual-Stroke Glow Styling) */}
          {roads.map((road) => {
            const color = getCongestionColor(road.congestion_level || road.congestion);
            const polylineCoords = road.polyline || road.coordinates || [];
            const isSelected = selectedRoadId && (road.road_id === selectedRoadId || road.name === selectedRoadId);

            if (!polylineCoords || polylineCoords.length === 0) return null;

            return (
              <React.Fragment key={road.road_id || road.name}>
                {/* Outer Glow Stroke */}
                <Polyline
                  positions={polylineCoords}
                  pathOptions={{
                    color: isSelected ? '#00f2fe' : color,
                    weight: isSelected ? 12 : 9,
                    opacity: 0.35,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />

                {/* Core Traffic Polyline */}
                <Polyline
                  positions={polylineCoords}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : color,
                    weight: isSelected ? 6 : 5,
                    opacity: 0.95,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                  eventHandlers={{
                    click: () => onSelectRoad && onSelectRoad(road)
                  }}
                >
                  <Tooltip sticky>
                    <div className="text-xs font-semibold px-1 py-0.5 font-sans">
                      <div className="text-slate-100 font-bold flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-cyan-400 transform rotate-45" />
                        {road.name || road.road_name}
                      </div>
                      <div className="text-slate-400 font-mono mt-0.5">
                        Speed: <span className="text-cyan-400 font-bold">{road.current_speed || road.current_speed_kmh} km/h</span> | Congestion: <span style={{ color }}>{road.congestion_level || road.congestion}</span>
                      </div>
                    </div>
                  </Tooltip>

                  <Popup>
                    <div className="p-1.5 min-w-[220px] font-sans">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm text-slate-100">{road.name || road.road_name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                          Google Maps
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 space-y-1.5 font-mono pt-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Area Zone:</span>
                          <span className="font-semibold text-slate-200">{road.area}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Speed:</span>
                          <span className="font-semibold text-cyan-400">{road.current_speed || road.current_speed_kmh} km/h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Free Flow Cap:</span>
                          <span className="font-semibold">{road.free_flow_speed || road.free_flow_speed_kmh} km/h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Congestion:</span>
                          <span className="font-bold" style={{ color }}>{road.congestion_level || road.congestion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Est. Travel Delay:</span>
                          <span className="font-semibold text-amber-400">{road.travel_time || road.travel_time_mins} mins</span>
                        </div>
                      </div>
                      {onSelectRoad && (
                        <button
                          onClick={() => onSelectRoad(road)}
                          className="w-full mt-2.5 py-1.5 px-2 text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/30 font-medium font-sans transition-colors"
                        >
                          View Corridor Analysis
                        </button>
                      )}
                    </div>
                  </Popup>
                </Polyline>
              </React.Fragment>
            );
          })}

          {/* Incident Pins */}
          {incidents.map((inc) => {
            const loc = inc.location;
            if (!loc || !loc.lat || !loc.lng) return null;

            return (
              <Marker
                key={inc.incident_id || `${loc.lat}-${loc.lng}`}
                position={[loc.lat, loc.lng]}
                icon={incidentIcon}
              >
                <Popup>
                  <div className="p-1 min-w-[200px] font-sans">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono">
                        {inc.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{inc.severity}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-100">{inc.road_name} ({inc.area})</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">{inc.description}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Floating Bottom Legend */}
      <div className="absolute bottom-3 left-3 z-30 bg-[#0f172a]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-2xl flex items-center gap-3 text-[10px] font-mono text-slate-300">
        <span className="font-bold text-cyan-400 font-sans">Traffic Flow:</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#00e676]"></span> Fast</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ffea00]"></span> Moderate</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ff9100]"></span> Heavy</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ff1744]"></span> Slow</span>
      </div>
    </div>
  );
}
