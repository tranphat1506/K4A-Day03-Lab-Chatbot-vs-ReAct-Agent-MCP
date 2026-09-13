import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMap } from 'react-icons/fi';

// Khắc phục icon của Leaflet bị lỗi trong React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component tự động zoom để fit vừa vặn đường vẽ
function ChangeView({ bounds }) {
  const map = useMap();
  if (bounds) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
  return null;
}

export default function MapCard({ startLat, startLng, endLat, endLng, regionCode }) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/directions?start_lat=${startLat}&start_lng=${startLng}&end_lat=${endLat}&end_lng=${endLng}&region_code=${regionCode}`);
        const data = await res.json();
        if (data.status === "SUCCESS") {
          setPoints(data.data);
        }
      } catch (e) {
        console.error("Map fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPath();
  }, [startLat, startLng, endLat, endLng, regionCode]);

  let bounds = null;
  if (points && points.length > 0) {
    bounds = L.latLngBounds(points);
  } else {
    bounds = L.latLngBounds([[startLat, startLng], [endLat, endLng]]);
  }

  return (
    <div className="bg-white border-2 border-emerald-100 rounded-xl overflow-hidden shadow-sm my-3 w-full max-w-md">
      <div className="bg-emerald-50 px-4 py-2 flex items-center gap-2 border-b border-emerald-100">
        <FiMap className="text-emerald-600" />
        <h3 className="font-bold text-emerald-900 text-sm">Bản đồ Lộ trình Tuyến</h3>
      </div>
      <div className="h-64 w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <span className="animate-pulse text-emerald-600 font-medium text-sm">Đang vẽ bản đồ...</span>
          </div>
        ) : (
          <MapContainer bounds={bounds} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.length > 0 && <Polyline positions={points} color="#10b981" weight={5} opacity={0.8} />}
            <Marker position={[startLat, startLng]}>
              <Popup>Điểm xuất phát</Popup>
            </Marker>
            <Marker position={[endLat, endLng]}>
              <Popup>Điểm đến</Popup>
            </Marker>
            <ChangeView bounds={bounds} />
          </MapContainer>
        )}
      </div>
    </div>
  );
}
