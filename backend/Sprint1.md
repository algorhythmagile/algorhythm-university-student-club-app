# Sprint 1 API Dokümantasyonu

Bu doküman, "Sprint 1" kapsamında geliştirilen Kullanıcı ve Kulüp API'lerinin kullanımını ve örnek yanıtlarını içerir.

## 1. Kimlik Doğrulama (Authentication)

### 1.1. Kayıt Ol (Register)
Yeni bir kullanıcı hesabı oluşturur.

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "username": "docuser",
    "email": "doc@example.com",
    "password": "docpassword"
  }
  ```
- **Başarılı Yanıt (201 Created):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 6,
      "username": "docuser",
      "email": "doc@example.com",
      "created_at": "2025-11-27T00:30:57.620123+03:00",
      "updated_at": "2025-11-27T00:30:57.620123+03:00"
    }
  }
  ```

### 1.2. Giriş Yap (Login)
Kullanıcı girişi yapar ve JWT token döner.

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "doc@example.com",
    "password": "docpassword"
  }
  ```
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 6,
      "username": "docuser",
      "email": "doc@example.com",
      "created_at": "2025-11-27T00:30:57.620123+03:00",
      "updated_at": "2025-11-27T00:30:57.620123+03:00"
    }
  }
  ```

### 1.3. Profil Bilgileri (Me)
Giriş yapmış kullanıcının bilgilerini döner.

- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Header:** `Authorization: Bearer <token>`
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "id": 6,
    "username": "docuser",
    "email": "doc@example.com",
    "created_at": "2025-11-27T00:30:57.620123+03:00",
    "updated_at": "2025-11-27T00:30:57.620123+03:00"
  }
  ```

## 2. Kulüp Yönetimi (Club Management)

### 2.1. Kulüp Oluştur (Create Club)
Yeni bir kulüp oluşturur.

- **URL:** `/api/clubs`
- **Method:** `POST`
- **Header:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Doc Club",
    "description": "Club for documentation"
  }
  ```
- **Başarılı Yanıt (201 Created):**
  ```json
  {
    "message": "Club created successfully",
    "club": {
      "id": 6,
      "name": "Doc Club",
      "description": "Club for documentation",
      "owner_id": 6,
      "created_at": "2025-11-27T00:35:56.165647+03:00",
      "updated_at": "2025-11-27T00:35:56.165647+03:00"
    }
  }
  ```

### 2.2. Tüm Kulüpleri Listele (List Clubs)
Sistemdeki tüm kulüpleri listeler.

- **URL:** `/api/clubs`
- **Method:** `GET`
- **Başarılı Yanıt (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "AI Club",
      "description": "Artificial Intelligence Club",
      "owner_id": 0,
      "created_at": "2025-11-26T23:50:08.071504+03:00",
      "updated_at": "2025-11-26T23:50:08.071504+03:00"
    },
    ...
  ]
  ```

### 2.3. Kulübe Katıl (Join Club)
Kullanıcının bir kulübe katılmasını sağlar.

- **URL:** `/api/clubs/:id/join`
- **Method:** `POST`
- **Header:** `Authorization: Bearer <token>`
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "message": "Joined club successfully"
  }
  ```

### 2.4. Üyeliklerim (My Memberships)
Kullanıcının üye olduğu kulüpleri listeler.

- **URL:** `/api/clubs/my-memberships`
- **Method:** `GET`
- **Header:** `Authorization: Bearer <token>`
- **Başarılı Yanıt (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "AI Club",
      "description": "Artificial Intelligence Club",
      "owner_id": 0,
      "created_at": "2025-11-26T23:50:08.071504+03:00",
      "updated_at": "2025-11-26T23:50:08.071504+03:00"
    }
  ]
  ```

### 2.5. Yönettiğim Kulüpler (My Managed Clubs)
Kullanıcının oluşturduğu (sahibi olduğu) kulüpleri listeler.

- **URL:** `/api/clubs/my-clubs`
- **Method:** `GET`
- **Header:** `Authorization: Bearer <token>`
- **Başarılı Yanıt (200 OK):**
  ```json
  [
    {
      "id": 6,
      "name": "Doc Club",
      "description": "Club for documentation",
      "owner_id": 6,
      "created_at": "2025-11-27T00:35:56.165647+03:00",
      "updated_at": "2025-11-27T00:35:56.165647+03:00"
    }
  ]
  ```
