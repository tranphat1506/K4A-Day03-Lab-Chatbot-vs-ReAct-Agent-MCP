import { useState, useRef, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestLogs, setLatestLogs] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuery = input;
    const currentHistory = [...messages];
    
    // Add user message to UI
    setMessages([...currentHistory, { role: 'user', content: userQuery }]);
    setInput('');
    setLoading(true);
    setLatestLogs([]); // Reset logs for new turn

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
      setMessages(prev => [...prev, { role: 'assistant', content: "Lỗi kết nối tới Backend FastAPI!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* CỘT CHAT (TRÁI) */}
      <div className="w-2/3 flex flex-col border-r border-gray-300 bg-white">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 shadow-md z-10 flex items-center">
          <span className="text-2xl mr-2">🚌</span>
          <h1 className="text-xl font-bold">VinBus AI Agent (ReAct)</h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-xl font-semibold">Chào mừng đến với VinBus AI Assistant!</p>
              <p>Thử gõ: "Tôi đang ở Ngã Tư Sở, muốn về Ocean Park"</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-bl-none p-4 animate-pulse flex items-center space-x-2 border border-gray-200">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                <span className="ml-2 text-sm">Agent đang suy nghĩ & gọi API...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-2">
            <input 
              type="text" 
              className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button 
              className={`px-6 py-3 rounded-full text-white font-semibold transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              onClick={handleSend}
              disabled={loading}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>

      {/* CỘT LOGS (PHẢI) */}
      <div className="w-1/3 bg-gray-50 flex flex-col">
        <div className="bg-gray-800 text-white p-4 shadow-md flex items-center">
          <span className="text-xl mr-2">🔍</span>
          <h2 className="text-lg font-semibold">ReAct Trace Logs</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {latestLogs.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              Chưa có logs cho lượt chat này.
            </div>
          ) : (
            latestLogs.map((log, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden text-sm">
                <div className={`p-2 font-bold text-white ${log.action_type === 'FINAL_ANSWER' ? 'bg-green-600' : 'bg-blue-600'}`}>
                  Step {log.step}: {log.action_type === 'FINAL_ANSWER' ? 'FINAL ANSWER' : `CALL ${log.tool_name}`}
                </div>
                
                <div className="p-3 space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700 block mb-1">🧠 Thought:</span>
                    <p className="text-gray-600 italic bg-gray-50 p-2 rounded">{log.thought}</p>
                  </div>
                  
                  {log.action_type === 'TOOL_EXECUTION' && (
                    <>
                      <div>
                        <span className="font-semibold text-gray-700 block mb-1">🛠️ Arguments:</span>
                        <pre className="bg-gray-800 text-green-400 p-2 rounded overflow-x-auto text-xs">
                          {JSON.stringify(log.arguments, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700 block mb-1">👁️ Observation:</span>
                        <pre className="bg-gray-800 text-yellow-400 p-2 rounded overflow-x-auto text-xs max-h-40">
                          {JSON.stringify(log.observation, null, 2)}
                        </pre>
                      </div>
                    </>
                  )}
                  <div className="text-xs text-gray-400 text-right">
                    ⏱️ Latency: {log.latency_ms} ms
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
