import streamlit as st
import json
import os
from src.providers import get_llm_provider
from src.mcp_server import MCPVinBusServer
from src.app import run_react_agent
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(page_title="VinBus AI Agent", page_icon="🚌", layout="wide")

st.title("🚌 Trợ lý Thông minh VinBus (ReAct Agent)")
st.markdown("Hệ thống Agent tự động suy luận và gọi Vinbus API thời gian thực để hỗ trợ hành khách.")

# Khởi tạo session state
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "messages" not in st.session_state:
    st.session_state.messages = []

# Provider & Server
@st.cache_resource
def get_backend():
    return get_llm_provider(), MCPVinBusServer()

provider, mcp_server = get_backend()

# Layout: 2 cột (Chat bên trái, Trace Log bên phải)
col_chat, col_trace = st.columns([2, 1.5])

with col_chat:
    st.subheader("💬 Trò chuyện")
    chat_container = st.container(height=500)
    
    with chat_container:
        for msg in st.session_state.messages:
            with st.chat_message(msg["role"]):
                st.markdown(msg["content"])
    
    user_input = st.chat_input("VD: Tôi đang ở Ngã Tư Sở, muốn về Vinhomes Ocean Park...")
    
with col_trace:
    st.subheader("🔍 ReAct Trace Logs (Dành cho Dev)")
    trace_container = st.container(height=500)

if user_input:
    # Render user message
    st.session_state.messages.append({"role": "user", "content": user_input})
    with chat_container:
        with st.chat_message("user"):
            st.markdown(user_input)
    
    with chat_container:
        with st.chat_message("assistant"):
            status_placeholder = st.empty()
            with status_placeholder.status("🤖 Agent đang suy nghĩ...", expanded=True) as status:
                # Chạy backend Agent
                logs = run_react_agent(user_input, provider, mcp_server, chat_history=st.session_state.chat_history)
                
                # Cập nhật chat history cho các turn sau
                st.session_state.chat_history.append({"role": "user", "content": user_input})
                
                final_answer = ""
                for step_log in logs:
                    if step_log["action_type"] == "TOOL_EXECUTION":
                        st.write(f"🧠 **Thought:** {step_log['thought']}")
                        st.write(f"🛠️ **Action:** Gọi tool `{step_log['tool_name']}`")
                        st.code(f"Tham số: {step_log['arguments']}", language="json")
                    elif step_log["action_type"] == "FINAL_ANSWER":
                        final_answer = step_log["output"]
                        st.write(f"✅ **Đã tìm ra câu trả lời!**")
                
                st.session_state.chat_history.append({"role": "assistant", "content": final_answer})
                status.update(label="Hoàn tất!", state="complete", expanded=False)
            
            # Hiển thị Final Answer
            st.markdown(final_answer)
            st.session_state.messages.append({"role": "assistant", "content": final_answer})

    # Render Trace log detail bên cột phải
    with col_trace:
        with trace_container:
            st.markdown("### Vòng lặp cuối cùng (Last Run)")
            for step_log in logs:
                with st.expander(f"Bước {step_log['step']}: {step_log.get('tool_name', 'Final Answer')}", expanded=True):
                    st.markdown(f"**🧠 Thought:** {step_log['thought']}")
                    if step_log['action_type'] == "TOOL_EXECUTION":
                        st.markdown(f"**🛠️ Gọi Tool:** `{step_log['tool_name']}`")
                        st.json(step_log['arguments'])
                        st.markdown("**👁️ Observation (Kết quả API):**")
                        st.json(step_log['observation'])
                    st.caption(f"⏱️ Độ trễ: {step_log['latency_ms']} ms")
