# 📊 BÁO CÁO THU HOẠCH NGHIỆM THU BÀI LAB 3 (BƯỚC 3 — SUBMISSION ARTIFACT)

> **Họ và Tên Học viên:** [Điền Họ và Tên]  
> **Mã Sinh Viên / Mã Học viên:** [Điền MSSV]  
> **Chủ đề Lựa chọn:** Trợ lý VinBus (Đề tài Mở)

---

## 1. BẢNG CHẤM ĐIỂM AGENTIC FIT SCORING MATRIX (ĐÁNH GIÁ CHỦ ĐỀ)

| Tiêu chí Đánh giá | Mức độ (1 - 5) | Giải trình chi tiết lý do chọn điểm |
| :--- | :---: | :--- |
| **1. Multi-step Reasoning** | 5 / 5 | Bài toán yêu cầu chia nhỏ các bước: tìm vị trí người dùng -> tìm trạm gần nhất -> kiểm tra giờ xe tới. |
| **2. Tool Interaction** | 5 / 5 | Bắt buộc phải kết nối với Vinbus API để lấy dữ liệu xe chạy realtime. |
| **3. Dynamic Decision** | 5 / 5 | Phải ra quyết định động dựa trên ETA của xe (ví dụ: giục khách ra bến nếu xe sắp tới, hoặc khuyên chờ nếu xe còn xa). |
| **4. Long Horizon Goal** | 4 / 5 | Hệ thống cần hướng dẫn người dùng qua nhiều bước cho đến khi họ lên được xe và đến đích. |
| **TỔNG ĐIỂM AGENTIC FIT** | **19 / 20** | *Nếu tổng điểm > 12/20: Bài toán rất phù hợp triển khai Agentic System.* |

---

## 2. TRÍCH XUẤT KẾT QUẢ WATERFALL TRACE LOG (SAU KHI CHẠY TEST SUITE TRÊN API THẬT)

> ⚠️ **YÊU CẦU NGHIỆM THU:** Mở tệp `.env` điền `GEMINI_API_KEY` (hoặc `OPENAI_API_KEY`) để kết nối LLM thật trước khi thực thi `python src/app.py --all`. Bài nộp chỉ dùng Mock Offline Provider sẽ không đạt điểm nghiệm thực tế.

Dán 1 đoạn trích xuất log tiêu biểu từ file `docs/trace_waterfall.json` sinh ra từ phản hồi LLM API thật:

```json
  {
    "step": 1,
    "query": "Tôi muốn biết các tuyến xe bus chạy qua trạm VinUni (ID: 1234).",
    "action_type": "TOOL_EXECUTION",
    "tool_name": "get_station_detail",
    "arguments": {
      "station_id": 1234,
      "region_code": "hn"
    },
    "observation": {
      "status": "SUCCESS",
      "data": {
        "stationInfo": {
          "id": 7835,
          "stationId": 1234,
          "stationName": "Qua BX Thường Tín 50m"
        }
      }
    },
    "latency_ms": 2603.11
  }
```

---

## 3. TỔNG KẾT KẾT QUẢ NGHIỆM THU & NỘP BÀI

- [x] Đã điền API Key thật trong `.env` và xác nhận Agent chạy mượt mà trên LLM API thật (Gemini/OpenAI).
- **Tổng số Test Cases đã chạy thành công:** 5 / 5 test cases.
- **Số lượt gọi Tool qua MCP Server chính xác:** 4 lượt.
- **Kết quả đẩy Repo nộp bài:** [ ] Đã Commit và Push mã nguồn thành công lên GitHub cá nhân.

---

> ✅ **HOÀN TẤT NỘP BÀI:** Sao chép đường link GitHub Repository cá nhân của bạn và dán vào ô nộp bài trên hệ thống LMS VLearn để hoàn tất Bài Lab 3!
