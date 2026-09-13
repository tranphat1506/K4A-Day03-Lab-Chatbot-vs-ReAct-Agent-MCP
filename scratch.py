import requests

url = "https://vbcore-api.vinbus.vn/client/navigation"
payload = {
    "startLat": 21.0029,
    "startLng": 105.8202,
    "endLat": 20.9850,
    "endLng": 105.9520,
    "regionCode": "hn"
}
headers = {'User-Agent': 'Mozilla/5.0'}
res = requests.post(url, params=payload, headers=headers)
print(res.status_code)
print(res.text[:100])
