import { useNavigate } from "react-router";
import { Trophy, Users, Calendar, BarChart3, Download } from "lucide-react";
import { useApp } from "../context/AppContext";

const menuItems = [
  {
    id: "buat-turnamen",
    title: "Buat Turnamen",
    description: "Buat turnamen baru",
    icon: Trophy,
    color: "bg-primary",
    route: "/admin/buat-turnamen"
  },
  {
    id: "tambah-tim",
    title: "Tambah Tim",
    description: "Tambahkan tim peserta",
    icon: Users,
    color: "bg-secondary",
    route: "/admin/tambah-tim"
  },
  {
    id: "buat-jadwal",
    title: "Buat Jadwal Pertandingan",
    description: "Atur jadwal pertandingan",
    icon: Calendar,
    color: "bg-primary",
    route: "/admin/buat-jadwal"
  },
  {
    id: "lihat-klasemen",
    title: "Lihat Klasemen",
    description: "Lihat klasemen turnamen",
    icon: BarChart3,
    color: "bg-secondary",
    route: "/admin/lihat-klasemen"
  },
  {
    id: "ekspor-data",
    title: "Ekspor Data",
    description: "Ekspor data turnamen",
    icon: Download,
    color: "bg-primary",
    route: "/admin/ekspor-data"
  },
];

export function AdminDashboard() {
  const navigate = useNavigate();
const { tournaments } = useApp();


  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <h1 className="text-2xl md:text-3xl text-primary font-medium">Dashboard Admin</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Kelola turnamen Bulu Tangkis</p>
      {tournaments.length > 0 && (
  <div className="bg-[#e8f0f7] rounded-xl p-4 mt-4">
    <p className="text-sm font-semibold text-primary">
      🏸 Turnamen Aktif
    </p>

    <p className="text-sm mt-2">
      {tournaments[tournaments.length - 1].name}
    </p>

    <p className="text-xs text-muted-foreground mt-1">
      Kode Akses: {tournaments[tournaments.length - 1].accessCode}
    </p>
  </div>
)}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.route)}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all text-left"
              >
                <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg text-primary font-medium mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </button>
            );
          })}
        </div>


      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
        <span className="text-xl font-medium">?</span>
      </button>
    </div>
  );
}
