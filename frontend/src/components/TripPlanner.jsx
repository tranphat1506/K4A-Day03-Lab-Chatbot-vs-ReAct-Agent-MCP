import React, { useState, useEffect } from 'react';
import { FiClock, FiCheck, FiBell, FiTrash2 } from 'react-icons/fi';

// 1. Component hiển thị đề xuất trong Chat
export function ProposedPlanCard({ regionCode, boardingStationId, stationName, stationLat, stationLng, routeNo, walkTimeMins, startLat, startLng }) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    // Xin quyền hiển thị thông báo trình duyệt
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
    
    if (Notification.permission === "granted" || Notification.permission === "default") {
      const plan = {
        id: Date.now().toString(),
        regionCode,
        boardingStationId,
        stationName: stationName || `Trạm ${boardingStationId}`,
        stationLat,
        stationLng,
        routeNo,
        walkTimeMins: walkTimeMins || 5,
        startLat,
        startLng,
        status: 'active'
      };
      
      // Lưu vào LocalStorage
      const existing = JSON.parse(localStorage.getItem('vinbus_plans') || '[]');
      localStorage.setItem('vinbus_plans', JSON.stringify([...existing, plan]));
      
      setConfirmed(true);
      // Bắn event để GlobalTracker nhận biết
      window.dispatchEvent(new Event('vinbus_plan_updated'));
      
      new Notification("Kế hoạch đã được lưu!", {
        body: `Hệ thống sẽ chạy ngầm và báo động khi tuyến ${routeNo} sắp tới trạm ${boardingStationId}.`,
        icon: "/vite.svg"
      });
    } else {
      alert("Bạn cần cấp quyền Thông báo (Notification) để hệ thống có thể báo động cho bạn!");
    }
  };

  if (confirmed) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 my-2 flex items-center gap-2">
        <FiCheck className="text-emerald-500" />
        <span className="text-emerald-700 text-sm font-medium">Đã lưu kế hoạch và đang theo dõi ngầm.</span>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-indigo-100 rounded-xl p-4 shadow-sm my-3 max-w-sm">
      <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
        <FiClock className="text-indigo-500" />
        Kế hoạch: Đón xe {routeNo}
      </h3>
      <ul className="text-sm text-gray-600 mb-4 space-y-1">
        <li>📍 Trạm đón: <strong>{stationName || boardingStationId}</strong></li>
        <li>🚶 Đi bộ ra bến: <strong>{walkTimeMins} phút</strong></li>
        <li>🔔 Hệ thống sẽ báo động trước khi xe đến.</li>
      </ul>
      <button 
        onClick={handleConfirm}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <FiBell />
        Xác nhận & Theo dõi
      </button>
    </div>
  );
}

// 2. Component chạy ngầm toàn cục (Mount ở App.jsx)
export function GlobalTracker() {
  const [plans, setPlans] = useState([]);
  
  const loadPlans = () => {
    const stored = JSON.parse(localStorage.getItem('vinbus_plans') || '[]');
    setPlans(stored);
  };

  useEffect(() => {
    loadPlans();
    window.addEventListener('vinbus_plan_updated', loadPlans);
    return () => window.removeEventListener('vinbus_plan_updated', loadPlans);
  }, []);

  useEffect(() => {
    if (plans.length === 0) return;

    let timeoutId;
    let isMounted = true;

    const poll = async () => {
      for (const plan of plans) {
        try {
          const res = await fetch(`http://localhost:8000/api/eta?region_code=${plan.regionCode}&station_id=${plan.boardingStationId}`);
          const data = await res.json();
          if (data.status === "SUCCESS") {
            let fastest_eta = Infinity;
            
            for (const route of data.data) {
              if (route.routeNo === plan.routeNo) {
                for (const bus of route.list) {
                  const eta = Math.ceil(bus.time / 60);
                  if (eta < fastest_eta) fastest_eta = eta;
                }
              }
            }
            
            console.log(`[Tracker ${plan.routeNo}] Fastest ETA: ${fastest_eta} mins`);
            
            // Smart polling interval
            let nextInterval = 60000; // default 1 min
            
            if (fastest_eta !== Infinity) {
              // Báo động!
              if (fastest_eta <= plan.walkTimeMins + 2) {
                new Notification("BẮT ĐẦU DI CHUYỂN!", {
                  body: `Xe ${plan.routeNo} chỉ còn cách bạn ${fastest_eta} phút. Hãy ra bến ngay!`,
                  requireInteraction: true
                });
                
                // Xóa plan sau khi báo động
                const remaining = plans.filter(p => p.id !== plan.id);
                localStorage.setItem('vinbus_plans', JSON.stringify(remaining));
                window.dispatchEvent(new Event('vinbus_plan_updated'));
                return; // Ngừng poll plan này
              }
              
              if (fastest_eta > 10) nextInterval = 180000; // 3 mins
              else if (fastest_eta > 3) nextInterval = 60000; // 1 min
              else nextInterval = 15000; // 15s
            }
            
            if (isMounted) {
              timeoutId = setTimeout(poll, nextInterval);
            }
            return; // Chỉ xử lý 1 plan cùng lúc để đơn giản
          }
        } catch (e) {
          console.error("Tracker poll error", e);
        }
      }
      
      if (isMounted) {
        timeoutId = setTimeout(poll, 60000);
      }
    };

    poll();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [plans]);

  const removePlan = (id) => {
    const remaining = plans.filter(p => p.id !== id);
    localStorage.setItem('vinbus_plans', JSON.stringify(remaining));
    loadPlans();
  };

  if (plans.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {plans.map(plan => (
        <div key={plan.id} className="bg-indigo-900 text-white p-3 rounded-lg shadow-xl border border-indigo-700 flex items-center gap-3 text-sm animate-fade-in-down">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <p className="font-bold text-emerald-300">Đang theo dõi {plan.routeNo}</p>
            <p className="text-xs text-indigo-200">Trạm: {plan.boardingStationId}</p>
          </div>
          <button onClick={() => removePlan(plan.id)} className="ml-2 text-indigo-300 hover:text-red-400 transition-colors p-1" title="Hủy theo dõi">
            <FiTrash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
