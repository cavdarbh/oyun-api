# 🎮 Oyunlar API (Express.js RESTful API)

Node.js ve Express.js kullanılarak geliştirilmiş, JSON dosya tabanlı (fs modülü) kalıcı veri yönetimine sahip tam kapsamlı bir CRUD RESTful API projesidir.

## 🚀 Özellikler

- **Express.js Mimarisi:** Temiz ve modüler route/middleware yapısı.
- **Kalıcı Veri Depolama:** Yerel `fs` modülü ile `data/oyunlar.json` üzerinde veri saklama.
- **Tam CRUD Desteği:** GET, POST, PUT, DELETE metotları.
- **Doğrulama (Validation Middleware):** Eksik alan kontrolü ve `400 Bad Request` yanıtları.
- **Loglama (Logger Middleware):** Gelen her isteğin method ve URL bilgisini zaman damgasıyla konsola basma.
- **Filtreleme & Arama (Bonus):** `ara` ve `tur` query parametreleri ile anlık veri filtreleme.
- **Standart HTTP Durum Kodları:** 200, 201, 400, 404 yanıtları.

## 🛠️ Kurulum ve Çalıştırma

Projeyi klonladıktan sonra bağımlılıkları yükleyin:

```bash
npm install