import { useState } from 'react';
import { FaBus, FaMapMarkerAlt, FaSearch, FaHistory, FaServer, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { BiNetworkChart, BiMenu } from 'react-icons/bi';

function App() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!input.trim()) return;

    const query = input;
    setInput('');
    setLoading(true);

    const newEntry = {
      id: Date.now(),
      query: query,
      result: null,
      logs: [],
      status: 'loading'
    };

    setHistory([newEntry, ...history]);

    try {
      // Fake history for backend (optional, here we just send the current query to make it stateless in UI or we can map history)
      const backendHistory = history.map(h => [
        { role: 'user', content: h.query },
        { role: 'assistant', content: h.result }
      ]).flat().filter(h => h.content);

      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          history: backendHistory.slice(0, 4) // Send last 2 turns
        })
      });
      
      const data = await response.json();
      
      setHistory(prev => prev.map(item => 
        item.id === newEntry.id 
          ? { ...item, result: data.final_answer, logs: data.logs || [], status: 'success' }
          : item
      ));
    } catch (error) {
      console.error(error);
      setHistory(prev => prev.map(item => 
        item.id === newEntry.id 
          ? { ...item, result: "Lỗi hệ thống: Không thể kết nối tới VinBus Server.", status: 'error' }
          : item
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-slate-800 flex flex-col">
      
      {/* TOP NAVIGATION BAR */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center text-white">
              <FaBus size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">VinBus Control Center</h1>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Tracking System
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-emerald-600">Trang chủ</a>
            <a href="#" className="hover:text-emerald-600">Bản đồ tuyến</a>
            <a href="#" className="hover:text-emerald-600">Trạm dừng</a>
            <div className="w-px h-4 bg-slate-300"></div>
            <button className="text-slate-400 hover:text-slate-600"><BiMenu size={24} /></button>
          </div>
        </div>
      </header>

      {/* SEARCH BAR SECTION */}
      <div className="bg-emerald-600 pt-10 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Tra cứu Lộ trình & Thời gian thực</h2>
          <p className="text-emerald-100 text-sm">Hệ thống phân tích thông minh tự động trích xuất thông tin điều hướng mạng lưới xe buýt.</p>
        </div>
        
        <div className="max-w-3xl mx-auto relative shadow-2xl rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaMapMarkerAlt className="text-slate-400" size={20} />
          </div>
          <input 
            type="text" 
            className="w-full bg-white text-slate-800 rounded-lg pl-12 pr-32 py-5 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-300/50 transition-all"
            placeholder="VD: Tôi đang ở Ngã Tư Sở, làm sao để đi đến Ocean Park?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            disabled={loading}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button 
              className={`px-6 py-3 rounded text-white font-bold transition-all shadow-md ${
                loading || !input.trim() 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95'
              }`}
              onClick={handleSearch}
              disabled={loading || !input.trim()}
            >
              {loading ? 'Đang quét...' : 'Tra cứu'}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA (RESULTS & TRACE) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 -mt-8 pb-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LỊCH SỬ KẾT QUẢ (FEED) */}
        <div className="w-full lg:w-2/3 space-y-6">
          {history.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-10 text-center text-slate-400 h-64 flex flex-col items-center justify-center">
              <FaSearch size={48} className="mb-4 text-slate-200" />
              <p className="text-lg font-medium text-slate-500">Chưa có dữ liệu tra cứu.</p>
              <p className="text-sm">Hãy nhập yêu cầu vào thanh tìm kiếm bên trên.</p>
            </div>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {/* Query Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex gap-3 items-start">
                  <div className="mt-1 text-blue-500"><FaSearch size={16} /></div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Nội dung yêu cầu</span>
                    <h3 className="text-lg font-semibold text-slate-700">{entry.query}</h3>
                  </div>
                </div>
                
                {/* Result Body */}
                <div className="p-6">
                  {entry.status === 'loading' ? (
                    <div className="flex items-center gap-4 text-emerald-600">
                      <FaSpinner size={24} className="animate-spin" />
                      <div>
                        <p className="font-semibold">Hệ thống đang thu thập dữ liệu lộ trình...</p>
                        <p className="text-xs text-slate-400">Đang thực thi các tác vụ tính toán không gian và truy xuất API nội bộ.</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <FaCheckCircle className="text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Kết quả phân tích</span>
                      </div>
                      <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                        {entry.result}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* CỘT LOGS BÊN PHẢI (MONITORING) */}
        <div className="w-full lg:w-1/3 bg-slate-900 rounded-lg shadow-xl border border-slate-800 overflow-hidden sticky top-24">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200">
              <BiNetworkChart size={18} className="text-blue-400" />
              <h3 className="text-sm font-bold tracking-wide uppercase">Server Monitor</h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-1 bg-slate-800 text-emerald-400 rounded">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping mr-1"></span> Live
            </div>
          </div>
          
          <div className="p-4 h-[500px] overflow-y-auto custom-scrollbar space-y-4">
            {history.length > 0 && history[0].status === 'loading' && (
              <div className="text-slate-400 text-xs text-center flex flex-col items-center gap-2 mt-10">
                <FaSpinner className="animate-spin text-emerald-500" size={24} />
                Đang chờ luồng dữ liệu từ máy chủ...
              </div>
            )}
            
            {history.length > 0 && history[0].status !== 'loading' && history[0].logs.length === 0 && (
              <div className="text-slate-500 text-xs text-center mt-10">
                Không ghi nhận log hệ thống.
              </div>
            )}
            
            {history.length > 0 && history[0].logs.map((log, index) => (
              <div key={index} className="bg-slate-800/80 rounded border border-slate-700 p-3 text-xs shadow-inner">
                <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                  <span className={`font-bold uppercase tracking-wider ${log.action_type === 'FINAL_ANSWER' ? 'text-emerald-400' : 'text-blue-400'}`}>
                    STEP {log.step}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1"><FaClock size={10}/> {log.latency_ms}ms</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-500 font-medium block">PROCESS:</span>
                    <p className="text-slate-300 mt-0.5">{log.thought}</p>
                  </div>
                  
                  {log.action_type === 'TOOL_EXECUTION' && (
                    <>
                      <div>
                        <span className="text-slate-500 font-medium block">EXECUTE: {log.tool_name}</span>
                        <div className="bg-slate-950 p-1.5 rounded mt-1 text-amber-300/80 font-mono overflow-x-auto">
                          {JSON.stringify(log.arguments)}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">RESPONSE:</span>
                        <div className="bg-slate-950 p-1.5 rounded mt-1 text-emerald-300/80 font-mono overflow-x-auto max-h-24">
                          {JSON.stringify(log.observation)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
}

export default App;
