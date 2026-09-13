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
        "description": "Tìm kiếm toạ độ GPS của một ĐỊA CHỈ hoặc ĐỊA ĐIỂM bằng văn bản. CHÚ Ý: CHỈ TRUYỀN TỪ KHÓA CHÍNH (ví dụ: 'Ngã tư Sở', 'Vinhomes Ocean Park'), TUYỆT ĐỐI KHÔNG truyền nguyên câu văn dài hoặc số tuyến xe (ví dụ: KHÔNG TRUYỀN 'Tìm tuyến xe 140 hcm').",
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
    },
    {
        "name": "get_bus_detail_at_station",
        "description": "Lấy tọa độ GPS (kinh độ, vĩ độ) hiện tại. route_id và station_id có thể lấy từ kết quả của get_eta (dùng routeId và currentStationId). bus_id là mã xe busId (ví dụ 50E21494).",
        "parameters": {
            "type": "object",
            "properties": {
                "region_code": {
                    "type": "string",
                    "description": "Mã khu vực (ví dụ: 'hn', 'hcm')"
                },
                "station_id": {
                    "type": "integer",
                    "description": "ID của trạm xe buýt"
                },
                "route_id": {
                    "type": "integer",
                    "description": "ID của tuyến đường (route_id)"
                },
                "bus_id": {
                    "type": "string",
                    "description": "Mã định danh của xe buýt (busId hoặc vehicleNumber, ví dụ '29B19040')"
                }
            },
            "required": ["region_code", "station_id", "route_id", "bus_id"]
        }
    },
    {
        "name": "search_route",
        "description": "Tìm kiếm thông tin tổng quan của một tuyến xe buýt (ví dụ: tìm tuyến 140, tuyến E03). Trả về ID tuyến, tên tuyến, giờ hoạt động, tần suất.",
        "parameters": {
            "type": "object",
            "properties": {
                "region_code": {
                    "type": "string",
                    "description": "Mã khu vực (ví dụ: 'hn', 'hcm')"
                },
                "route_keyword": {
                    "type": "string",
                    "description": "Từ khóa tên tuyến hoặc số tuyến (ví dụ: '140', 'E03'). CHỈ TRUYỀN SỐ TUYẾN/TÊN TUYẾN, KHÔNG TRUYỀN NGUYÊN CÂU DÀI."
                }
            },
            "required": ["region_code", "route_keyword"]
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
        raw_result = vinbus_client.get_station_detail(station_id, region_code)
        
        # Tối ưu hóa Response (Bỏ rác HTML trong routeAlerts)
        filtered_routes = []
        if "allRouteThroughStation" in raw_result:
            for route in raw_result["allRouteThroughStation"]:
                filtered_routes.append({
                    "routeNo": route.get("routeNo"),
                    "routeName": route.get("routeName"),
                    "operationTime": route.get("operationTime"),
                    "headway": route.get("headway"),
                    "normalTicket": route.get("normalTicket")
                })
        
        result = {
            "stationInfo": raw_result.get("stationInfo", {}),
            "routes": filtered_routes
        }
        return json.dumps({"status": "SUCCESS", "data": result}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)}, ensure_ascii=False)

def execute_get_eta(region_code: str, station_id: int) -> str:
    """Thực thi lấy thời gian xe đến bến realtime"""
    try:
        raw_result = vinbus_client.get_eta(region_code, station_id)
        
        # Tối ưu hóa Response ETA
        filtered_eta = []
        for route_eta in raw_result:
            live_vehicles = []
            for vehicle in route_eta.get("list", []):
                live_vehicles.append({
                    "busId": vehicle.get("busId"),
                    "vehicleNumber": vehicle.get("vehicleNumber"),
                    "distance_meters": vehicle.get("distance"),
                    "eta_seconds": vehicle.get("time"),
                    "currentStationId": vehicle.get("currentStationId")
                })
            
            filtered_eta.append({
                "routeId": route_eta.get("routeId"),
                "routeNo": route_eta.get("routeNo"),
                "routeName": route_eta.get("routeName"),
                "headway": route_eta.get("headway"),
                "live_vehicles": live_vehicles
            })
            
        return json.dumps({"status": "SUCCESS", "data": filtered_eta}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)}, ensure_ascii=False)

def execute_search_route(region_code: str, route_keyword: str) -> str:
    """Thực thi tìm kiếm tuyến xe buýt"""
    try:
        raw_routes = vinbus_client._request("/client/route/list", params={"regionCode": region_code})
        # Lọc các tuyến có chứa từ khóa
        keyword = str(route_keyword).lower()
        matched_routes = []
        for r in raw_routes:
            if keyword in str(r.get("routeNo", "")).lower() or keyword in str(r.get("routeName", "")).lower():
                matched_routes.append({
                    "routeId": r.get("routeId"),
                    "routeNo": r.get("routeNo"),
                    "routeName": r.get("routeName"),
                    "operationTime": r.get("operationTime"),
                    "headway": r.get("headway")
                })
        return json.dumps({"status": "SUCCESS", "data": matched_routes}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)}, ensure_ascii=False)

def execute_get_bus_detail(region_code: str, station_id: int, route_id: int, bus_id: str) -> str:
    """Thực thi lấy chi tiết 1 xe buýt (bao gồm tọa độ GPS)"""
    try:
        result = vinbus_client.get_bus_detail_at_station(region_code, station_id, route_id, bus_id)
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
    "get_directions": execute_get_directions,
    "get_bus_detail_at_station": execute_get_bus_detail,
    "search_route": execute_search_route
}

def dispatch_tool_call(tool_name: str, arguments: Dict[str, Any]) -> str:
    """Hàm trung chuyển thực thi tool"""
    if tool_name in TOOL_ROUTER:
        try:
            return TOOL_ROUTER[tool_name](**arguments)
        except Exception as e:
            return json.dumps({"status": "EXECUTION_ERROR", "error": str(e)}, ensure_ascii=False)
    return json.dumps({"status": "UNKNOWN_TOOL", "error": f"Tool '{tool_name}' không tồn tại!"}, ensure_ascii=False)
