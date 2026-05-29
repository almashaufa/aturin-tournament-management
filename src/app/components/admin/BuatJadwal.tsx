import { useNavigate } from "react-router";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";

export function BuatJadwal() {
  const navigate = useNavigate();
  const { teams, addMatch } = useApp();
  const [tim1, setTim1] = useState("");
  const [tim2, setTim2] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [waktu, setWaktu] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tim1 === tim2) {
      toast.error("Tim 1 dan Tim 2 tidak boleh sama!");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    addMatch({
      team1Id: tim1,
      team2Id: tim2,
      date: tanggal,
      time: waktu,
      status: "Belum Dimulai",
    });

    setIsSubmitting(false);
    toast.success("Pertandingan berhasil dijadwalkan");

    // Clear form
    setTim1("");
    setTim2("");
    setTanggal("");
    setWaktu("");

    setTimeout(() => navigate("/admin-dashboard"), 300);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h1 className="text-3xl text-primary font-medium mb-2">Buat Jadwal Pertandingan</h1>
          <p className="text-muted-foreground mb-8">Atur jadwal pertandingan bulu tangkis</p>

          {teams.length < 2 ? (
            <div className="bg-[#f5edc8] p-6 rounded-xl text-center">
              <p className="text-primary mb-4">Belum ada cukup tim untuk membuat pertandingan.</p>
              <Button
                onClick={() => navigate("/admin/tambah-tim")}
                className="bg-secondary hover:bg-secondary/90"
              >
                Tambah Tim
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tim1" className="text-primary font-medium">Tim 1 *</Label>
                <Select value={tim1} onValueChange={setTim1} required>
                  <SelectTrigger className="h-12 rounded-xl text-base">
                    <SelectValue placeholder="Klik untuk memilih tim pertama" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Pilih tim pertama yang akan bertanding</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tim2" className="text-primary font-medium">Tim 2 *</Label>
                <Select value={tim2} onValueChange={setTim2} required>
                  <SelectTrigger className="h-12 rounded-xl text-base">
                    <SelectValue placeholder="Klik untuk memilih tim kedua" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id} disabled={team.id === tim1}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Pilih tim kedua yang akan bertanding (tidak boleh sama dengan Tim 1)</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal" className="text-primary font-medium">Tanggal *</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="h-12 rounded-xl text-base"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Pilih tanggal pertandingan</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waktu" className="text-primary font-medium">Waktu *</Label>
                  <Input
                    id="waktu"
                    type="time"
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                    className="h-12 rounded-xl text-base"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Pilih jam pertandingan</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 gap-2"
              >
                <Calendar className="w-5 h-5" />
                {isSubmitting ? "Membuat..." : "Buat Jadwal"}
              </Button>
            </form>
          )}
        </div>
      </div>

      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
        <span className="text-xl font-medium">?</span>
      </button>
    </div>
  );
}
