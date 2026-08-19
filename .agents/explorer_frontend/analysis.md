# Frontend (`cbit-app-admin`) Projeler (Projects) Kod Analizi Raporu

## 1. Özet ve Analiz Kapsamı

`cbit-app-admin` projesi Vite + React + TypeScript mimarisi ile yazılmış bir admin panelidir. Proje genelinde "projeler" (projects) modülü ile ilişkili tüm bileşenler, rotalar, API istemci metodları, tür tanımları ve navigasyon bağlantıları başarıyla tespit edilmiştir.

Yapılan detaylı inceleme sonucunda:
- **1 Dosya Tamamen Silinecektir**: `src/pages/Projects.tsx` (488 satır)
- **4 Dosya Değiştirilecektir**: `src/App.tsx`, `src/api/client.ts`, `src/types/index.ts`, `src/pages/Dashboard.tsx`
- **Haberler (News) Modülü Bütünlüğü**: `News.tsx`, `Haber` tipi ve `api.haberler` istemcisi projeler modülünden tamamen bağımsızdır; temizlik sonrası %100 sorunsuz ve eksiksiz çalışmaya devam edecektir.

---

## 2. Rota ve Sayfa Dosyaları (Pages & Routes)

### 2.1 Silinecek Sayfa Dosyası
- **Dosya Yolu**: `cbit-app-admin/src/pages/Projects.tsx` (488 satır)
- **Açıklama**: Tüm proje listeleme, ekleme, güncelleme (form), silme ve görsel yükleme işlemlerini içeren ana React sayfa bileşenidir.

### 2.2 Rota Yapılandırması (Routing)
- **Dosya Yolu**: `cbit-app-admin/src/App.tsx`
- **Rota Adresi**: `/projects`
- **Satır 13**: `import Projects from "./pages/Projects";`
- **Satır 122**: `<Route path="/projects" element={<Projects />} />`

---

## 3. UI Bileşenleri, Formlar, Tablolar ve Butonlar

`src/pages/Projects.tsx` içinde tespit edilen projeye özel tüm UI elemanları:
1. **Header Bileşeni**:
   - `h1.page-title` ("Projeler") ve `p.page-subtitle` ("CDC projelerini buradan ekleyebilir veya güncelleyebilirsiniz.")
2. **Form Elemanları (`form-card`)**:
   - Form alanları: `projeAdi` (TR), `projeAdiEn` (EN), `projeResmi` (Sürükle-bırak dropzone & dosya yükleme), `projeDetayi` (TR), `projeDetayiEn` (EN), `beyazAlan`, `sertifikasyon`, `itGucu`, `toplamKuruluGuc`, `projeSuresi`, `toplamInsaatAlani`, `durum`, `durumEn`.
   - Butonlar: `Ekle`, `Kaydet`, `İptal`, `Kaldır` (görsel kaldırma).
3. **Tablo Elemanları (`card-table-wrap`)**:
   - `admin-table` tablosu: Görsel, Proje Adı, IT Gücü, Durum, İşlemler kolonları.
   - İşlem butonları: `Düzenle` (handleEdit) ve `Sil` (handleDelete).
4. **Dashboard Kart Elemanı (`Dashboard.tsx`)**:
   - `stat-card`: "Toplam Proje" istatistik kartı (satır 30-34).

---

## 4. Navigasyon ve Kenar Çubuğu (Sidebar Links)

### 4.1 Kenar Çubuğu Linki
- **Dosya Yolu**: `cbit-app-admin/src/App.tsx`
- **İkon İthalatı**: Satır 19 (`FolderKanban` ikonu `lucide-react` paketinden)
- **Navigasyon Linki**: Satır 64-72:
```tsx
<NavLink
  to="/projects"
  className={({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`
  }
>
  <FolderKanban size={19} strokeWidth={2} />
  <span>Projeler</span>
