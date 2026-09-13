import { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiCpu, FiTerminal, FiClock } from 'react-icons/fi';

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
      setMessages(prev => [...prev, { role: 'assistant', content: "System error: Connection refused." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white font-mono text-sm overflow-hidden">
      
      {/* CỘT TRÁI: MINIMALIST CHAT */}
      <div className="w-full lg:w-2/3 flex flex-col bg-white border-r border-gray-200 z-10 relative">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
              <FiCpu size={16} />
            </div>
            <div>
              <h1 className="text-base font-semibold text-black tracking-tight">VinBus Agent</h1>
              <p className="text-xs text-gray-500">Autonomous navigation assistant</p>
            </div>
          </div>
        </div>

        {/* Khu vực nội dung Chat */}
        <div className="flex-1 p-6 overflow-y-auto scroll-smooth">
          {messages.length === 0 && (
            <div className="flex flex-col h-full items-start justify-end pb-10 space-y-4">
              <h2 className="text-2xl font-light text-black">VinBus Navigation System</h2>
              <p className="text-gray-500 max-w-md">
                Enter your location and destination. The system will retrieve real-time telemetry from the VinBus network.
              </p>
              <div className="flex gap-2 mt-4">
                <button 
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-colors"
                  onClick={() => setInput("Từ Ngã Tư Sở đi VinUni")}
                >
                  Nga Tu So to VinUni
                </button>
                <button 
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-colors"
                  onClick={() => setInput("Tìm trạm xe buýt gần nhất")}
                >
                  Find nearest station
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-8">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-black flex-shrink-0 flex items-center justify-center text-white mr-4">
                    <FiCpu size={14} />
                  </div>
                )}
                
                <div className={`max-w-[80%] p-4 text-[14px] leading-relaxed border ${
                  msg.role === 'user' 
                    ? 'bg-gray-50 border-gray-200 text-black' 
                    : 'bg-white border-gray-200 text-black'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-200 flex-shrink-0 flex items-center justify-center text-black ml-4">
                    <FiUser size={14} />
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start items-center">
                <div className="w-8 h-8 bg-black flex-shrink-0 flex items-center justify-center text-white mr-4">
                  <FiCpu size={14} />
                </div>
                <div className="p-4 border border-gray-200 text-gray-400 bg-white flex items-center gap-2">
                  Processing request...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <input 
              type="text" 
              className="w-full bg-white border border-gray-300 text-black p-4 focus:outline-none focus:border-black transition-colors"
              placeholder="Enter prompt..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button 
              className={`absolute right-4 text-black transition-colors ${
                loading || !input.trim() 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:text-gray-500'
              }`}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: TRACE LOGS */}
      <div className="hidden lg:flex w-1/3 bg-gray-50 flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiTerminal size={16} className="text-black" />
            <h2 className="text-xs font-semibold text-black tracking-widest uppercase">System Log</h2>
          </div>
          <span className="text-[10px] uppercase border border-gray-300 px-2 py-0.5 text-gray-500 bg-white">ReAct Tracer</span>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {latestLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <span className="text-xs">Awaiting execution.</span>
            </div>
          ) : (
            latestLogs.map((log, index) => (
              <div key={index} className="pl-4 pb-4 border-l border-gray-300 last:border-l-0 last:pb-0 relative">
                <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 border border-gray-400 bg-white`}></div>

                <div className="bg-white border border-gray-200 p-3">
                  <div className="text-[11px] font-semibold text-black uppercase tracking-wider flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                    <span>{log.action_type === 'FINAL_ANSWER' ? 'FINAL_ANSWER' : log.tool_name}</span>
                    <span className="flex items-center gap-1 text-gray-400 font-normal">
                      <FiClock size={10} /> {log.latency_ms}ms
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-[12px]">
                    <div>
                      <span className="text-gray-400 uppercase text-[10px] block mb-1">Thought</span>
                      <p className="text-gray-800">{log.thought}</p>
                    </div>
                    
                    {log.action_type === 'TOOL_EXECUTION' && (
                      <div className="space-y-2 mt-2 pt-2 border-t border-gray-100">
                        <div>
                          <span className="text-gray-400 uppercase text-[10px] block mb-1">Arguments</span>
                          <div className="bg-gray-50 border border-gray-100 p-2 text-gray-600 font-mono text-[10px] overflow-x-auto">
                            {JSON.stringify(log.arguments)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 uppercase text-[10px] block mb-1">Observation</span>
                          <div className="bg-gray-50 border border-gray-100 p-2 text-gray-600 font-mono text-[10px] overflow-x-auto max-h-32">
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
