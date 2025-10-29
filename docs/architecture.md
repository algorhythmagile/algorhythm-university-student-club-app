## University Student Club App Mimari Özeti

Bu döküman; Go tabanlı backend, React (Vite) tabanlı frontend ve PostgreSQL veritabanından oluşan uygulamanın genel mimarisini tek sayfada özetler.

### Katmanlar Arası Akış

1. **Frontend (React + Vite)**  
   - Kullanıcı arayüzü SPA (Single Page Application) mantığında çalışır.  
   - REST API çağrılarını `fetch` veya benzeri istemciler aracılığıyla backend'e iletir.  
   - Tamamen TypeScript/JavaScript tarafında çalışır; durum yönetimi ve bileşen mimarisi Vite'nin hızlı geliştirme deneyimine göre düzenlenir.

2. **Backend (Go + Fiber)**  
   - `cmd/server/main.go` Fiber uygulamasını başlatır, konfigürasyon ve veritabanı bağlantısını yükler.  
   - `internal/router` HTTP route'larını tanımlar; her route ilgili handler'a yönlendirilir.  
   - `internal/handler` gelen HTTP isteklerini karşılar, request doğrulaması yapar, servis katmanına delegasyon sağlar ve HTTP cevaplarını döner.  
   - `internal/service` iş kurallarını kapsar; domain modeli ve repository katmanı arasında aracı görev görür.  
   - `internal/repository` veritabanı sorgularını (CRUD) içerir ve sadece domain model tipleri ile konuşur.  
   - `internal/config` `.env` dosyasından ayarları okur; `DATABASE_URL`, port bilgileri vb. burada tutulur.  
   - `internal/database` veritabanı bağlantısı ile migration dosyalarını yönetir (`internal/database/migrations` altında SQL dosyaları).

3. **Database (PostgreSQL)**  
   - Şema migrasyonları `internal/database/migrations/*.sql` dosyalarıyla yönetilir.  
   - `system_messages` gibi domain tabloları bu katmanda tutulur.  
   - Repository katmanı SQL komutlarını oluşturur ve sonuçları domain modellerine map eder.

### Domain Modeli ve Veri Akışı

- Temel domain örneği: `SystemMessage`.  
- Akış: `frontend` istek başlatır → `handler` HTTP isteğini alır → `service` iş kuralını uygular → `repository` veritabanı etkileşimini yönetir → sonuç tekrar yukarı doğru döner ve JSON olarak frontend'e iletilir.

### Konfigürasyon ve Çevresel Değişkenler

- `.env` dosyası backend için kritik ayarları içerir (örn. `DATABASE_URL`, `PORT`).  
- `config.LoadConfig()` bu değişkenleri yükler ve uygulama boyunca kullanılabilir hale getirir.  
- Lokal geliştirmede veritabanı bağlantısı için PostgreSQL kullanıcı adı/şifre bilgileri `.env` üzerinden sağlanır.

### Çalışma Ortamı

- **Backend** varsayılan olarak `localhost:3000` adresinde çalışır.  
- **Frontend** Vite dev server ile `localhost:8080` üzerinde koşar.  
- CORS ayarları (gerektiğinde) Fiber middleware'leri ile yönetilir. (Şimdilik inaktif)

### Geliştirme Döngüsü

1. Backend'i `go run ./cmd/server` ile başlat.  
2. Frontend'i `npm run dev` ile ayağa kaldır.  
3. UI → API → DB etkileşimlerini tarayıcı veya Postman gibi araçlarla test et.

Bu yapı; katmanlar arası gevşek bağlılığı korurken, net sorumluluk ayrımı ve kolay test edilebilirlik sağlar. Frontend ve backend bağımsız geliştirilebilir, standart REST API üzerinden haberleşir. Veritabanı şeması SQL migrasyonları ile versiyonlanarak ekipler arası koordinasyonu güçlendirir.
