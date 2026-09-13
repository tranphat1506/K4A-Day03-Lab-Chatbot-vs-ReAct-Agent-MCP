import { useState, useRef, useEffect } from 'react';
import { FaBus, FaPaperPlane, FaUserAstronaut, FaRoute, FaRobot, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { BiNetworkChart, BiBot } from 'react-icons/bi';

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
      setMessages(prev => [...prev, { role: 'assistant', content: "Xin lỗi, mình đang gặp sự cố kết nối tới máy chủ VinBus 😔" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* CỘT TRÁI: GIAO DIỆN CHAT FRIENDLY */}
      <div className="w-full lg:w-2/3 flex flex-col bg-[#F8FAFC] shadow-2xl z-10 relative">
        
        {/* Header Friendly */}
        <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-md">
                <FaBus size={22} />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">VinBus Buddy</h1>
              <p className="text-sm text-slate-500 font-medium">Trợ lý hỗ trợ tìm đường & tra cứu xe buýt</p>
            </div>
          </div>
        </div>

        {/* Khu vực nội dung Chat */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto scroll-smooth">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in-up">
              <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center shadow-inner">
                <BiBot size={60} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">Xin chào! Mình là VinBus Buddy 👋</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  Mình có thể giúp bạn tìm đường, định vị trạm gần nhất và xem xe buýt sắp tới trong bao nhiêu phút nữa!
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <button 
                  className="px-5 py-2.5 bg-white shadow-sm border border-slate-200 text-emerald-600 rounded-full text-sm font-semibold hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                  onClick={() => setInput("Mình đang ở Ngã Tư Sở, muốn đi VinUni")}
                >
                  📍 Từ Ngã Tư Sở đi VinUni
                </button>
                <button 
                  className="px-5 py-2.5 bg-white shadow-sm border border-slate-200 text-emerald-600 rounded-full text-sm font-semibold hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                  onClick={() => setInput("Gần đây có trạm xe buýt nào không?")}
                >
                  🚏 Tìm trạm gần đây
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex-shrink-0 flex items-center justify-center text-white mr-3 shadow-md">
                    <BiBot size={22} />
                  </div>
                )}
                
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 shadow-sm text-[15px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-sm' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm shadow-md'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 ml-3 shadow-inner">
                    <FaUserAstronaut size={18} />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex-shrink-0 flex items-center justify-center text-white mr-3 shadow-md">
                  <BiBot size={22} />
                </div>
                <div className="bg-white border border-slate-100 rounded-3xl rounded-bl-sm p-4 shadow-md flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-bounce"></span>
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: "0.15s"}}></span>
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: "0.3s"}}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area Friendly */}
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
          <div className="max-w-4xl mx-auto relative flex items-center bg-slate-100 rounded-full p-1.5 shadow-inner">
            <input 
              type="text" 
              className="w-full bg-transparent text-slate-700 rounded-full pl-6 pr-14 py-3 focus:outline-none placeholder-slate-400"
              placeholder="Nhắn tin cho VinBus Buddy..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button 
              className={`absolute right-2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform ${
                loading || !input.trim() 
                  ? 'bg-slate-300 scale-95' 
                  : 'bg-emerald-500 hover:bg-emerald-600 hover:scale-105 shadow-md'
              }`}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <FaPaperPlane size={14} className={input.trim() && !loading ? "mr-0.5 mt-0.5" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: TRACE LOGS (Dành cho Dev/Demo) */}
      <div className="hidden lg:flex w-1/3 bg-white flex-col border-l border-slate-200">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BiNetworkChart size={22} className="text-emerald-500" />
            <h2 className="text-sm font-extrabold text-slate-700 tracking-wider uppercase">System Trace</h2>
          </div>
          <span className="text-[10px] font-bold bg-emerald-100 px-2.5 py-1 rounded-full text-emerald-600">ReAct Loop</span>
        </div>
        
        <div className="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar bg-slate-50">
          {latestLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
              <FaSpinner size={32} className="opacity-20" />
              <p className="text-sm font-medium">Bảng theo dõi tiến trình Agent</p>
            </div>
          ) : (
            latestLogs.map((log, index) => (
              <div key={index} className="relative pl-6 pb-2 border-l-2 border-slate-200 last:border-l-0 last:pb-0 group">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-slate-50 ${
                  log.action_type === 'FINAL_ANSWER' ? 'bg-emerald-500' : 'bg-blue-400'
                }`}></div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex justify-between items-center ${
                    log.action_type === 'FINAL_ANSWER' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <span>Step {log.step} - {log.action_type === 'FINAL_ANSWER' ? 'Final Answer' : log.tool_name}</span>
                    <span className="flex items-center gap-1 opacity-70 bg-white px-2 py-0.5 rounded-full shadow-sm">
                      <FaClock size={10} /> {log.latency_ms}ms
                    </span>
                  </div>
                  
                  <div className="p-4 space-y-3 text-[13px]">
                    <div>
                      <span className="text-slate-500 font-bold mb-1.5 flex items-center gap-1">
                        <FaRobot className="text-slate-400"/> Agent Suy Luận:
                      </span>
                      <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{log.thought}</p>
                    </div>
                    
                    {log.action_type === 'TOOL_EXECUTION' && (
                      <div className="space-y-3 mt-3 pt-3 border-t border-slate-100">
                        <div>
                          <span className="text-slate-500 font-bold block mb-1 text-[11px] uppercase tracking-wider">Tham số (Input)</span>
                          <div className="bg-slate-800 p-2.5 rounded-lg text-emerald-300 font-mono text-xs overflow-x-auto shadow-inner">
                            {JSON.stringify(log.arguments)}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block mb-1 text-[11px] uppercase tracking-wider">Kết quả (Observation)</span>
                          <div className="bg-slate-800 p-2.5 rounded-lg text-yellow-300 font-mono text-xs overflow-x-auto max-h-32 shadow-inner">
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
