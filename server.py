from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
import json
from urllib.parse import urlparse

products = [
    {
        "id": 1,
        "name": "Aurora Headset",
        "price": 699000,
        "description": "Suara jernih, desain premium, baterai tahan lama.",
        "emoji": "🎧",
        "category": "Elektronik",
        "rating": 4.9,
        "badge": "Best Seller",
        "details": "Headset wireless dengan noise canceling, baterai 40 jam, dan koneksi cepat."
    },
    {
        "id": 2,
        "name": "Nova Tote Bag",
        "price": 349000,
        "description": "Tas stylish untuk kerja dan weekend yang praktis.",
        "emoji": "👜",
        "category": "Fashion",
        "rating": 4.8,
        "badge": "Baru",
        "details": "Tas premium dengan ruang luas, material tahan air, dan desain minimalis."
    },
    {
        "id": 3,
        "name": "Lumen Lamp",
        "price": 249000,
        "description": "Pencahayaan hangat dengan tampilan modern.",
        "emoji": "💡",
        "category": "Lifestyle",
        "rating": 4.7,
        "badge": "Promo",
        "details": "Lampu meja pintar dengan tiga mode pencahayaan dan kontrol warna lembut."
    },
    {
        "id": 4,
        "name": "Orbit Smartwatch",
        "price": 899000,
        "description": "Pantau aktivitas dan notifikasi dengan desain elegan.",
        "emoji": "⌚",
        "category": "Elektronik",
        "rating": 4.9,
        "badge": "Terlaris",
        "details": "Smartwatch dengan GPS, detak jantung, dan pemantauan kebugaran harian."
    },
    {
        "id": 5,
        "name": "Velora Sneakers",
        "price": 459000,
        "description": "Nyaman dipakai sepanjang hari dengan sentuhan premium.",
        "emoji": "👟",
        "category": "Fashion",
        "rating": 4.8,
        "badge": "Populer",
        "details": "Sneakers ringan dan nyaman dengan sole empuk untuk aktivitas sehari-hari."
    },
    {
        "id": 6,
        "name": "Cove Bottle",
        "price": 189000,
        "description": "Botol minum premium yang cocok untuk perjalanan.",
        "emoji": "🧴",
        "category": "Lifestyle",
        "rating": 4.6,
        "badge": "Fresh",
        "details": "Botol stainless steel tahan lama dan cocok untuk minum di mana saja."
    }
]

orders = []

class Handler(BaseHTTPRequestHandler):
    def _send_json(self, status, payload):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/products':
            self._send_json(200, {"products": products})
        elif parsed.path == '/api/orders':
            self._send_json(200, {"orders": orders})
        else:
            self._send_json(404, {"error": "Not found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')

        if parsed.path == '/api/orders':
            data = json.loads(body or '{}')
            order = {
                "id": len(orders) + 1,
                "items": data.get('items', []),
                "total": data.get('total', 0),
                "promo": data.get('promo', ''),
                "createdAt": data.get('createdAt', '')
            }
            orders.append(order)
            self._send_json(201, {"success": True, "order": order})
        else:
            self._send_json(404, {"error": "Not found"})

if __name__ == '__main__':
    server = ThreadingHTTPServer(('0.0.0.0', 8001), Handler)
    print('Backend running on http://127.0.0.1:8001')
    server.serve_forever()
