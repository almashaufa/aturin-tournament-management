import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";

export function TambahTim() {
  const navigate = useNavigate();
  const { addTeam } = useApp();
  const [namaTim, setNamaTim] = useState("");
  const [namaAtlet1, setNamaAtlet1] = useState("");
  const [namaAtlet2, setNamaAtlet2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    addTeam({
      name: namaTim,
      athlete1: namaAtlet1,
      athlete2: namaAtlet2 || undefined,
    });

    setIsSubmitting(false);
    toast.success("Tim berhasil ditambahkan");

    // Clear form
    setNamaTim("");
    setNamaAtlet1("");
    setNamaAtlet2("");
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
          <h1 className="text-3xl text-primary font-medium mb-2">Tambah Tim</h1>
          <p className="text-muted-foreground mb-8">Tambahkan tim peserta turnamen</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tim" className="text-primary font-medium">Nama Tim *</Label>
              <Input
                id="tim"
                type="text"
                placeholder="Ketik nama tim, contoh: Tim A atau Tim Merah"
                value={namaTim}
                onChange={(e) => setNamaTim(e.target.value)}
                className="h-12 rounded-xl text-base"
                required
              />
              <p className="text-xs text-muted-foreground">Masukkan nama tim yang akan bertanding</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="atlet1" className="text-primary font-medium">Nama Atlet 1 *</Label>
              <Input
                id="atlet1"
                type="text"
                placeholder="Ketik nama lengkap atlet pertama"
                value={namaAtlet1}
                onChange={(e) => setNamaAtlet1(e.target.value)}
                className="h-12 rounded-xl text-base"
                required
              />
              <p className="text-xs text-muted-foreground">Masukkan nama atlet utama atau atlet pertama (untuk ganda)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="atlet2" className="text-primary font-medium">Nama Atlet 2 (Opsional)</Label>
              <Input
                id="atlet2"
                type="text"
                placeholder="Ketik nama lengkap atlet kedua (untuk kategori ganda)"
                value={namaAtlet2}
                onChange={(e) => setNamaAtlet2(e.target.value)}
                className="h-12 rounded-xl text-base"
              />
              <p className="text-xs text-muted-foreground">Kosongkan jika kategori tunggal, isi jika kategori ganda</p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 gap-2"
            >
              <Plus className="w-5 h-5" />
              {isSubmitting ? "Menambahkan..." : "Tambah Tim"}
            </Button>
          </form>
        </div>
      </div>

      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
        <span className="text-xl font-medium">?</span>
      </button>
    </div>
  );
}
