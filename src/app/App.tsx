import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AppProvider } from "./context/AppContext";
import { Login } from "./components/Login";
import { RoleSelection } from "./components/RoleSelection";
import { AdminDashboard } from "./components/AdminDashboard";
import { PenulisSkor } from "./components/PenulisSkor";
import { AccessCodeEntry } from "./components/AccessCodeEntry";
import { BuatTurnamen } from "./components/admin/BuatTurnamen";
import { TambahTim } from "./components/admin/TambahTim";
import { BuatJadwal } from "./components/admin/BuatJadwal";
import { LihatKlasemen } from "./components/admin/LihatKlasemen";
import { EksporData } from "./components/admin/EksporData";
import { Toaster } from "./components/ui/sonner";

// Main App Component
function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/access-code-entry" element={<AccessCodeEntry />} />
          <Route path="/penulis-skor" element={<PenulisSkor />} />
          <Route path="/admin/buat-turnamen" element={<BuatTurnamen />} />
          <Route path="/admin/tambah-tim" element={<TambahTim />} />
          <Route path="/admin/buat-jadwal" element={<BuatJadwal />} />
          <Route path="/admin/lihat-klasemen" element={<LihatKlasemen />} />
          <Route path="/admin/ekspor-data" element={<EksporData />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;