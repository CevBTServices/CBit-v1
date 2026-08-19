import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import { SiteAyarlariProvider, useSiteAyarlari } from "./context/SiteAyarlariContext";
import "./index.css";

// Sayfaları dinamik import (lazy load) ile tanımlayarak bundle boyutunu küçültüyoruz
const Anasayfa = lazy(() => import("./pages/Anasayfa"));
const Hakkimizda = lazy(() => import("./pages/Hakkimizda"));
const Cozumler = lazy(() => import("./pages/Cozumler"));
const IsOrtaklari = lazy(() => import("./pages/IsOrtaklari"));
const Projeler = lazy(() => import("./pages/Projeler"));
const Haberler = lazy(() => import("./pages/Haberler"));
const Iletisim = lazy(() => import("./pages/Iletisim"));
const CerezPolitikasi = lazy(() => import("./pages/CerezPolitikasi"));
const KisiselVerilerinKorunmasi = lazy(() => import("./pages/KisiselVerilerinKorunmasi"));
const NedenCbit = lazy(() => import("./pages/NedenCbit"));

// Sayfa yüklenene kadar gösterilecek loading tasarımı
const LoadingFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontSize: "1.2rem", color: "#666" }}>
    Yükleniyor...
  </div>
);

function AppRoutes() {
  const { ayarlar } = useSiteAyarlari();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Anasayfa />} />
        <Route path="/hakkimizda" element={<Hakkimizda />} />
        <Route path="/neden-biz" element={<NedenCbit />} />
        <Route path="/cozumler" element={<Cozumler />} />
        <Route path="/yetkinliklerimiz" element={<Navigate to="/cozumler" replace />} />
        <Route 
          path="/is-ortaklari" 
          element={ayarlar.isOrtaklariAktif ? <IsOrtaklari /> : <Navigate to="/" replace />} 
        />
        <Route
          path="/projeler"
          element={ayarlar.projelerAktif ? <Projeler /> : <Navigate to="/" replace />}
        />
        <Route
          path="/haberler"
          element={ayarlar.haberlerAktif ? <Haberler /> : <Navigate to="/" replace />}
        />
        <Route path="/iletisim" element={<Iletisim />} />
        <Route path="/cerez-politikasi" element={<CerezPolitikasi />} />
        <Route path="/kisisel-verilerin-korunmasi" element={<KisiselVerilerinKorunmasi />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteAyarlariProvider>
        <Suspense fallback={<LoadingFallback />}>
          <AppRoutes />
        </Suspense>
      </SiteAyarlariProvider>
    </BrowserRouter>
  );
}

export default App;
