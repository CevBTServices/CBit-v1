# Backend (`cbit-app-api`) Projeler (Projects) Kod Analizi ve Temizlik Raporu

## 1. Genel Özet (Executive Summary)
Bu rapor, `cbit-app-api` (backend) projesinde yer alan "projeler" (projects / proje / Proje) ile ilgili tüm kod bileşenlerini, veritabanı modellerini, API endpoint'lerini, servisleri, şemaları ve modül kayıtlarını eksiksiz olarak tespit etmek ve projenin temizlenmesi sürecine altlık oluşturmak amacıyla hazırlanmıştır.

Yapılan detaylı incelemede:
- **4 adet dosya tamamen SİLİNECEKTİR** (Controller, Route, Schema, Service).
- **4 adet dosya DEĞİŞTİRİLECEKTİR** (Prisma Schema, Routes Index, Services Index, Server/Enums).
- **Haberler (News) modülü ile hiçbir bağımlılık ilişkisi bulunmamaktadır**; projenin kaldırılması Haberler modülünün çalışmasını kesinlikle etkilemeyecektir.

---

## 2. Veritabanı Modelleri ve Şemalar (Database Models & Schemas)

### 2.1 Prisma Schema (`cbit-app-api/prisma/schema.prisma`)
- **Model Adı**: `Proje`
- **Konum**: Satır 19 - 38
- **Tablo Yapısı**:
  ```prisma
  model Proje {
    id                String   @id @default(uuid()) @db.Uuid
    projeAdi          String
    projeAdiEn        String?
    projeDetayi       String?
    projeDetayiEn     String?
    projeResmi        String?
    beyazAlan         String?
    sertifikasyon     String?
    itGucu            String?
    toplamKuruluGuc   String?
    projeSuresi       String?
    toplamInsaatAlani String?
    durum             String?
    durumEn           String?
    createdAt         DateTime @default(now())

    @@index([createdAt(sort: Desc)])
  }
  ```
- **İlişkiler (Relations)**: `Proje` modelinin `Haberler`, `Admin` veya `Message` modelleriyle hiçbir Foreign Key veya ilişki bağı yoktur.
- **Yapılacak İşlem**: Model bloğu (satır 19-38) tamamen silinecektir. Silme işleminden sonra `npx prisma generate` çalıştırılacaktır.

### 2.2 Veritabanı Migrasyonları (`cbit-app-api/prisma/migrations/`)
- **Dosya**: `prisma/migrations/20260706072220_init/migration.sql` (Satır 2-18 arası `CREATE TABLE "Proje" ...`)
- **Açıklama**: Mevcut migrasyon geçmişi korunabilir. Canlı veritabanındaki `Proje` tablosunu düşürmek için `npx prisma db push` uygulanabilir veya yeni bir migrasyon oluşturulabilir.

---

## 3. Controller Dosyaları ve API Endpoint Route'ları (Controllers & Routes)

### 3.1 Controller Dosyası (SİLİNECEK)
- **Dosya Yolu**: `cbit-app-api/src/controllers/proje.controller.ts` (Toplam 65 Satır)
- **İçerdiği Handler Fonksiyonları**:
  - `createProjeHandler`: POST isteği ile proje oluşturur (`201 CREATED`).
  - `listAllProjeHandler`: GET isteği ile tüm projeleri listeler (`200 OK`).
  - `updateProjeHandler`: PATCH isteği ile proje günceller (`204 NO_CONTENT` / `404 NOT_FOUND`).
  - `deleteProjeHandler`: DELETE isteği ile proje siler (`204 NO_CONTENT` / `404 NOT_FOUND`).
  - `findProjeHandler`: GET isteği ile ID'ye göre proje getirir (`200 OK` / `404 NOT_FOUND`).
- **Yapılacak İşlem**: Dosya tamamen silinecektir.

### 3.2 Route Dosyası (SİLİNECEK)
- **Dosya Yolu**: `cbit-app-api/src/routes/proje.route.ts` (Toplam 19 Satır)
- **Tanımlı Endpoint'ler ve HTTP Metodları**:
  - `POST /v1/projects/create` -> `authMiddleware`, `validate(createProjeSchema)`, `createProjeHandler`
  - `GET /v1/projects/our-projects` -> `listAllProjeHandler`
  - `GET /v1/projects/find/:id` -> `validateId`, `findProjeHandler`
  - `PATCH /v1/projects/update/:id` -> `authMiddleware`, `validateId`, `validate(updateProjeSchema)`, `updateProjeHandler`
  - `DELETE /v1/projects/delete/:id` -> `authMiddleware`, `validateId`, `deleteProjeHandler`
- **Yapılacak İşlem**: Dosya tamamen silinecektir.

---

## 4. Servisler, İş Mantığı, DTO ve Validasyon Şemaları (Services, DTOs & Validation Schemas)

### 4.1 Servis Dosyası (SİLİNECEK)
- **Dosya Yolu**: `cbit-app-api/src/services/proje.service.ts` (Toplam 45 Satır)
- **İçerdiği Arayüzler & Tipler**:
  - `interface IProjeData` (Proje alan tipleri)
  - `type IProjeUpdateData = Partial<IProjeData>`
