import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMaximize, FiMinimize } from 'react-icons/fi';

// Icons
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const stationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const busIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

function ChangeView({ bounds }) {
  const map = useMap();
  if (bounds) map.fitBounds(bounds, { padding: [50, 50] });
  return null;
}

export default function LiveTrackerMap({ startLat, startLng, stationLat, stationLng, endLat, endLng, regionCode, liveData, targetRoute }) {
  const [fullPath, setFullPath] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [path, setPath] = useState([]);
  
  // Fetch đường đi đầy đủ từ API directions
  useEffect(() => {
    const fetchPath = async () => {
      if (!startLat || !endLat) {
        // Fallback: chỉ vẽ đường nối thẳng
        if (startLat && stationLat) {
          setPath([[startLat, startLng], [stationLat, stationLng]]);
        }
        return;
      }
      try {
        const res = await fetch(`http://localhost:8000/api/directions?start_lat=${startLat}&start_lng=${startLng}&end_lat=${endLat}&end_lng=${endLng}&region_code=${regionCode || 'hn'}`);
        const data = await res.json();
        if (data.status === "SUCCESS" && data.data && data.data.length > 0) {
          setFullPath(data.data);
          // Đường bộ (từ điểm đầu -> Trạm đầu tiên) sẽ dùng path nét đứt
          setPath([[startLat, startLng], [stationLat, stationLng]]);
        }
      } catch (e) {
        console.error("Lỗi fetch full path:", e);
      }
    };
    fetchPath();
  }, [startLat, startLng, endLat, endLng, stationLat, stationLng, regionCode]);

  // Tìm các xe buýt của tuyến đang theo dõi
  let buses = [];
  if (liveData) {
    const routeInfo = liveData.find(r => r.routeNo === targetRoute);
    if (routeInfo && routeInfo.list) {
      buses = routeInfo.list.filter(b => b.lat && b.lng);
    }
  }

  // Bounds
  let boundsCoords = [];
  if (startLat && startLng) boundsCoords.push([startLat, startLng]);
  if (stationLat && stationLng) boundsCoords.push([stationLat, stationLng]);
  buses.forEach(b => boundsCoords.push([b.lat, b.lng]));
  
  if (endLat && endLng) boundsCoords.push([endLat, endLng]);
  if (fullPath.length > 0) boundsCoords.push(...fullPath);
  if (boundsCoords.length === 0) {
    boundsCoords.push([21.0285, 105.8542]); // Fallback Hanoi
  }
  const bounds = L.latLngBounds(boundsCoords);

  return (
    <div className={isFullscreen 
      ? "fixed inset-4 z-50 rounded-xl overflow-hidden shadow-2xl border-4 border-emerald-500 bg-white" 
      : "h-64 w-full rounded-xl overflow-hidden border border-gray-200 mt-4 relative z-0"}>
      
      <button 
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-2 right-2 z-[400] bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 border border-gray-200"
        title={isFullscreen ? "Thu nhỏ" : "Phóng to"}
      >
        {isFullscreen ? <FiMinimize size={20} className="text-gray-700" /> : <FiMaximize size={20} className="text-gray-700" />}
      </button>

      <MapContainer bounds={bounds} style={{ height: '100%', width: '100%' }} scrollWheelZoom={isFullscreen}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fullPath.length > 0 && <Polyline positions={fullPath} color="#10b981" weight={6} opacity={0.8} />}
        <Polyline positions={path} color="#3b82f6" weight={4} dashArray="5, 10" opacity={0.7} />
        
        {startLat && startLng && (
          <Marker position={[startLat, startLng]} icon={startIcon}>
            <Popup>Vị trí xuất phát</Popup>
          </Marker>
        )}
        
        {endLat && endLng && (
          <Marker position={[endLat, endLng]} icon={endIcon}>
            <Popup>Điểm đến cuối cùng</Popup>
          </Marker>
        )}
        
        {stationLat && stationLng && (
          <Marker position={[stationLat, stationLng]} icon={stationIcon}>
            <Popup>Trạm đón</Popup>
          </Marker>
        )}
        
        {buses.map((bus, idx) => (
          <Marker key={idx} position={[bus.lat, bus.lng]} icon={busIcon}>
            <Popup>
              <strong>Xe {bus.vehicleNumber || bus.busId}</strong><br/>
              Đang tới: {Math.ceil(bus.time / 60)} phút
            </Popup>
          </Marker>
        ))}
        
        <ChangeView bounds={bounds} />
      </MapContainer>
    </div>
  );
}
