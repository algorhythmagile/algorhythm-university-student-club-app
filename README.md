# 🎓 University Student Club App

Modern bir öğrenci kulübü uygulaması.  

---

## 🚀 Teknolojiler

| Katman | Teknoloji |
|--------|----------|
| Backend | Go (Fiber Framework) |
| Frontend | Vite + React |
| Database | PostgreSQL |

---

## ✅ Ön Koşullar

Aşağıdaki araçları kur:

| Gereken | İndir |
|--------|------|
| Go >= 1.21 | https://go.dev/dl/ |
| Node.js + NPM (Vite için) | https://nodejs.org/ |
| PostgreSQL | https://www.postgresql.org/download/ |

Kurulum sonrası versiyonları kontrol edebilirsin:

```bash
go version
node -v
npm -v
psql --version
```

---

## 🛠️ Kurulum Adımları

1. **Veritabanını oluştur**

   ```bash
   psql -h localhost -U postgres
   CREATE DATABASE university_student_club_app;
   \q
   ```

2. **Backend'i başlat**

   ```bash
   cd backend
   go mod tidy
   go run ./cmd/server
   ```

3. **Frontend'i çalıştır**

   Ayrı bir terminalde:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Uygulamayı ziyaret et**

   Tarayıcıdan UI'a ulaşmak için `http://localhost:8080` adresini aç. API istekleri varsayılan olarak `http://localhost:3000` üzerinden servis edilir.
