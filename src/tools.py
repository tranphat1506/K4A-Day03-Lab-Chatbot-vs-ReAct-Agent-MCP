"""
🛠️ TOOL DEFINITIONS & EXECUTION BACKEND
Mã nguồn chứa danh sách Tool Schemas (JSON Schema) và Execution Layer phục vụ cho MCP Server.
Đã được cấu hình lại để sử dụng VinBus API.
"""

import json
from datetime import datetime
from typing import Dict, Any

from vinbus.vinbus_api.client import VinbusClient

# Khởi tạo client dùng chung
vinbus_client = VinbusClient(timeout=10)

# ==============================================================================
# 1. KHAI BÁO TOOL SCHEMAS CHUẨN NATIVE JSON SCHEMA (TASK 1.2)
# ==============================================================================

TOOLS_SCHEMA = [
    {
        "name": "geocoding_search",
        "description": "Tìm kiếm toạ độ GPS của một địa chỉ hoặc địa điểm bằng văn bản.",
        "parameters": {
            "type": "object",
            "properties": {
                "region_code": {
                    "type": "string",
                    "description": "Mã khu vực (ví dụ: 'hn' cho Hà Nội, 'hcm' cho Hồ Chí Minh)"
                },
                "content": {
                    "type": "string",
                    "description": "Tên địa điểm hoặc địa chỉ cần tìm (ví dụ: 'Ngã tư Sở', 'S2.05')"
                }
            },
            "required": ["region_code", "content"]
        }
    },
    {
        "name": "get_near_stations",
        "description": "Tìm các trạm xe buýt lân cận trong bán kính r mét từ tọa độ cho trước.",
        "parameters": {
            "type": "object",
            "properties": {
                "lat": {
                    "type": "number",
                    "description": "Vĩ độ (latitude)"
                },
                "lng": {
                    "type": "number",
                    "description": "Kinh độ (longitude)"
                },
                "radius": {
                    "type": "integer",
                    "description": "Bán kính tìm kiếm tính bằng mét (ví dụ: 1000)"
                },
                "region_code": {
                    "type": "string",
                    "description": "Mã khu vực (ví dụ: 'hn')"
                }
            },
            "required": ["lat", "lng", "radius", "region_code"]
        }
    },
    {
        "name": "get_directions",
        "description": "Tìm lộ trình xe buýt tối ưu từ điểm A đến điểm B. Trả về nhiều gợi ý lộ trình, bao gồm thời gian đi, số trạm đi qua, và các tuyến xe.",
        "parameters": {
            "type": "object",
            "properties": {
                "start_lat": {"type": "number", "description": "Vĩ độ điểm đi"},
                "start_lng": {"type": "number", "description": "Kinh độ điểm đi"},
                "end_lat": {"type": "number", "description": "Vĩ độ điểm đến"},
                "end_lng": {"type": "number", "description": "Kinh độ điểm đến"},
                "region_code": {"type": "string", "description": "Mã khu vực (ví dụ: 'hn')"}
            },
            "required": ["start_lat", "start_lng", "end_lat", "end_lng", "region_code"]
        }
    },
    {
        "name": "get_station_detail",
        "description": "Lấy thông tin chi tiết của một trạm xe buýt và các tuyến xe đi qua trạm đó.",
        "parameters": {
            "type": "object",
            "properties": {
                "station_id": {
                    "type": "integer",
                    "description": "ID của trạm xe buýt (ví dụ: 1234)"
                },
                "region_code": {
                    "type": "string",
                    "description": "Mã khu vực (ví dụ: 'hn')"
                }
            },
            "required": ["station_id", "region_code"]
        }
    },
    {
        "name": "get_eta",
        "description": "Lấy thời gian dự kiến (ETA) của các xe buýt sắp tới một trạm xe cụ thể.",
        "parameters": {
            "type": "object",
            "properties": {
                "region_code": {
                    "type": "string",
                    "description": "Mã khu vực (ví dụ: 'hn')"
                },
                "station_id": {
                    "type": "integer",
                    "description": "ID của trạm xe buýt (ví dụ: 1234)"
                }
            },
            "required": ["region_code", "station_id"]
        }
    }
]

# ==============================================================================
# 2. HÀM THỰC THI TOOL (EXECUTION LAYER) GỌI VINBUS API
# ==============================================================================

def execute_geocoding_search(region_code: str, content: str) -> str:
    """Thực thi tìm kiếm tọa độ từ địa chỉ"""
    try:
        result = vinbus_client.geocoding_search(region_code, content)
        return json.dumps({"status": "SUCCESS", "data": result}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)}, ensure_ascii=False)

def execute_get_near_stations(lat: float, lng: float, radius: int, region_code: str) -> str:
    """Tìm các trạm lân cận trong bán kính r mét."""
    try:
        result = vinbus_client.get_near_stations(lat, lng, radius, region_code)
        return json.dumps({"status": "SUCCESS", "data": result}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)}, ensure_ascii=False)

def execute_get_station_detail(station_id: int, region_code: str) -> str:
    """Thực thi lấy chi tiết trạm xe buýt"""
    try:
        result = vinbus_client.get_station_detail(station_id, region_code)
        return json.dumps({"status": "SUCCESS", "data": result}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)}, ensure_ascii=False)

def execute_get_eta(region_code: str, station_id: int) -> str:
    """Thực thi lấy thời gian xe đến bến realtime"""
    try:
        result = vinbus_client.get_eta(region_code, station_id)
        return json.dumps({"status": "SUCCESS", "data": result}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)}, ensure_ascii=False)

def execute_get_directions(start_lat: float, start_lng: float, end_lat: float, end_lng: float, region_code: str) -> str:
    """Tìm lộ trình chỉ đường tối ưu (multimodal)."""
    try:
        result = vinbus_client.get_directions(start_lat, start_lng, end_lat, end_lng, region_code)
        return json.dumps({"status": "SUCCESS", "data": result}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)}, ensure_ascii=False)

# Router gọi tool thực tế
TOOL_ROUTER = {
    "geocoding_search": execute_geocoding_search,
    "get_near_stations": execute_get_near_stations,
    "get_station_detail": execute_get_station_detail,
    "get_eta": execute_get_eta,
    "get_directions": execute_get_directions
}

def dispatch_tool_call(tool_name: str, arguments: Dict[str, Any]) -> str:
    """Hàm trung chuyển thực thi tool"""
    if tool_name in TOOL_ROUTER:
        try:
            return TOOL_ROUTER[tool_name](**arguments)
        except Exception as e:
            return json.dumps({"status": "EXECUTION_ERROR", "error": str(e)}, ensure_ascii=False)
    return json.dumps({"status": "UNKNOWN_TOOL", "error": f"Tool '{tool_name}' không tồn tại!"}, ensure_ascii=False)
