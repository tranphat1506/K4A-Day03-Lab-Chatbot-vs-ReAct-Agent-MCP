# Tổng hợp các Task Bài Lab 3

Dựa vào các tài liệu `README.md` và `docs/CODELAB.md`, dưới đây là bản tóm tắt các task cần thực hiện để hoàn thành Bài Lab 3, được chia thành 4 phần chính:

### 🛠 Phần 1: Khởi tạo và Đánh giá (Agentic Fit & Tool Schemas)
1. **Chuẩn bị môi trường (Quickstart):**
   - Đảm bảo đã clone repo đúng cú pháp tên (`K4-DAY03-HoVaTen-MSSV`).
   - Tạo môi trường ảo, cài đặt thư viện từ `requirements.txt`.
   - Copy file `.env.example` thành `.env` và `config/test_cases.example.json` thành `config/test_cases.json`.
2. **Task 1.1 - Đánh giá Agentic Fit:**
   - Chọn đề tài trong file `docs/DANH_SACH_DE_TAI.md`.
   - Điền bảng chấm điểm **Agentic Fit Scoring Matrix** vào file báo cáo `docs/trace_eval.md`.
   - Hoàn thiện 3 test cases đang bỏ trống (`TC03`, `TC04`, `TC05`) trong file `config/test_cases.json`.
3. **Task 1.2 - Khai báo Tool Schemas:**
   - Mở file `src/tools.py`, tìm vị trí có đánh dấu `# TODO 1.2`.
   - Viết khai báo JSON Schema chuẩn cho công cụ `schedule_appointment` với các tham số bắt buộc là: `student_id`, `datetime_str`, và `advisor_name`.

### 🧠 Phần 2: Lập trình Logic (ReAct Loop & MCP Integration)
4. **Task 2.1 - Lập trình MCP Server:**
   - Mở file `src/mcp_server.py`, tìm vị trí `# TODO 2.1`.
   - Hoàn thiện hàm `call_tool(self, tool_name, arguments)` để thực thi Tool và trả về kết quả chuẩn theo giao thức JSON-RPC 2.0.
   - Chạy thử lệnh `python src/mcp_server.py` để đảm bảo server khởi động thành công.
5. **Task 2.2 - Xây dựng vòng lặp ReAct (Native Tool Calling):**
   - Mở file `src/app.py`, tìm các đoạn `# TODO` trong hàm `run_react_agent()`.
   - Lập trình logic để kết nối vòng lặp: *LLM sinh ra quyết định gọi Tool (Thought) ➔ Chuyển qua gửi xuống MCP Server (Action) ➔ Nhận kết quả từ Server trả về cho LLM (Observation)*.

### 🧪 Phần 3: Kiểm thử và Xuất báo cáo (Test & Waterfall Log)
6. **Task 3.1 - Chạy Test Suite và trích xuất Trace Log:**
   - **Bắt buộc:** Cắm API Key thật (điền `GEMINI_API_KEY` hoặc `OPENAI_API_KEY` vào file `.env`) để test điểm nghiệm thu thực tế.
   - Chạy 5 test cases bằng lệnh: `python src/app.py --all`.
   - Kiểm tra xem file log chuỗi suy luận `docs/trace_waterfall.json` đã được trích xuất thành công chưa.
   - Mở file báo cáo `docs/trace_eval.md`, dán 1 đoạn trích xuất log tiêu biểu vào **Mục 2** và điền kết luận tổng kết kiểm thử vào **Mục 3**.

### 📤 Phần 4: Nộp bài (Submission)
7. **Task 3.2 - Đóng gói và Nộp bài:**
   - Kiểm tra lại toàn bộ file (đặc biệt là các thay đổi ở thư mục `src/`, `config/test_cases.json`, `docs/trace_waterfall.json`, `docs/trace_eval.md`).
   - Commit và push code lên GitHub cá nhân.
   - Lấy link Repository GitHub dán lên hệ thống LMS VLearn để hoàn tất nộp bài.
