#  Oyunlar API (Express.js RESTful API)

Node.js ve Express.js kullanılarak geliştirilmiş, JSON dosya tabanlı (`fs` modülü) kalıcı veri yönetimine sahip çok kaynaklı RESTful API projesi.

##  Özellikler

- **Express.js Mimarisi:** Modüler route ve middleware yapısı.
- **Kalıcı JSON Depolama (fs):** `oyunlar.json` ve `kullanicilar.json` dosyaları ile veri saklama.
- **İki Farklı Kaynak (Bonus):** Oyunlar (`/oyunlar`) ve Kullanıcılar (`/kullanicilar`) için tam CRUD desteği.
- **Sayfalama - Pagination (Bonus):** `sayfa` ve `limit` parametreleriyle verimli veri çekme.
- **Arama & Filtreleme (Bonus):** `ara` (isim) ve `tur` query parametreleri ile anlık filtreleme.
- **Doğrulama (Validation Middleware):** Eksik alan kontrolü ve `400 Bad Request` yanıtları.
- **Loglama (Logger Middleware):** Gelen her isteği method, URL ve zaman damgasıyla konsola basma.
- **Standart HTTP Durum Kodları:** 200, 201, 400, 404 yanıtları.

##  Kurulum ve Çalıştırma

Bağımlılıkları yükleyin:
```bash
npm install
