import { useState } from "react";
import { useNavigate } from "react-router";
import { UserCog, PenLine, ChevronRight, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";

const sports = [
  { id: "atletik", name: "Atletik", enabled: false },
  { id: "bola-voli", name: "Bola Voli", enabled: false },
  { id: "sepak-bola", name: "Sepak Bola", enabled: false },
  { id: "bulu-tangkis", name: "Bulu Tangkis", enabled: true },
  { id: "bersepeda", name: "Bersepeda", enabled: false },
  { id: "renang", name: "Renang", enabled: false },
  { id: "pencak-silat", name: "Pencak Silat", enabled: false },
  { id: "bola-basket", name: "Bola Basket", enabled: false },
  { id: "angkat-besi", name: "Angkat Besi", enabled: false },
];

export function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const { tournaments } = useApp();

const [accessCode, setAccessCode] = useState("");
const [isValidating, setIsValidating] = useState(false);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setSelectedSport(null);
  };

  const handleSportSelect = (sportId: string) => {
    const sport = sports.find((s) => s.id === sportId);
    if (sport?.enabled) {
      setSelectedSport(sportId);
      navigate("/admin-dashboard");
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsValidating(true);

  await new Promise(resolve => setTimeout(resolve, 500));

  const tournament = tournaments.find(
    t => t.accessCode?.toUpperCase() === accessCode.toUpperCase()
  );

  setIsValidating(false);

  if (tournament) {
    toast.success(`Terhubung ke ${tournament.name}`);
    navigate("/penulis-skor");
  } else {
    toast.error("Kode akses tidak valid");
  }
};

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl text-primary mb-2">Pilih Peran Anda</h1>
          <p className="text-sm md:text-base text-muted-foreground">Silakan pilih peran untuk melanjutkan</p>
        </motion.div>

        <motion.div
          layout
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {/* Admin Card */}
          <motion.div
            layout
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect("admin")}
            className={`relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
              selectedRole === "admin"
                ? "ring-2 ring-primary shadow-xl"
                : "shadow-md hover:shadow-lg"
            }`}
          >
            {selectedRole === "admin" && (
              <div className="absolute top-4 right-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            )}

            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${
                  selectedRole === "admin"
                    ? "bg-primary"
                    : "bg-[#f5edc8]"
                }`}
              >
                <UserCog
                  className={`w-10 h-10 ${
                    selectedRole === "admin" ? "text-white" : "text-primary"
                  }`}
                />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl text-primary mb-2">Admin</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Buat turnamen, tambah tim, dan atur jadwal
                </p>
              </div>
            </div>
          </motion.div>

          {/* Penulis Skor Card */}
          <motion.div
            layout
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect("penulis-skor")}
            className={`relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
              selectedRole === "penulis-skor"
                ? "ring-2 ring-secondary shadow-xl"
                : "shadow-md hover:shadow-lg"
            }`}
          >
            {selectedRole === "penulis-skor" && (
              <div className="absolute top-4 right-4 w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            )}

            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${
                  selectedRole === "penulis-skor"
                    ? "bg-secondary"
                    : "bg-[#f5edc8]"
                }`}
              >
                <PenLine
                  className={`w-10 h-10 ${
                    selectedRole === "penulis-skor" ? "text-white" : "text-secondary"
                  }`}
                />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl text-primary mb-2">Penulis Skor</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Catat skor dan pelanggaran pertandingan
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Expandable Sections */}
        <AnimatePresence mode="wait">
          {selectedRole === "admin" && (
            <motion.div
              key="admin-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
                <h3 className="text-xl md:text-2xl text-primary mb-6">Pilih Cabang Olahraga</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sports.map((sport) => (
                    <button
                      key={sport.id}
                      onClick={() => handleSportSelect(sport.id)}
                      disabled={!sport.enabled}
                      className={`relative p-6 rounded-2xl text-center transition-all ${
                        sport.enabled
                          ? "bg-primary text-white hover:bg-primary/90 shadow-md cursor-pointer"
                          : "bg-[#f5edc8] text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      <div className="flex justify-center mb-2 md:mb-3">
                        {sport.enabled ? (
                          <Trophy className="w-10 md:w-12 h-10 md:h-12" strokeWidth={1.5} />
                        ) : (
                          <div className="w-10 md:w-12 h-10 md:h-12 opacity-30">
                            <Trophy className="w-full h-full" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                      <div className="text-xs md:text-sm font-medium">
                        {sport.enabled ? sport.name : "Coming Soon"}
                      </div>
                      {!sport.enabled && (
                        <div className="text-xs mt-1 opacity-70">{sport.name}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedRole === "penulis-skor" && (
            <motion.div
              key="penulis-skor-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
                <h3 className="text-xl md:text-2xl text-primary mb-4">Mode Penulis Skor</h3>
             <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <Label htmlFor="code" className="text-primary font-medium">
      Kode Akses
    </Label>

    <Input
      id="code"
      type="text"
      placeholder="ABC123"
      value={accessCode}
      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
      maxLength={6}
      className="mt-2 text-center text-xl font-bold tracking-wider"
      required
    />
  </div>

  <Button
    type="submit"
    disabled={isValidating || accessCode.length !== 6}
    className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90"
  >
    {isValidating ? "Memvalidasi..." : "Masuk"}
  </Button>
</form>
           
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
        <span className="text-xl">?</span>
      </button>
    </div>
  );
}
