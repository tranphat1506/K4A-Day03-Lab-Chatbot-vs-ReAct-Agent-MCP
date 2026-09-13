import sys
import os
# Thêm thư mục src vào sys.path để fix lỗi import
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi import WebSocket, WebSocketDisconnect
import json
import asyncio
import math
from datetime import datetime
from src.vinbus.vinbus_api.client import VinbusClient
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from src.providers import get_llm_provider
from src.mcp_server import MCPVinBusServer
from src.app import run_react_agent, run_react_agent_stream
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="VinBus AI API")

# Setup CORS cho React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

provider = get_llm_provider()
mcp_server = MCPVinBusServer()

class ChatRequest(BaseModel):
    query: str
    history: List[Dict[str, str]] = []

@app.post("/api/chat")
def chat(request: ChatRequest):
    # Dùng list() để clone history, tránh thay đổi trực tiếp request object
    chat_history = list(request.history)
    
    # Chạy ReAct Agent
    logs = run_react_agent(request.query, provider, mcp_server, chat_history=chat_history)
    
    final_answer = ""
    for log in logs:
        if log.get("action_type") == "FINAL_ANSWER":
            final_answer = log.get("output", "")
            
    return {
        "final_answer": final_answer,
        "logs": logs
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Khởi chạy FastAPI Server tại http://localhost:8000")
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)

@app.post("/api/chat/stream")
def chat_stream(request: ChatRequest):
    chat_history = list(request.history)
    
    def generate():
        try:
            for log in run_react_agent_stream(request.query, provider, mcp_server, chat_history=chat_history):
                # Format as Server-Sent Events
                yield f"data: {json.dumps(log, ensure_ascii=False)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.websocket("/api/ws/tracker")
async def websocket_tracker(websocket: WebSocket):
    await websocket.accept()
    
    # Lấy thông số từ query params
    region_code = websocket.query_params.get("region_code", "hn")
    boarding_station_id = int(websocket.query_params.get("boarding_station_id", 0))
    route_no = websocket.query_params.get("route_no", "")
    walk_time_mins = int(websocket.query_params.get("walk_time_mins", 5))
    buffer_mins = 2
    
    client = VinbusClient(timeout=10)
    
    try:
        while True:
            # 1. Gọi API VinBus trong một thread (để không block async loop)
            # Vì VinbusClient là synchronous, ta cần chạy nó qua asyncio.to_thread
            try:
                etas = await asyncio.to_thread(client.get_eta, region_code, boarding_station_id, 1, 0)
            except Exception as e:
                await websocket.send_json({"error": str(e)})
                await asyncio.sleep(5)
                continue
                
            current_buses = []
            for target_route in etas:
                if target_route.get('routeNo') == route_no:
                    for bus in target_route.get('list', []):
                        bus['routeNo'] = route_no
                        current_buses.append(bus)
                        
            fastest_eta = float('inf')
            fastest_bus = None
            
            for bus in current_buses:
                eta_mins = math.ceil(bus.get('time', float('inf')) / 60)
                if eta_mins < fastest_eta:
                    fastest_eta = eta_mins
                    fastest_bus = bus
                    
            alert_msg = ""
            status_msg = "Đang theo dõi..."
            
            # Logic cảnh báo
            if fastest_eta != float('inf'):
                if fastest_eta <= walk_time_mins + buffer_mins:
                    alert_msg = f"🔔 BẮT ĐẦU DI CHUYỂN NGAY! Xe sắp tới trong {fastest_eta} phút."
                status_msg = f"⏱️ Cập nhật lúc {datetime.now().strftime('%H:%M:%S')}"
            else:
                status_msg = f"💤 Không có xe nào trên tuyến. Cập nhật lúc {datetime.now().strftime('%H:%M:%S')}"
            
            # Gửi dữ liệu về Client
            payload = {
                "buses": current_buses,
                "fastest_eta": fastest_eta if fastest_eta != float('inf') else None,
                "alert": alert_msg,
                "status": status_msg
            }
            await websocket.send_json(payload)
            
            # Tính toán chu kỳ quét (Dynamic Polling)
            if fastest_eta == float('inf'):
                poll_interval = 60
            elif fastest_eta > 10:
                poll_interval = 180
            elif fastest_eta > 3:
                poll_interval = 60
            else:
                poll_interval = 15
                
            await asyncio.sleep(poll_interval)
            
    except WebSocketDisconnect:
        print("Client ngắt kết nối JIT Tracker.")
    except Exception as e:
        print("Lỗi WebSocket:", e)
