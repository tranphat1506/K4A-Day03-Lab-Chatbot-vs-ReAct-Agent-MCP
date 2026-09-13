import sys
import os
# Thêm thư mục src vào sys.path để fix lỗi import
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import json
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
