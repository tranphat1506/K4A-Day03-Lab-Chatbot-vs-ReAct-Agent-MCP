import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiChevronLeft, FiChevronRight, FiPlay, FiMonitor, 
  FiMapPin, FiNavigation, FiMap, FiInfo, FiClock, FiSettings,
  FiMessageSquare, FiDatabase, FiAlertTriangle, FiCheckCircle,
  FiCpu, FiGitBranch, FiTarget, FiBox, FiServer, FiGlobe
} from 'react-icons/fi';

const SLIDES = [
  {
    title: "Trợ Lý Thông Minh VinBus",
    subtitle: "ReAct Agent Pattern cho Bài toán Phương tiện Công cộng",
    content: (
      <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in-up">
        <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <FiMonitor size={64} />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 tracking-tight">Trợ Lý Thông Minh VinBus</h1>
        <p className="text-2xl text-gray-500">Ứng dụng ReAct Agent & Model Context Protocol</p>
        <div className="mt-8 px-6 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
          <p className="text-lg text-emerald-700 font-bold">Demo Day 3 - Khóa K4A</p>
        </div>
      </div>
    )
  },
  {
    title: "1. Đề tài & Lý do lựa chọn: Tại sao không dùng Chatbot thường?",
    content: (
      <div className="w-full h-full max-w-6xl mx-auto flex flex-col justify-center animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Cột Trái: Chatbot Truyền thống */}
          <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-md flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold text-red-600 mb-6 border-b border-red-100 pb-4 w-full">Chatbot Truyền Thống (RAG/Prompt)</h3>
            <div className="space-y-6 w-full">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <FiMessageSquare className="text-gray-500 mb-2" size={24} />
                <p className="font-medium">User: "Bao giờ xe buýt tới?"</p>
              </div>
              <div className="text-gray-400">⬇️</div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <FiDatabase className="text-blue-500 mb-2" size={24} />
                <p className="font-medium">Tìm kiếm trong Database tĩnh (PDF, Text)</p>
              </div>
              <div className="text-gray-400">⬇️</div>
              <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg border border-red-200">
                <FiAlertTriangle className="text-red-500 mb-2" size={24} />
                <p className="font-bold text-red-700">Thất bại / Hallucination</p>
                <p className="text-sm text-red-600 mt-1">Không có dữ liệu thời gian thực</p>
              </div>
            </div>
          </div>

          {/* Cột Phải: ReAct Agent */}
          <div className="bg-white p-8 rounded-2xl border-2 border-emerald-400 shadow-xl flex flex-col items-center text-center transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-bold text-emerald-600 mb-6 border-b border-emerald-100 pb-4 w-full">Trợ lý Thông minh (ReAct Agent)</h3>
            <div className="space-y-6 w-full">
              <div className="flex flex-col items-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <FiMessageSquare className="text-emerald-600 mb-2" size={24} />
                <p className="font-medium text-emerald-800">User: "Bao giờ xe buýt tới?"</p>
              </div>
              <div className="text-emerald-400 font-bold">⬇️ Phân tích Yêu cầu</div>
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <FiSettings className="text-blue-500 mb-2 animate-spin-slow" size={24} />
                <p className="font-medium text-blue-800">Kích hoạt Tool `get_eta()` lấy Live Data</p>
              </div>
              <div className="text-emerald-400 font-bold">⬇️ Trả về JSON Real-time</div>
              <div className="flex flex-col items-center p-4 bg-emerald-100 rounded-lg border border-emerald-300">
                <FiCheckCircle className="text-emerald-600 mb-2" size={24} />
                <p className="font-bold text-emerald-900">Trả lời chính xác!</p>
                <p className="text-sm text-emerald-700 mt-1">"Xe biển số X sắp tới trong 3 phút nữa"</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  },
  {
    title: "2. Tại sao Pattern ReAct Agent lại phù hợp? (4 Tiêu chí)",
    content: (
      <div className="w-full h-full max-w-6xl mx-auto flex flex-col justify-center animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-200 flex items-start gap-6">
            <div className="bg-blue-500 text-white p-4 rounded-xl shadow-md">
              <FiCpu size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">1. Suy luận đa bước (Reasoning)</h3>
              <p className="text-blue-700">Thay vì trả lời ngay, Agent tự chia nhỏ vấn đề: Tìm Tọa độ ➔ Tuyến đường ➔ Trạm gần nhất ➔ Giờ xe tới.</p>
            </div>
          </div>

          <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-200 flex items-start gap-6">
            <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-md">
              <FiSettings size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">2. Tương tác Công cụ (Acting)</h3>
              <p className="text-emerald-700">Agent có khả năng trực tiếp gọi các API của VinBus (thông qua MCP Server) để lấy dữ liệu thực tế (Live Data).</p>
            </div>
          </div>

          <div className="bg-orange-50 p-8 rounded-2xl border border-orange-200 flex items-start gap-6">
            <div className="bg-orange-500 text-white p-4 rounded-xl shadow-md">
              <FiGitBranch size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-900 mb-2">3. Quyết định Động (Dynamic Decision)</h3>
              <p className="text-orange-700">Dựa vào dữ liệu API trả về, Agent tự rẽ nhánh logic. Ví dụ: Nếu xe còn 30s, giục khách chạy ra; Nếu còn 20 phút, khuyên khách đi ăn sáng.</p>
            </div>
          </div>

          <div className="bg-purple-50 p-8 rounded-2xl border border-purple-200 flex items-start gap-6">
            <div className="bg-purple-500 text-white p-4 rounded-xl shadow-md">
              <FiTarget size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">4. Mục tiêu dài hạn (Long Horizon)</h3>
              <p className="text-purple-700">Hệ thống duy trì Chat History liên tục, đồng hành và hỗ trợ hành khách từ lúc đứng ở nhà cho đến khi bước lên đúng chiếc xe buýt.</p>
            </div>
          </div>

        </div>
      </div>
    )
  },
  {
    title: "3. Kiến trúc Hệ thống & Luồng thực thi",
    content: (
      <div className="w-full h-full max-w-6xl mx-auto flex flex-col justify-center animate-fade-in-up">
        
        {/* Sơ đồ kiến trúc tự thiết kế bằng CSS Grid & Flex */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          
          {/* Lớp Frontend */}
          <div className="flex flex-col items-center bg-gray-50 p-6 rounded-xl border border-gray-200 w-full md:w-1/4">
            <FiMonitor className="text-gray-600 mb-3" size={32} />
            <h4 className="font-bold text-gray-800">1. Client UI</h4>
            <p className="text-sm text-gray-500 text-center mt-2">Vite + React<br/>Tính năng Auto GPS</p>
          </div>

          <div className="text-gray-400 font-bold hidden md:block">➔ REST API ➔</div>
          <div className="text-gray-400 font-bold md:hidden">⬇️</div>

          {/* Lớp Backend */}
          <div className="flex flex-col items-center bg-blue-50 p-6 rounded-xl border border-blue-200 w-full md:w-1/4 relative">
            <div className="absolute -top-3 bg-blue-500 text-white text-xs px-2 py-1 rounded">FastAPI</div>
            <FiCpu className="text-blue-600 mb-3" size={32} />
            <h4 className="font-bold text-blue-900">2. ReAct Agent</h4>
            <p className="text-sm text-blue-700 text-center mt-2">LLM (Gemini/OpenAI)<br/>Lập kế hoạch (Thought)</p>
          </div>

          <div className="text-blue-400 font-bold hidden md:block">➔ Gọi Tools ➔</div>
          <div className="text-blue-400 font-bold md:hidden">⬇️</div>

          {/* Lớp MCP Server */}
          <div className="flex flex-col items-center bg-emerald-50 p-6 rounded-xl border border-emerald-200 w-full md:w-1/4 relative">
            <div className="absolute -top-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded">Python MCP</div>
            <FiBox className="text-emerald-600 mb-3" size={32} />
            <h4 className="font-bold text-emerald-900">3. MCP Server</h4>
            <p className="text-sm text-emerald-700 text-center mt-2">Đăng ký & Cung cấp<br/>5 Công cụ (Tools)</p>
          </div>

          <div className="text-emerald-400 font-bold hidden md:block">➔ HTTP GET ➔</div>
          <div className="text-emerald-400 font-bold md:hidden">⬇️</div>

          {/* Lớp Database Thực Tế */}
          <div className="flex flex-col items-center bg-red-50 p-6 rounded-xl border border-red-200 w-full md:w-1/4 relative">
            <div className="absolute -top-3 bg-red-500 text-white text-xs px-2 py-1 rounded">Live Data</div>
            <FiGlobe className="text-red-600 mb-3" size={32} />
            <h4 className="font-bold text-red-900">4. VinBus API</h4>
            <p className="text-sm text-red-700 text-center mt-2">Dữ liệu thời gian thực<br/>(Tọa độ, Lộ trình, ETA)</p>
          </div>

        </div>

      </div>
    )
  },
  {
    title: "4. Bộ 5 Công Cụ (Tools) Giao Tiếp Hệ Thống",
    content: (
      <div className="w-full h-full max-w-6xl mx-auto flex flex-col justify-center animate-fade-in-up">
        <div className="flex items-center gap-3 mb-8">
          <FiSettings className="text-blue-500" size={32} />
          <h3 className="text-2xl font-bold text-gray-700">MCP Server Tools</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tool 1 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <FiMapPin size={24} />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2 font-mono text-sm">1. geocoding_search</h4>
            <p className="text-gray-600">Biến đổi tên địa danh (Text) thành Tọa độ địa lý (Lat, Lng) để hệ thống có thể hiểu vị trí.</p>
          </div>
          
          {/* Tool 2 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <FiNavigation size={24} />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2 font-mono text-sm">2. get_directions</h4>
            <p className="text-gray-600">Tìm kiếm các tuyến đường khả thi nối từ Điểm A đến Điểm B, bao gồm số trạm và tuyến xe cần bắt.</p>
          </div>
          
          {/* Tool 3 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
              <FiMap size={24} />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2 font-mono text-sm">3. get_near_stations</h4>
            <p className="text-gray-600">Quét bán kính xung quanh vị trí hiện tại của User để liệt kê các trạm xe buýt gần nhất.</p>
          </div>
          
          {/* Tool 4 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-4">
              <FiInfo size={24} />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2 font-mono text-sm">4. get_station_detail</h4>
            <p className="text-gray-600">Tra cứu thông tin tĩnh của một trạm cụ thể (Các tuyến xe chạy qua, tần suất, giờ hoạt động).</p>
          </div>
          
          {/* Tool 5 (Ngôi sao) */}
          <div className="bg-emerald-50 p-6 rounded-xl border-2 border-emerald-400 shadow-md transform hover:-translate-y-1 transition-all md:col-span-2 lg:col-span-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">KEY FEATURE</div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <FiClock size={24} />
            </div>
            <h4 className="text-lg font-bold text-emerald-900 mb-2 font-mono text-sm">5. get_eta (Real-time)</h4>
            <p className="text-emerald-700 font-medium">Lấy thời gian thực xe tới bến (Live ETA). Trả về chính xác Biển số xe, Khoảng cách (mét) và Số giây đếm ngược.</p>
          </div>
        </div>
      </div>
    )
  }
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col font-sans select-none overflow-hidden">
      {/* HEADER */}
      <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shadow-sm z-10 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{slide.title}</h2>
        <div className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          Slide {currentSlide + 1} / {SLIDES.length}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden p-10 flex items-center justify-center bg-gray-50 relative">
        {slide.content}
      </div>

      {/* FOOTER CONTROLS */}
      <div className="h-24 bg-gray-900 flex items-center justify-between px-10 text-white z-10 flex-shrink-0">
        <div className="flex gap-4">
          <button 
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentSlide === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <FiChevronLeft size={20} /> Quay lại
          </button>
          <button 
            onClick={handleNext}
            disabled={currentSlide === SLIDES.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentSlide === SLIDES.length - 1 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            Tiếp theo <FiChevronRight size={20} />
          </button>
        </div>

        <button 
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg transition-transform hover:scale-105 animate-pulse"
        >
          <FiPlay size={20} /> TIẾN HÀNH DEMO TRỰC TIẾP
        </button>
      </div>
    </div>
  );
}
