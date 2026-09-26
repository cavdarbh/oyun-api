Oyun Yönetim ve Envanter Sistemi REST API Proje Raporu

1. Proje Özeti ve Amacı
Bu proje, Node.js ve Express.js çatısı kullanılarak geliştirilmiş, yazılım mimarisi ilkelerine ve REST standartlarına uygun bir Oyun Yönetim ve Envanter Sistemi arka uç (backend) uygulamasıdır. Sistemin temel amacı; dijital oyun envanterinin, oyun kategorilerinin ve kullanıcı profillerinin merkezi bir API üzerinden güvenli, kalıcı ve performanslı bir şekilde yönetilmesini sağlamaktır. Uygulama, harici bir veritabanı sürücüsüne ihtiyaç duymadan Node.js yerel dosya sistemi (fs) üzerinden JSON tabanlı veri kalıcılığı sağlayacak şekilde tasarlanmıştır.

2. Senaryo ve Kapsam
Sistem, bir dijital oyun dağıtım veya takip platformunun arka uç servis ihtiyacını modellemektedir.
Platform üzerinde şu operasyonlar gerçekleştirilmektedir:

Yeni oyun kayıtlarının sisteme tanımlanması, mevcut kayıtların güncellenmesi ve yayından kaldırılması.

Oyun kütüphanesinin başlık ve kategori bazında filtrelenmesi.

Yüksek hacimli veri sorgularında sunucu yükünü optimize etmek amacıyla sayfalama (pagination) mekanizmasının işletilmesi.

Oyunları kütüphanelerine ekleyecek olan kullanıcı hesaplarının temel düzeyde kaydı ve takibi.

Sisteme yönlendirilen tüm ağ isteklerinin denetim (audit) ve hata takibi amacıyla kayıt altına alınması (logging).

3. Sistem Mimarisi ve Klasör Yapısı
Proje, sorumlulukların ayrılığı (Separation of Concerns) ilkesi gözetilerek katmanlı ve modüler bir mimari üzerinde inşa edilmiştir.

Dizin organizasyonu şu şekildedir:
oyun-api/
├── data/
│   ├── oyunlar.json          # Oyun kayıtlarının tutulduğu veri dosyası
│   └── kullanicilar.json     # Kullanıcı kayıtlarının tutulduğu veri dosyası
├── docs/
│   └── screenshots/          # Uç nokta testlerine ait ekran görüntüleri
├── src/
│   ├── middleware/
│   │   ├── dogrula.js        # Girdi doğrulama ve veri bütünlüğü katmanı
│   │   └── logger.js         # HTTP isteklerini zaman damgasıyla izleme katmanı
│   ├── routes/
│   │   ├── kullaniciRoutes.js# Kullanıcı kaynağına ait yönlendirme kuralları
│   │   └── oyunRoutes.js     # Oyun kaynağına ait yönlendirme kuralları
│   ├── utils/
│   │   └── dosya.js          # fs tabanlı JSON okuma ve yazma fonksiyonları
│   ├── app.js                # Express konfigürasyonu ve middleware entegrasyonu
│   └── server.js             # Sunucu dinleme ve port başlatma katmanı
├── .gitignore
├── package.json
├── PROJE_TANITIMI.md
└── README.md

4. Veri Modelleri
Oyun Modeli (oyunlar.json)

Alan | Veri Tipi | Zorunlu | Açıklama
id	 | Integer | Sistem Tarafından | Benzersiz kayıt numarası
ad	 | String  | Evet | Oyunun resmi başlığı
tur	 | String  | Evet |	Oyun kategorisi (RPG, FPS, vb.)
fiyat|	Number | Hayır | Para birimi cinsinden liste fiyatı
puan |	Number | Hayır | 10 üzerinden değerlendirme puanı


Kullanıcı Modeli (kullanicilar.json)

Alan | Veri Tipi | Zorunlu | Açıklama
id | Integer | Sistem Tarafından | Benzersiz kullanıcı numarası
kullaniciAdi | String | Evet | Platform kullanıcı adı
eposta | String | Evet | İletişim e-posta adresi

5. API Uç Noktaları ve HTTP Metot Dağılımı

5.1. Oyun Yönetim Servisleri (/oyunlar)

GET/oyunlar: Mevcut tüm kayıtları döndürür.
Filtreleme Desteği: ?ara=kelime parametresi ile isim araması, ?tur=kategori parametresi ile tür filtresi uygulanabilir.
Sayfalama Desteği: ?sayfa=1&limit=10 parametreleri ile dilimlenmiş veri ve üst veri (metadata) sunar.
GET/oyunlar/:id: Belirtilen kimliğe sahip oyunun detaylarını getirir (Bulunamadığında 404 Not Found).

POST/oyunlar: Gövdede iletilen JSON verisiyle yeni bir oyun kaydı oluşturur (201 Created). Gerekli alanlar eksikse 400 Bad Request yanıtı üretir.

PUT/oyunlar/:id: Belirtilen kaydın verilerini günceller (200 OK).

DELETE/oyunlar/:id: Belirtilen kaydı veri deposundan tamamen kaldırır (200 OK).

5.2. Kullanıcı Yönetim Servisleri (/kullanicilar)
GET/kullanicilar: Kayıtlı kullanıcıların listesini sunar.
GET/kullanicilar/:id: Belirtilen kimliğe sahip tekil kullanıcı bilgisini döndürür.

POST/kullanicilar: Yeni kullanıcı hesabı kaydeder (201 Created).

DELETE/kullanicilar/:id: Kullanıcı hesabını siler (200 OK).

6. Ara Yazılım (Middleware) Katmanı
İstek İzleme (Logger Middleware): Uygulamaya ulaşan her HTTP talebini ele alarak talebin zaman damgası (ISO formatında), metodu ve hedef URI bilgisini standart çıktıya (stdout) yazar.

Veri Doğrulama (Validation Middleware): POST ve PUT isteklerinde iş yükünün geçerliliğini denetler. İstemciden gelen istek gövdesinde (request body) zorunlu alanların (ad, tur) bulunmaması durumunda işlemi rota işleyicisine ulaşmadan keserek standart bir hata şablonuyla istemciye 400 Bad Request döndürür.

7. Veri Kalıcılığı ve Hata Yönetimi
Veri kalıcılığı, Node.js fs modülünün senkron dosya işleme metotları (readFileSync, writeFileSync) ile sağlanmaktadır. Dosya okuma aşamalarında oluşabilecek bozulmalar veya dosya erişim hataları try-catch blokları ile çevrelenmiş olup, hata durumunda sistemin kesintiye uğramadan boş küme ile çalışmaya devam etmesi garanti altına alınmıştır. İstemci kaynaklı geçersiz rotalara yönelik genel bir 404 yakalama işleyicisi (handler) app.js seviyesinde tanımlanmıştır.

8. Test ve Doğrulama
Geliştirilen tüm uç noktalar HTTP istemcileri (Thunder Client ve Postman) aracılığıyla; başarılı durumlar (200 OK, 201 Created), istemci hataları (400 Bad Request) ve bulunamayan kaynaklar (404 Not Found) senaryoları gözetilerek doğrulanmıştır. İlgili test sonuçlarına ait kanıt niteliğindeki ekran görüntüleri docs/screenshots/ dizini altında belgelenmiştir.