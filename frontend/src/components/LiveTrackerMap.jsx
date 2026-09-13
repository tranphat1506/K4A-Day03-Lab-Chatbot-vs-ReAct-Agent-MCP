import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

export default function LiveTrackerMap({ startLat, startLng, stationLat, stationLng, liveData, targetRoute }) {
  const [path, setPath] = useState([]);
  
  // Vẽ đường nối từ User ra Trạm (đường bộ)
  useEffect(() => {
    if (startLat && startLng && stationLat && stationLng) {
      setPath([[startLat, startLng], [stationLat, stationLng]]);
    }
  }, [startLat, startLng, stationLat, stationLng]);

  // Tìm các xe buýt của tuyến đang theo dõi
  let buses = [];
  if (liveData) {
    const routeInfo = liveData.find(r => r.routeNo === targetRoute);
    if (routeInfo && routeInfo.list) {
      buses = routeInfo.list.filter(b => b.lat && b.lng);
    }
  }

  // Bounds
  let boundsCoords = [[startLat, startLng], [stationLat, stationLng]];
  buses.forEach(b => boundsCoords.push([b.lat, b.lng]));
  const bounds = L.latLngBounds(boundsCoords);

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 mt-4 relative z-0">
      <MapContainer bounds={bounds} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={path} color="#3b82f6" weight={4} dashArray="5, 10" opacity={0.7} />
        
        {startLat && startLng && (
          <Marker position={[startLat, startLng]} icon={startIcon}>
            <Popup>Vị trí của bạn</Popup>
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
