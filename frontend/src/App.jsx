import { useState, useRef, useEffect } from 'react';
import { FaBus, FaMapMarkerAlt, FaPaperPlane, FaClock, FaRoute, FaServer, FaCheckCircle, FaSpinner, FaHistory } from 'react-icons/fa';
import { BiNetworkChart } from 'react-icons/bi';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestLogs, setLatestLogs] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuery = input;
    const currentHistory = [...messages];
    
    setMessages([...currentHistory, { role: 'user', content: userQuery }]);
    setInput('');
    setLoading(true);
    setLatestLogs([]);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          history: currentHistory
        })
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.final_answer }]);
      setLatestLogs(data.logs || []);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Mất kết nối tới hệ thống máy chủ VinBus!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* CỘT TRÁI: GIAO DIỆN CHAT (SMART ASSISTANT) */}
      <div className="w-full lg:w-2/3 flex flex-col bg-white shadow-xl z-10">
        
        {/* Header hiện đại */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <FaBus size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">VinBus Navigation</h1>
              <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Hệ thống trực tuyến
              </p>
            </div>
          </div>
        </div>

        {/* Khu vực nội dung Chat */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 scroll-smooth">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FaMapMarkerAlt size={40} className="text-slate-300" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-700">Bạn muốn đi đâu hôm nay?</h2>
              <p className="text-center max-w-md text-slate-500 leading-relaxed">
                Nhập vị trí hiện tại và điểm đến của bạn. Hệ thống sẽ tự động tìm trạm gần nhất và kiểm tra giờ xe tới theo thời gian thực.
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-sm rounded-full font-medium border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-colors" onClick={() => setInput("Tôi đang ở Ngã Tư Sở, muốn về Ocean Park")}>
                  Ngã Tư Sở ➔ Ocean Park
                </span>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center text-white mt-1 mr-3 shadow-sm">
                    <FaBus size={14} />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-[15px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-br-sm' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'
                }`}>
                  {/* Nếu là assistant, có thể format markdown (tạm thời render text, có thể dùng react-markdown sau) */}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator Modern */}
            {loading && (
              <div className="flex justify-start items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 mr-3">
                  <FaSpinner className="animate-spin" size={14} />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm p-4 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: "0.15s"}}></span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: "0.3s"}}></span>
                  </div>
                  <span className="text-sm text-slate-500 font-medium ml-2">Hệ thống đang truy xuất dữ liệu...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
              placeholder="Nhập địa điểm bạn đang đứng..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button 
              className={`absolute right-2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform ${
                loading || !input.trim() 
                  ? 'bg-slate-300 scale-95' 
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105 shadow-md'
              }`}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <FaPaperPlane size={14} className={input.trim() && !loading ? "ml-1" : ""} />
            </button>
          </div>
          <div className="text-center mt-2 text-xs text-slate-400 flex items-center justify-center gap-1">
            <FaCheckCircle className="text-emerald-500" /> Hệ thống lấy dữ liệu trực tiếp từ VinBus API
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: TRACE LOGS (Dành cho Dev/Demo) */}
      <div className="hidden lg:flex w-1/3 bg-slate-900 text-slate-300 flex-col border-l border-slate-800">
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BiNetworkChart size={20} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">System Trace</h2>
          </div>
          <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">ReAct Loop</span>
        </div>
        
        <div className="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar">
          {latestLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3">
              <FaServer size={32} className="opacity-20" />
              <p className="text-sm">Chưa có luồng thực thi nào.</p>
            </div>
          ) : (
            latestLogs.map((log, index) => (
              <div key={index} className="relative pl-6 pb-2 border-l-2 border-slate-700 last:border-l-0 last:pb-0 group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-slate-900 ${
                  log.action_type === 'FINAL_ANSWER' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}></div>

                <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-colors">
                  <div className={`px-3 py-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center ${
                    log.action_type === 'FINAL_ANSWER' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-blue-900/30 text-blue-400'
                  }`}>
                    <span>Step {log.step} - {log.action_type === 'FINAL_ANSWER' ? 'Response' : log.tool_name}</span>
                    <span className="flex items-center gap-1 opacity-70"><FaClock size={10} /> {log.latency_ms}ms</span>
                  </div>
                  
                  <div className="p-3 space-y-3 text-[13px]">
                    <div>
                      <span className="text-slate-500 font-medium mb-1 block">Logic Phân Tích:</span>
                      <p className="text-slate-300">{log.thought}</p>
                    </div>
                    
                    {log.action_type === 'TOOL_EXECUTION' && (
                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-500 font-medium block">Tham số (Input):</span>
                          <div className="mt-1 bg-slate-950 p-2 rounded text-emerald-400/90 font-mono text-xs overflow-x-auto">
                            {JSON.stringify(log.arguments)}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Kết quả API (Output):</span>
                          <div className="mt-1 bg-slate-950 p-2 rounded text-yellow-400/90 font-mono text-xs overflow-x-auto max-h-32">
                            {JSON.stringify(log.observation)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default App;