</NavLink>
```

### 4.2 Dashboard Metin Referansı
- **Dosya Yolu**: `cbit-app-admin/src/pages/Dashboard.tsx`
- **Satır 46**: "...projelerinizi ve haberlerinizi ekleyebilir..." metnindeki "projelerinizi ve" ifadesi.

---

## 5. API İstemcisi, Çağrılar, State ve Türler

### 5.1 API İstemci Metodları (`src/api/client.ts`)
- **İthalat**: Satır 1'de `Proje` tipi ithalatı (`import type { Haber, Proje, Message } from "../types";`).
- **Endpoint Tanımları** (Satır 51-66):
```typescript
projeler: {
  list: () => request<Proje[]>("/v1/projects/our-projects"),
  get: (id: string) => request<Proje>(`/v1/projects/find/${id}`),
  create: (data: Partial<Proje>) =>
    request<void>("/v1/projects/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Proje>) =>
    request<void>(`/v1/projects/update/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/v1/projects/delete/${id}`, { method: "DELETE" }),
},
```

### 5.2 TypeScript Tür Tanımları (`src/types/index.ts`)
- **Arabirim**: `Proje` interface tanımı (Satır 1-17):
```typescript
export interface Proje {
  id: string;
  projeAdi: string;
  projeAdiEn?: string | null;
  projeDetayi?: string | null;
  projeDetayiEn?: string | null;
  projeResmi?: string | null;
  beyazAlan?: string | null;
  sertifikasyon?: string | null;
  itGucu?: string | null;
  toplamKuruluGuc?: string | null;
  projeSuresi?: string | null;
  toplamInsaatAlani?: string | null;
  durum?: string | null;
  durumEn?: string | null;
  createdAt: string;
}
```

### 5.3 State ve Hook Yönetimi (`src/pages/Dashboard.tsx`)
- **Satır 5**: `const [stats, setStats] = useState({ projectsCount: 0, newsCount: 0 });`
- **Satır 9**: `Promise.all([api.projeler.list(), api.haberler.list()])`

---

## 6. Silinecek ve Değiştirilecek Dosyaların Somut Listesi

### 6.1 Tamamen Silinecek Dosyalar (1 Adet)
1. `cbit-app-admin/src/pages/Projects.tsx` (488 satır)

### 6.2 Değiştirilecek Dosyalar ve Değişiklik Detayları (4 Adet)

#### 1. `cbit-app-admin/src/App.tsx`
- **Satır 13**: `import Projects from "./pages/Projects";` ithalatını kaldırın.
- **Satır 19**: `FolderKanban,` ikon ithalatını `lucide-react` listesinden kaldırın.
- **Satır 64-72**: `Projeler` `<NavLink>` bloğunu tamamen kaldırın:
  ```tsx
  <NavLink
    to="/projects"
    className={({ isActive }) =>
      `sidebar-link ${isActive ? "active" : ""}`
    }
  >
    <FolderKanban size={19} strokeWidth={2} />
    <span>Projeler</span>
  </NavLink>
  ```
- **Satır 122**: `<Route path="/projects" element={<Projects />} />` rotasını kaldırın.

#### 2. `cbit-app-admin/src/api/client.ts`
- **Satır 1**: `import type { Haber, Proje, Message } from "../types";` ifadesindeki `Proje` kelimesini çıkarın (`import type { Haber, Message } from "../types";`).
- **Satır 51-66**: `projeler: { ... },` nesne bloğunu `api` nesnesi içinden tamamen kaldırın.

#### 3. `cbit-app-admin/src/types/index.ts`
- **Satır 1-17**: `export interface Proje { ... }` tanımını tamamen kaldırın.

#### 4. `cbit-app-admin/src/pages/Dashboard.tsx`
- **Satır 5**: `useState({ projectsCount: 0, newsCount: 0 })` -> `useState({ newsCount: 0 })` olarak güncelleyin.
- **Satır 9-15**: `Promise.all([api.projeler.list(), api.haberler.list()])` çağrısını doğrudan `api.haberler.list()` çağrısı ile değiştirin ve `projectsCount` atamasını kaldırın:
  ```typescript
  api.haberler
    .list()
    .then((news) => {
      setStats({ newsCount: news.length });
    })
  ```
- **Satır 30-34**: "Toplam Proje" istatistik kartını kaldırın:
  ```tsx
  <div className="stat-card">
    <span className="stat-label">Toplam Proje</span>
    <span className="stat-value">{loading ? "..." : stats.projectsCount}</span>
    <span className="stat-desc">Veritabanında kayıtlı aktif projeler</span>
  </div>
  ```
- **Satır 46**: "Sol taraftaki menüyü kullanarak projelerinizi ve haberlerinizi ekleyebilir..." cümlesini "Sol taraftaki menüyü kullanarak haberlerinizi ekleyebilir..." şeklinde güncelleyin.

---

## 7. Haberler (News) Modülü Etki ve Doğrulama Değerlendirmesi

- `cbit-app-admin/src/pages/News.tsx` dosyası doğrudan `api.haberler` istemcisini ve `Haber` türünü kullanmaktadır.
- `News.tsx` içinde `Proje` veya `api.projeler` ile ilgili hiçbir bağlam, ithalat veya bağımlılık bulunmamaktadır.
- `src/App.tsx` içerisindeki `/news` rotası ve Sidebar menüsündeki "Haberler" bağlantısı aynen korunacaktır.
- `src/api/client.ts` içerisindeki `haberler` nesnesi ve `src/types/index.ts` içerisindeki `Haber` arayüzü dokunulmadan kalacaktır.
- **Sonuç**: Projeler modülünün kaldırılması, "Haberler" (News) modülünün çalışmasını kesinlikle etkilemeyecek, modül %100 sağlam ve işlevsel kalacaktır.
