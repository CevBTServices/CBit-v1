## 2026-08-03T12:05:29Z
You are a Worker subagent assigned to draft and write the comprehensive cleanup plan in Turkish named `cleanup_plan.md` at the project root `C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\cleanup_plan.md`.

Your Working Directory: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\worker_plan_writer
Path to ORIGINAL_REQUEST.md: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\ORIGINAL_REQUEST.md
Path to PROJECT.md: C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\orchestrator\PROJECT.md

INPUT REPORTS TO READ & SYNTHESIZE:
1. `C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_backend\analysis.md`
2. `C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_frontend\analysis.md`
3. `C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\.agents\explorer_cross_ref\handoff.md`

CRITICAL INSTRUCTIONS & WARNINGS:
- DO NOT delete or modify ANY existing source code files in `cbit-app-api` or `cbit-app-admin`!
- DO NOT CHEAT. All plan details must be genuine and accurate.
- Create ONLY the `C:\Users\ahmet.altun\Desktop\WorkSpace\cbit\cleanup_plan.md` file using `write_to_file`.

PLAN STRUCTURE REQUIREMENTS (in Turkish):
1. **Başlık ve Giriş**:
   - Proje kapsamı ve amacı: Sistemden "projeler" (projects) modülünün tamamen kaldırılması ve yalnızca "haberler" (news) modülünün bırakılması.
   - Açık Uyarı Metni: "ÖNEMLİ: Bu bir temizlik planı dokümanıdır. Mevcut projede hiçbir kaynak kod dosyası silinmemiş veya değiştirilmemiştir."
2. **Backend (`cbit-app-api`) Temizlik Planı**:
   - **Silinecek Dosyalar** (Tam dosya yolları, içerik açıklaması, satır sayıları):
     - `cbit-app-api/src/controllers/proje.controller.ts` (65 satır)
     - `cbit-app-api/src/routes/proje.route.ts` (19 satır)
     - `cbit-app-api/src/schemas/proje.schema.ts` (24 satır)
     - `cbit-app-api/src/services/proje.service.ts` (45 satır)
   - **Değiştirilecek Dosyalar** (Tam dosya yolları, kesin satır numaraları, silinecek kod blokları/import'lar):
     - `cbit-app-api/prisma/schema.prisma` (Satır 19-38 `model Proje` bloğunun kaldırılması)
     - `cbit-app-api/src/helpers/enums.ts` (Satır 3 `PROJE = '/projects',` satırının kaldırılması)
     - `cbit-app-api/src/routes/index.ts` (Satır 1 `export { default as projeRoute } from './proje.route';` kaldırılması)
     - `cbit-app-api/src/services/index.ts` (Satır 1 `export * from './proje.service';` kaldırılması)
     - `cbit-app-api/src/libs/server.ts` (Satır 10 import listesinden `projeRoute` çıkarılması ve Satır 77 `app.use(ApiPath.PROJE, projeRoute);` satırının kaldırılması)
3. **Frontend (`cbit-app-admin`) Temizlik Planı**:
   - **Silinecek Dosyalar**:
     - `cbit-app-admin/src/pages/Projects.tsx` (488 satır)
   - **Değiştirilecek Dosyalar**:
     - `cbit-app-admin/src/App.tsx` (Satır 13 `Projects` importu, Satır 19 `FolderKanban` ikonu, Satır 64-72 Sidebar `<NavLink to="/projects">`, Satır 122 `/projects` `<Route>`)
     - `cbit-app-admin/src/api/client.ts` (Satır 1 `Proje` type importu, Satır 51-66 `projeler` API client nesnesi)
     - `cbit-app-admin/src/types/index.ts` (Satır 1-17 `export interface Proje` tür tanımı)
     - `cbit-app-admin/src/pages/Dashboard.tsx` (Satır 5 `stats` state'i, Satır 9 `api.projeler.list()` çağrısı, Satır 30-34 Toplam Proje stat kartı, Satır 46 açıklama metni)
4. **Modül Bağımsızlığı ve Medya Yüklemeleri**:
   - `Haberler` (News) modülünün projeler ile ilişkisiz olduğu, silme işleminin haberler modülünü etkilemeyeceğinin doğrulaması.
   - Resim yükleme sistemi (`/v1/uploads` ve `cbit-app-api/uploads`) ortak olduğu için aynen korunacağı açıklaması.
5. **Uygulama Adımları Sıralaması**:
   - Adım 1: Backend dosyalarının silinmesi ve güncellenmesi.
   - Adım 2: Prisma istemcisinin yeniden üretilmesi (`npx prisma generate`).
   - Adım 3: Frontend dosyalarının silinmesi ve güncellenmesi.
   - Adım 4: Build ve çalıştırma testlerinin yapılması.
6. **Doğrulama ve Kontrol Listesi**:
   - Değiştirilecek/silinecek tüm bileşenlerin onay listesi.
