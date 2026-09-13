import { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiMap, FiClock, FiSearch, FiMessageSquare } from 'react-icons/fi';

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
      setMessages(prev => [...prev, { role: 'assistant', content: "Hệ thống đang bảo trì. Vui lòng thử lại sau." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* CỘT TRÁI: GIAO DIỆN CLIENT TỐI GIẢN & THÂN THIỆN */}
      <div className="w-full lg:w-2/3 flex flex-col bg-white border-r border-gray-200 z-10 shadow-sm">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-md flex items-center justify-center text-white shadow-sm">
              <FiMap size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Hỗ trợ lộ trình VinBus</h1>
              <p className="text-sm text-emerald-600 font-medium">Trực tuyến</p>
            </div>
          </div>
        </div>

        {/* Khung Chat */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto scroll-smooth bg-gray-50/50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-5 animate-fade-in-up">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-2">
                <FiMessageSquare size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Xin chào!</h2>
                <p className="text-gray-500 max-w-md mx-auto text-base">
                  Vui lòng nhập điểm đi và điểm đến. Hệ thống sẽ hướng dẫn chi tiết lộ trình và thời gian xe buýt đến trạm cho bạn.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <button 
                  className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-sm"
                  onClick={() => setInput("Tôi đang ở Ngã Tư Sở, muốn đi VinUni")}
                >
                  Từ Ngã Tư Sở đi VinUni
                </button>
                <button 
                  className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-sm"
                  onClick={() => setInput("Tìm trạm xe buýt gần nhất")}
                >
                  Tìm trạm gần nhất
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-9 h-9 bg-emerald-100 rounded-md flex-shrink-0 flex items-center justify-center text-emerald-700 mr-4 mt-1">
                    <FiMap size={18} />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-lg p-4 text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white border border-gray-100 text-gray-800'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-9 h-9 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-gray-600 ml-4 mt-1">
                    <FiUser size={18} />
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start items-center">
                <div className="w-9 h-9 bg-emerald-100 rounded-md flex-shrink-0 flex items-center justify-center text-emerald-700 mr-4">
                  <FiMap size={18} />
                </div>
                <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">Đang xử lý yêu cầu...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Khung Nhập Liệu */}
        <div className="p-5 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <FiSearch size={18} />
            </div>
            <input 
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg pl-12 pr-14 py-3.5 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              placeholder="Nhập địa điểm hoặc câu hỏi của bạn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button 
              className={`absolute right-2 w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                loading || !input.trim() 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
              }`}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <FiSend size={16} className={input.trim() && !loading ? "-ml-0.5 mt-0.5" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: HỆ THỐNG THEO DÕI LOGS (Cho Demo) */}
      <div className="hidden lg:flex w-1/3 bg-[#1e293b] flex-col text-slate-300">
        <div className="p-5 border-b border-slate-700/50 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiClock size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold tracking-wide text-slate-100">Trace Logs</h2>
          </div>
          <span className="text-xs border border-slate-700 bg-slate-800 px-2.5 py-1 rounded-md text-slate-400">System Activity</span>
        </div>
        
        <div className="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar">
          {latestLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
              <span className="text-sm">Chưa có luồng thực thi nào.</span>
            </div>
          ) : (
            latestLogs.map((log, index) => (
              <div key={index} className="pl-4 pb-4 border-l border-slate-700 last:border-l-0 last:pb-0 relative">
                <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${
                  log.action_type === 'FINAL_ANSWER' ? 'bg-emerald-500' : 'bg-blue-400'
                }`}></div>

                <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
                  <div className="text-xs font-semibold text-slate-200 uppercase tracking-wide flex justify-between items-center mb-3 pb-3 border-b border-slate-700/50">
                    <span className={log.action_type === 'FINAL_ANSWER' ? 'text-emerald-400' : 'text-blue-400'}>
                      {log.action_type === 'FINAL_ANSWER' ? 'Hoàn thành' : log.tool_name}
                    </span>
                    <span className="text-slate-400 font-normal">
                      {log.latency_ms}ms
                    </span>
                  </div>
                  
                  <div className="space-y-4 text-[13px]">
                    <div>
                      <span className="text-slate-500 text-xs block mb-1">Mục đích:</span>
                      <p className="text-slate-300 leading-relaxed">{log.thought}</p>
                    </div>
                    
                    {log.action_type === 'TOOL_EXECUTION' && (
                      <div className="space-y-3">
                        <div className="bg-[#0f172a] rounded-md p-3 border border-slate-700/50">
                          <span className="text-slate-500 text-xs block mb-1">Dữ liệu gửi đi (Input):</span>
                          <div className="text-emerald-300/80 font-mono text-xs overflow-x-auto">
                            {JSON.stringify(log.arguments)}
                          </div>
                        </div>
                        <div className="bg-[#0f172a] rounded-md p-3 border border-slate-700/50">
                          <span className="text-slate-500 text-xs block mb-1">Dữ liệu nhận về (Output):</span>
                          <div className="text-yellow-300/80 font-mono text-xs overflow-x-auto max-h-32">
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
