# Oyun Yönetim Sistemi RESTful API

Bu proje; Node.js ve Express.js mimarisi üzerinde geliştirilmiş, REST standartlarına tam uyumlu bir arka uç servisidir. Uygulama, harici bir veri tabanı bağımlılığı olmaksızın yerel dosya sistemi (fs modülü) aracılığıyla verileri JSON formatında kalıcı olarak saklar. Modüler katmanlı mimari, ara yazılım (middleware) denetimleri, sayfalama ve filtreleme altyapısıyla kurumsal ölçekte yapılandırılmıştır.

---

## Mimari ve Tasarım İlkeleri

- Katmanlı Mimari: Rota tanımları (routes), iş mantığı yardımcıları (utils) ve ara yazılımlar (middleware) ayrıştırılmıştır.
- Veri Kalıcılığı: Veriler data/oyunlar.json ve data/kullanicilar.json dosyaları üzerinden atomik olarak işlenir.
- Denetim ve İzleme: Tüm gelen HTTP trafiği zaman damgası, HTTP metodu ve hedef uç nokta bilgileriyle loglanır.
- Veri Bütünlüğü: Gelen yükler (payload) rota öncesinde şema doğrulamasından geçirilir.

---

## Dizin Yapısı

oyun-api/
├── data/
│   ├── oyunlar.json
│   └── kullanicilar.json
├── docs/
│   └── screenshots/
├── src/
│   ├── middleware/
│   │   ├── dogrula.js
│   │   └── logger.js
│   ├── routes/
│   │   ├── kullaniciRoutes.js
│   │   └── oyunRoutes.js
│   ├── utils/
│   │   └── dosya.js
│   ├── app.js
│   └── server.js
├── .gitignore
├── package.json
├── PROJE_TANITIMI.md
└── README.md

---

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v16.x veya üzeri)
- npm (v8.x veya üzeri)

### 1. Bağımlılıkların Yüklenmesi
Projeyi yerel ortamınıza klonladıktan sonra kök dizinde bağımlılıkları yükleyin:

npm install

### 2. Uygulamanın Başlatılması
Geliştirme modunda (nodemon izleyicisi ile) çalıştırmak için:

npm run dev

Doğrudan üretim modunda çalıştırmak için:

npm start

Uygulama varsayılan olarak http://localhost:3000 adresi üzerinden hizmet vermektedir.

---

## API Uç Noktaları ve Kullanım Kılavuzu

### 1. Oyun Yönetimi (/oyunlar)

| Metot | Uç Nokta | Açıklama |
|---|---|---|
| GET | /oyunlar | Tüm oyun kayıtlarını listeler |
| GET | /oyunlar?ara={kelime} | Başlığa göre filtreleme yapar |
| GET | /oyunlar?tur={kategori} | Oyun türüne göre filtreleme yapar |
| GET | /oyunlar?sayfa={sayi}&limit={adet} | Sayfalama parametreleriyle listeler |
| GET | /oyunlar/:id | Belirtilen kimliğe sahip tekil kaydı getirir |
| POST | /oyunlar | Yeni oyun kaydı oluşturur |
| PUT | /oyunlar/:id | Var olan oyun kaydını günceller |
| DELETE | /oyunlar/:id | Belirtilen kaydı kalıcı olarak siler |

#### İstek / Yanıt Örneği (POST /oyunlar)

İstek Gövdesi (Request Body):
{
  "ad": "Cyberpunk 2077",
  "tur": "RPG",
  "fiyat": 799,
  "puan": 8.5
}

Başarılı Yanıt (201 Created):
{
  "basarili": true,
  "mesaj": "Oyun başarıyla eklendi.",
  "veri": {
    "id": 2,
    "ad": "Cyberpunk 2077",
    "tur": "RPG",
    "fiyat": 799,
    "puan": 8.5
  }
}

---

### 2. Kullanıcı Yönetimi (/kullanicilar)

| Metot | Uç Nokta | Açıklama |
|---|---|---|
| GET | /kullanicilar | Kayıtlı tüm kullanıcıları listeler |
| GET | /kullanicilar/:id | Tekil kullanıcı profilini getirir |
| POST | /kullanicilar | Yeni kullanıcı hesabı kaydeder |
| DELETE | /kullanicilar/:id | Kullanıcı kaydını siler |

---

## HTTP Durum Kodları

Uygulama, REST standartlarına uygun olarak aşağıdaki HTTP durum kodlarını döndürür:

- 200 OK: İstek başarıyla karşılandı ve veri getirildi / güncellendi / silindi.
- 201 Created: Yeni kaynak başarıyla oluşturuldu ve JSON dosyasına yazıldı.
- 400 Bad Request: İstek gövdesinde zorunlu alanlar (ad, tur) eksik veya geçersiz formatta.
- 404 Not Found: İstenen ID sistemde bulunamadı veya tanımlanmamış bir rota çağrıldı.
- 500 Internal Server Error: Sunucu veya dosya sistemi okuma/yazma aşamasında beklenmeyen bir hata oluştu.

---

## Test ve Doğrulama

API uç noktalarının tüm işlevsellik testleri Postman ve Thunder Client istemcileri üzerinden yapılmıştır. Test senaryolarına ve yanıt durumlarına ait ekran görüntüleri docs/screenshots/ dizininde arşivlenmiştir.