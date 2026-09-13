import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Mermaid from './Mermaid';
import { 
  FiChevronLeft, FiChevronRight, FiPlay, FiMonitor, 
  FiMapPin, FiNavigation, FiMap, FiInfo, FiClock, FiSettings 
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
    title: "1. Đề tài & Lý do lựa chọn (Chatbot vs ReAct Agent)",
    chartId: "slide1",
    chart: `flowchart TD
    subgraph Traditional["Chatbot Truyền Thống (RAG/Prompt)"]
        A1[Người dùng hỏi: Bao giờ xe buýt tới?] --> B1[LLM tìm trong Database tĩnh]
        B1 --> C1[Không có dữ liệu thời gian thực]
        C1 --> D1[Trả lời thất bại / Hallucination]
    end
    
    subgraph ReAct["Trợ lý Thông minh VinBus (ReAct Agent)"]
        A2[Người dùng hỏi: Bao giờ xe buýt tới?] --> B2[LLM nhận diện Yêu cầu]
        B2 --> C2[LLM kích hoạt Tool get_eta]
        C2 --> D2[Lấy Live Data từ hệ thống VinBus API]
        D2 --> E2[Trả lời chính xác: Xe sắp tới trong 3 phút]
    end
    
    Traditional ~~~ ReAct
    
    style C1 fill:#fca5a5,stroke:#b91c1c
    style D1 fill:#f87171,stroke:#991b1b,color:white
    style C2 fill:#a7f3d0,stroke:#047857
    style D2 fill:#34d399,stroke:#065f46
    style E2 fill:#10b981,stroke:#064e3b,color:white`
  },
  {
    title: "2. Tại sao ReAct Agent phù hợp? (4 Tiêu chí Agent Fit)",
    chartId: "slide2",
    chart: `flowchart LR
    Center((Tại sao<br/>ReAct Agent<br/>Phù hợp?))
    
    Center --- A[1. Suy luận đa bước<br/>Multi-step Reasoning]
    A --- A1(Tìm Tọa độ ➔ Tuyến ➔ Trạm ➔ Giờ xe tới)
    
    Center --- B[2. Tương tác Công cụ<br/>Tool Interaction]
    B --- B1(Giao tiếp trực tiếp hệ thống API VinBus)
    
    Center --- C[3. Quyết định Động<br/>Dynamic Decision]
    C --- C1(Tự thay đổi lộ trình đề xuất nếu xe quá lâu)
    
    Center --- D[4. Mục tiêu dài hạn<br/>Long Horizon]
    D --- D1(Lưu bối cảnh, hỗ trợ đến khi khách lên xe)
    
    style Center fill:#3b82f6,color:#fff,stroke:#1e3a8a,stroke-width:3px
    style A fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    style B fill:#dcfce3,stroke:#16a34a,stroke-width:2px
    style C fill:#fef3c7,stroke:#d97706,stroke-width:2px
    style D fill:#f3e8ff,stroke:#9333ea,stroke-width:2px`
  },
  {
    title: "3. Kiến trúc Hệ thống & Luồng thực thi Agent",
    chartId: "slide3",
    chart: `flowchart TD
    subgraph Frontend["Client UI (Vite + React)"]
        UI[Giao diện Client]
        GPS[Hệ thống bắt GPS tự động]
    end

    subgraph Backend["Backend (FastAPI)"]
        API[REST API Endpoint]
        LLM{Bộ não ReAct Agent <br/> Gemini / OpenAI}
    end

    subgraph MCP["Model Context Protocol"]
        Server[VinBus MCP Server]
        Tools[Tập lệnh 5 VinBus Tools]
    end

    subgraph External["Dữ liệu thực tế"]
        VinBus[(Cơ sở dữ liệu VinBus API)]
    end

    UI <-->|JSON/HTTP| API
    GPS -->|Bơm tọa độ ẩn| API
    API <--> LLM
    LLM <-->|Thought & Action| Server
    Server --> Tools
    Tools <-->|Live API Fetch| VinBus
    
    style LLM fill:#8b5cf6,color:white,stroke:#5b21b6
    style Server fill:#f59e0b,color:white,stroke:#b45309
    style VinBus fill:#ef4444,color:white,stroke:#b91c1c`
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
      <div className="flex-1 overflow-hidden p-10 flex items-center justify-center bg-white relative">
        {slide.content ? (
          slide.content
        ) : (
          <div className="w-full h-full flex items-center justify-center transform scale-125 transition-transform">
            <Mermaid id={slide.chartId} chart={slide.chart} />
          </div>
        )}
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
