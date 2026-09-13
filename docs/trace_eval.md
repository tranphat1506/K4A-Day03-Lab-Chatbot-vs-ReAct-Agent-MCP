# 📊 BÁO CÁO THU HOẠCH NGHIỆM THU BÀI LAB 3 (BƯỚC 3 — SUBMISSION ARTIFACT)

> **Họ và Tên Học viên:** Phát  
> **Mã Sinh Viên / Mã Học viên:** SV001  
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
  "step": 5,
  "query": "Tôi đang đứng ở S2.05, muốn đến Đại học VinUni. Hãy tìm trạm đón và tính giờ xe đến giúp tôi (Khu vực HN).

[System]: Bạn vừa gọi tool 'geocoding_search' và nhận được kết quả sau: {\"status\": \"SUCCESS\", \"data\": [{\"title\": \"S2.05, Đại Dương 8, Vinhomes Ocean Park, Xã Gia Lâm, Hà Nội, Việt Nam\", \"address\": \"S2.05, Đại Dương 8, Vinhomes Ocean Park, Xã Gia Lâm, Hà Nội, Việt Nam\", \"lat\": 20.99216325, \"lng\": 105.93966008315456}, {\"title\": \"S2.05, Đường Vạn Xuân, Vinhomes Smart City, Quận Nam Từ Liêm, Hà Nội, 34000, Việt Nam\", \"address\": \"S2.05, Đường Vạn Xuân, Vinhomes Smart City, Quận Nam Từ Liêm, Hà Nội, 34000, Việt Nam\", \"lat\": 21.006414499999998, \"lng\": 105.73713795578901}]}
Hãy phân tích kết quả này. Nếu đã đủ thông tin, hãy trả lời người dùng. Nếu chưa, hãy gọi tool tiếp theo.

[System]: Bạn vừa gọi tool 'geocoding_search' và nhận được kết quả sau: {\"status\": \"SUCCESS\", \"data\": [{\"title\": \"[Trạm] Đối diện KTX Đại học VinUni\", \"address\": \"Đối diện KTX Đại học VinUni\", \"lat\": 20.989852, \"lng\": 105.948639}, {\"title\": \"[Trạm] Đại học VinUni \", \"address\": \"Đại học VinUni \", \"lat\": 20.991427, \"lng\": 105.94559}, {\"title\": \"[Trạm] Đại học VinUni\", \"address\": \"Đại học VinUni - OCP03\", \"lat\": 20.988657, \"lng\": 105.942754}, {\"title\": \"[Trạm] KTX Đại học VinUni\", \"address\": \"KTX Đại học VinUni\", \"lat\": 20.989513, \"lng\": 105.948949}, {\"title\": \"[Trạm] Đại học VinUni\", \"address\": \"Đại học VinUni\", \"lat\": 20.986496, \"lng\": 105.943673}, {\"title\": \"[Trạm] Đối diện Đại học VinUni\", \"address\": \"Đối diện Đại học VinUni\", \"lat\": 20.991561, \"lng\": 105.945673}, {\"title\": \"Đại học VinUni, San Hô 17, Vinhomes Ocean Park, Xã Gia Lâm, Hà Nội, Việt Nam\", \"address\": \"Đại học VinUni, San Hô 17, Vinhomes Ocean Park, Xã Gia Lâm, Hà Nội, Việt Nam\", \"lat\": 20.9913041, \"lng\": 105.9457424}]}
Hãy phân tích kết quả này. Nếu đã đủ thông tin, hãy trả lời người dùng. Nếu chưa, hãy gọi tool tiếp theo.

[System]: Bạn vừa gọi tool 'get_directions' và nhận được kết quả sau: {\"status\": \"ERROR\", \"message\": \"API trả về mã lỗi HTTP 400 tại /client/navigation\"}
Hãy phân tích kết quả này. Nếu đã đủ thông tin, hãy trả lời người dùng. Nếu chưa, hãy gọi tool tiếp theo.

[System]: Bạn vừa gọi tool 'get_near_stations' và nhận được kết quả sau: {\"status\": \"SUCCESS\", \"data\": [{\"id\": 12600, \"stationId\": 111149, \"regionId\": 2, \"stationName\": \"Bến trả OCP2,3 (Điểm cuối)\", \"stationAddress\": \"Bến trả OCP2,3 (Điểm cuối)\", \"lat\": 20.98966, \"lng\": 105.943502, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": null, \"lastUpdateTime\": null, \"hasBoardLed\": null, \"referCityStationId\": 11279, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2025-03-13T06:54:15.628Z\", \"updatedAt\": \"2026-09-11T17:00:03.411Z\", \"arrRouteNo\": [\"OCP1\"], \"distanceToUser\": 0}, {\"id\": 11853, \"stationId\": 110761, \"regionId\": 2, \"stationName\": \"Đối diện Tòa nhà S2.01\", \"stationAddress\": \"Đối diện Tòa nhà S2.01\", \"lat\": 20.989901, \"lng\": 105.940586, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": null, \"lastUpdateTime\": null, \"hasBoardLed\": null, \"referCityStationId\": 100022, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2023-09-25T01:38:12.294Z\", \"updatedAt\": \"2026-07-27T03:09:15.593Z\", \"arrRouteNo\": [\"E03\", \"E01\"], \"distanceToUser\": 0}, {\"id\": 11995, \"stationId\": 110295, \"regionId\": 2, \"stationName\": \"Bến trả Ocean Park 2, 3\", \"stationAddress\": \"Bến trả Ocean Park 2, 3\", \"lat\": 20.9907357, \"lng\": 105.9440717, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": \"Bến trả Ocean Park 2, 3\", \"lastUpdateTime\": null, \"hasBoardLed\": true, \"referCityStationId\": null, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2024-01-03T17:05:23.535Z\", \"updatedAt\": \"2026-09-11T17:00:03.340Z\", \"arrRouteNo\": [\"OCT1\", \"OCT2\", \"OCP1\", \"E03\", \"E01\"], \"distanceToUser\": 0}, {\"id\": 10551, \"stationId\": 110222, \"regionId\": 2, \"stationName\": \"Đối diện Trường Trung học VinSchool Ocean Park\", \"stationAddress\": \"Đối diện Trường Trung học VinSchool Ocean Park\", \"lat\": 20.9942, \"lng\": 105.9367, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": null, \"lastUpdateTime\": null, \"hasBoardLed\": null, \"referCityStationId\": 58984, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2023-04-12T17:05:38.116Z\", \"updatedAt\": \"2026-07-27T03:09:15.575Z\", \"arrRouteNo\": [\"E03\", \"E01\"], \"distanceToUser\": 0}, {\"id\": 10550, \"stationId\": 110221, \"regionId\": 2, \"stationName\": \"Trường Trung học VinSchool Ocean Park\", \"stationAddress\": \"Trường Trung học VinSchool Ocean Park\", \"lat\": 20.994576, \"lng\": 105.936615, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": null, \"lastUpdateTime\": null, \"hasBoardLed\": null, \"referCityStationId\": 58986, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2023-04-12T17:05:38.113Z\", \"updatedAt\": \"2026-07-27T03:09:15.571Z\", \"arrRouteNo\": [\"E03\", \"E01\"], \"distanceToUser\": 0}, {\"id\": 9363, \"stationId\": 100026, \"regionId\": 2, \"stationName\": \"Nhà để xe Đại Dương\", \"stationAddress\": \"Nhà để xe Đại Dương\", \"lat\": 20.99139, \"lng\": 105.94079, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": \"NHÀ XE S2\", \"lastUpdateTime\": \"2026-07-27T07:10:27.213Z\", \"hasBoardLed\": false, \"referCityStationId\": 20147, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2021-04-07T14:58:22.020Z\", \"updatedAt\": \"2026-09-11T17:00:03.272Z\", \"arrRouteNo\": [\"OCP1\"], \"distanceToUser\": 0}, {\"id\": 11852, \"stationId\": 110760, \"regionId\": 2, \"stationName\": \"Tòa nhà S2.01\", \"stationAddress\": \"Tòa nhà S2.01\", \"lat\": 20.990086, \"lng\": 105.9405, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": null, \"lastUpdateTime\": null, \"hasBoardLed\": null, \"referCityStationId\": 100012, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2023-09-25T01:38:12.290Z\", \"updatedAt\": \"2026-07-27T03:09:15.590Z\", \"arrRouteNo\": [\"E03\", \"E01\"], \"distanceToUser\": 0}, {\"id\": 12689, \"stationId\": 111211, \"regionId\": 2, \"stationName\": \"Tòa nhà S2.15\", \"stationAddress\": \"Tòa nhà S2.15\", \"lat\": 20.990894, \"lng\": 105.943663, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": \"TÒA NHÀ S2.15\", \"lastUpdateTime\": \"2026-09-13T04:39:01.109Z\", \"hasBoardLed\": true, \"referCityStationId\": 100025, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2025-08-06T10:43:39.599Z\", \"updatedAt\": \"2026-09-13T04:39:01.109Z\", \"arrRouteNo\": [\"OCT1\", \"OCT2\", \"OCP1\", \"E03\", \"E01\"], \"distanceToUser\": 0}, {\"id\": 12301, \"stationId\": 111142, \"regionId\": 2, \"stationName\": \"Bến trả OCP2,3 (Đi OCP2, 3)\", \"stationAddress\": \"Bến trả OCP2,3 (Đi OCP2, 3)\", \"lat\": 20.990206, \"lng\": 105.943704, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": null, \"lastUpdateTime\": null, \"hasBoardLed\": null, \"referCityStationId\": 11373, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2024-12-09T02:44:50.463Z\", \"updatedAt\": \"2026-09-11T17:00:03.404Z\", \"arrRouteNo\": [\"OCP1\"], \"distanceToUser\": 0}, {\"id\": 11941, \"stationId\": 110294, \"regionId\": 2, \"stationName\": \"Trường Quốc tế Brighton College\", \"stationAddress\": \"Trường Quốc tế Brighton College\", \"lat\": 20.99306718, \"lng\": 105.9399075, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": null, \"lastUpdateTime\": null, \"hasBoardLed\": null, \"referCityStationId\": 10223, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2023-12-30T18:59:09.783Z\", \"updatedAt\": \"2026-09-11T17:00:03.335Z\", \"arrRouteNo\": [\"OCP1\"], \"distanceToUser\": 0}, {\"id\": 12688, \"stationId\": 111207, \"regionId\": 2, \"stationName\": \"Nhà để xe Hải Đăng\", \"stationAddress\": \"Nhà để xe Hải Đăng\", \"lat\": 20.994232586, \"lng\": 105.9411329531, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": null, \"lastUpdateTime\": null, \"hasBoardLed\": null, \"referCityStationId\": 58987, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2025-08-06T10:43:39.595Z\", \"updatedAt\": \"2026-09-11T17:00:03.427Z\", \"arrRouteNo\": [\"OCT1\", \"OCT2\", \"OCP1\", \"E10\"], \"distanceToUser\": 0}, {\"id\": 12704, \"stationId\": 111209, \"regionId\": 2, \"stationName\": \"Đối diện Tòa nhà S2.10\", \"stationAddress\": \"Đối diện Tòa nhà S2.10\", \"lat\": 20.99292, \"lng\": 105.94327, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": null, \"lastUpdateTime\": null, \"hasBoardLed\": null, \"referCityStationId\": 100005, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2025-08-06T10:44:24.101Z\", \"updatedAt\": \"2026-06-06T05:27:27.403Z\", \"arrRouteNo\": [\"E10\"], \"distanceToUser\": 0}, {\"id\": 12691, \"stationId\": 111206, \"regionId\": 2, \"stationName\": \"Tòa nhà S2.09\", \"stationAddress\": \"Tòa nhà S2.09\", \"lat\": 20.993138, \"lng\": 105.942537, \"voice1url\": null, \"stationCode\": null, \"stationType\": null, \"isInternalStation\": true, \"screenHeader\": null, \"lastUpdateTime\": null, \"hasBoardLed\": null, \"referCityStationId\": 100019, \"stationNameEn\": null, \"stationAddressEn\": null, \"createdAt\": \"2025-08-06T10:43:40.990Z\", \"updatedAt\": \"2026-09-11T17:00:03.424Z\", \"arrRouteNo\": [\"OCT1\", \"OCT2\", \"E10\"], \"distanceToUser\": 0}]}
Hãy phân tích kết quả này. Nếu đã đủ thông tin, hãy trả lời người dùng. Nếu chưa, hãy gọi tool tiếp theo.",
  "action_type": "TOOL_EXECUTION",
  "tool_name": "get_eta",
  "arguments": {
    "station_id": 111211,
    "region_code": "hn"
  },
  "observation": {
    "status": "SUCCESS",
    "data": [
      {
        "routeNo": "E01",
        "routeName": "Bến xe Mỹ Đình - KĐT Ocean Park",
        "headway": "12",
        "live_vehicles": [
          {
            "vehicleNumber": "29F-018.05",
            "distance_meters": 1337.7678254642683,
            "eta_seconds": 202
          }
        ]
      },
      {
        "routeNo": "E03",
        "routeName": "Mỹ Đình (Hàm Nghi) - KĐT Ocean Park",
        "headway": "12",
        "live_vehicles": [
          {
            "vehicleNumber": " Dự kiến ",
            "distance_meters": null,
            "eta_seconds": 660
          }
        ]
      },
      {
        "routeNo": "OCT2",
        "routeName": "Bờ Hồ - Ocean City",
        "headway": "",
        "live_vehicles": [
          {
            "vehicleNumber": "29H-918.69",
            "distance_meters": 211.61225121773128,
            "eta_seconds": 38
          },
          {
            "vehicleNumber": "29H-939.46",
            "distance_meters": 7966.7009637539595,
            "eta_seconds": 870
          },
          {
            "vehicleNumber": "29H-914.45",
            "distance_meters": 12796.763455821909,
            "eta_seconds": 1380
          }
        ]
      },
      {
        "routeNo": "OCT1",
        "routeName": "KĐT Royal City - Ocean City",
        "headway": "",
        "live_vehicles": [
          {
            "vehicleNumber": "29H-917.65",
            "distance_meters": 475.20289871718796,
            "eta_seconds": 95
          },
          {
            "vehicleNumber": "29H-913.52",
            "distance_meters": 8296.917047272018,
            "eta_seconds": 890
          },
          {
            "vehicleNumber": "29H-910.12",
            "distance_meters": 13210.116869848562,
            "eta_seconds": 1530
          }
        ]
      },
      {
        "routeNo": "OCP1",
        "routeName": "Nội liên khu Ocean Park 1,2,3 - .",
        "headway": "",
        "live_vehicles": [
          {
            "vehicleNumber": "29H-939.94",
            "distance_meters": 1224.7933549924178,
            "eta_seconds": 190
          },
          {
            "vehicleNumber": "29H-909.15",
            "distance_meters": 7758.490279343655,
            "eta_seconds": 1232
          }
        ]
      }
    ]
  },
  "latency_ms": 1389.24
}
```

---

## 3. TỔNG KẾT KẾT QUẢ NGHIỆM THU & NỘP BÀI

- [x] Đã điền API Key thật trong `.env` và xác nhận Agent chạy mượt mà trên LLM API thật (Gemini/OpenAI).
- **Tổng số Test Cases đã chạy thành công:** 6 / 6 test cases.
- **Số lượt gọi Tool qua MCP Server chính xác:** 4 lượt.
- **Kết quả đẩy Repo nộp bài:** [x] Đã Commit và Push mã nguồn thành công lên GitHub cá nhân.

---

> ✅ **HOÀN TẤT NỘP BÀI:** Sao chép đường link GitHub Repository cá nhân của bạn và dán vào ô nộp bài trên hệ thống LMS VLearn để hoàn tất Bài Lab 3!