- **İçerdiği Fonksiyonlar**:
  - `createProje(data: IProjeData)`: `prisma.proje.create`
  - `listAllProje()`: `prisma.proje.findMany` (createdAt desc)
  - `updateProje(id: string, data: IProjeUpdateData)`: `prisma.proje.update`
  - `deleteProje(id: string)`: `prisma.proje.delete`
  - `findProjeById(id: string)`: `prisma.proje.findUnique`
- **Yapılacak İşlem**: Dosya tamamen silinecektir.

### 4.2 Validasyon Şeması Dosyası (SİLİNECEK)
- **Dosya Yolu**: `cbit-app-api/src/schemas/proje.schema.ts` (Toplam 24 Satır)
- **İçerdiği Şemalar**:
  - `projeFields`: Zod alan tanımları
  - `createProjeSchema`: Zod nesne şeması
  - `updateProjeSchema`: `createProjeSchema.partial()`
- **Yapılacak İşlem**: Dosya tamamen silinecektir.

---

## 5. Modül Bağlantıları, Export'lar ve Sunucu Kayıtları (Module Exports & Server Setup)

### 5.1 Route Index (`cbit-app-api/src/routes/index.ts`) (DEĞİŞTİRİLECEK)
- **Değişiklik Konumu**: Satır 1
- **Kaldırılacak Kod**: `export { default as projeRoute } from './proje.route';`

### 5.2 Service Index (`cbit-app-api/src/services/index.ts`) (DEĞİŞTİRİLECEK)
- **Değişiklik Konumu**: Satır 1
- **Kaldırılacak Kod**: `export * from './proje.service';`

### 5.3 Enums (`cbit-app-api/src/helpers/enums.ts`) (DEĞİŞTİRİLECEK)
- **Değişiklik Konumu**: Satır 3 (`API_ROUTES` enum içi)
- **Kaldırılacak Kod**: `PROJE = '/projects',`

### 5.4 Sunucu Başlatıcı (`cbit-app-api/src/libs/server.ts`) (DEĞİŞTİRİLECEK)
- **Değişiklik Konumu 1**: Satır 10 (`import { projeRoute, haberRoute, authRoute, messageRoute, uploadRoute } from '../routes';`)
  - **İşlem**: `projeRoute` import listesinden kaldırılacak.
- **Değişiklik Konumu 2**: Satır 77 (`app.use(`${API_VERSION.V1}${API_ROUTES.PROJE}`, projeRoute);`)
  - **İşlem**: Bu satır tamamen kaldırılacak.

---

## 6. Silinecek ve Değiştirilecek Dosyaların Tam Listesi

### 6.1 Tamamen SİLİNECEK Dosyalar (4 Adet)
1. `cbit-app-api/src/controllers/proje.controller.ts`
2. `cbit-app-api/src/routes/proje.route.ts`
3. `cbit-app-api/src/schemas/proje.schema.ts`
4. `cbit-app-api/src/services/proje.service.ts`

### 6.2 DEĞİŞTİRİLECEK Dosyalar (4 Adet)
1. `cbit-app-api/prisma/schema.prisma` (Satır 19-38 silinecek)
2. `cbit-app-api/src/helpers/enums.ts` (Satır 3 silinecek)
3. `cbit-app-api/src/routes/index.ts` (Satır 1 silinecek)
4. `cbit-app-api/src/services/index.ts` (Satır 1 silinecek)
5. `cbit-app-api/src/libs/server.ts` (Satır 10'da import düzenleme, Satır 77 silinecek)

---

## 7. Haberler (News) ve Ortak Yapılar Bağımlılık İncelemesi (Cross-Module Analysis)

1. **Haberler Modülü İzolasyonu**:
   - `Haberler` veritabanı modeli (`model Haberler`) bağımsız bir tablodur ve `Proje` ile hiçbir FK / ilişki içermemektedir.
   - `haberler.service.ts`, `haber.controller.ts`, `haber.route.ts` ve `haber.schema.ts` dosyalarının hiçbirinde `proje` import'u veya çağrısı yoktur.
   - Resim yükleme endpoint'i (`upload.route.ts`) genel bir Multer middleware'idir ve `Haberler` resim yüklemeleri için bağımsız olarak çalışmaya devam edecektir.

2. **Ortak Middleware ve Helper Yapıları**:
   - `auth.middleware.ts`, `validate.ts`, `csrf.middleware.ts`, `sanitize.middleware.ts`, `headers.middleware.ts`, `rateLimit.middleware.ts` gibi tüm ortak middleware'ler projeden tamamen bağımsız generic yapılardır.
   - Herhangi bir ortak utility (`appError`, `jwt`, `scrypt`, `utils`) proje kodlarına bağımlı değildir.

3. **Sonuç**:
   Projeler ile ilgili tüm kodların `cbit-app-api` içerisinden kaldırılması, `Haberler` bölümünü veya sistemin geri kalanını **KESİNLİKLE BOZMAYACAKTIR**.

---

## 8. Temizlik Sonrası Çalıştırılacak Komutlar (Post-Cleanup Steps)
1. `npx prisma generate` (Prisma client'ı yeni şemaya göre yeniden üretmek için)
2. `npx prisma db push` (Veritabanındaki `Proje` tablosunu silmek / senkronize etmek için)
3. `npm run build:prod` (TypeScript derleme hatalarını kontrol etmek için)
