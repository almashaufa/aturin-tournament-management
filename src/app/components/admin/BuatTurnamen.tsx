import { useNavigate } from "react-router";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";

export function BuatTurnamen() {
  const navigate = useNavigate();
  const { addTournament } = useApp();
  const [namaTurnamen, setNamaTurnamen] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const tournament = addTournament({
      name: namaTurnamen,
      startDate: tanggalMulai,
      endDate: tanggalSelesai,
    });

    // Clear form
    setNamaTurnamen("");
    setTanggalMulai("");
    setTanggalSelesai("");
    setIsSubmitting(false);

    // Show access code
    setAccessCode(tournament.accessCode);
    setShowAccessCode(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    toast.success("Kode berhasil disalin");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseDialog = () => {
    setShowAccessCode(false);
    navigate("/admin-dashboard");
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
          <h1 className="text-3xl text-primary font-medium mb-2">Buat Turnamen</h1>
          <p className="text-muted-foreground mb-8">Buat turnamen bulu tangkis baru</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nama" className="text-primary font-medium">Nama Turnamen *</Label>
              <Input
                id="nama"
                type="text"
                placeholder="Ketik nama turnamen, contoh: Turnamen Bulu Tangkis 2026"
                value={namaTurnamen}
                onChange={(e) => setNamaTurnamen(e.target.value)}
                className="h-12 rounded-xl text-base"
                required
              />
              <p className="text-xs text-muted-foreground">Masukkan nama turnamen yang akan dibuat</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mulai" className="text-primary font-medium">Tanggal Mulai *</Label>
                <Input
                  id="mulai"
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  className="h-12 rounded-xl text-base"
                  required
                />
                <p className="text-xs text-muted-foreground">Pilih tanggal mulai turnamen</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="selesai" className="text-primary font-medium">Tanggal Selesai *</Label>
                <Input
                  id="selesai"
                  type="date"
                  value={tanggalSelesai}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                  className="h-12 rounded-xl text-base"
                  required
                />
                <p className="text-xs text-muted-foreground">Pilih tanggal selesai turnamen</p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Membuat..." : "Buat Turnamen"}
            </Button>
          </form>
        </div>
      </div>

      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
        <span className="text-xl font-medium">?</span>
      </button>

      {/* Access Code Dialog */}
      <Dialog open={showAccessCode} onOpenChange={setShowAccessCode}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary">Turnamen Berhasil Dibuat!</DialogTitle>
            <DialogDescription className="sr-only">Kode akses turnamen untuk panitia</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-[#e8f0f7] rounded-xl p-4">
              <p className="text-sm text-primary mb-2">
                <strong>Kode Akses Panitia:</strong>
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-primary tracking-wider">{accessCode}</p>
                </div>
                <Button
                  onClick={handleCopyCode}
                  variant="outline"
                  className="h-12 px-4 rounded-xl"
                >
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>
            <div className="bg-[#f5edc8] rounded-xl p-4">
              <p className="text-sm text-muted-foreground">
                <strong>💡 Penting:</strong> Bagikan kode ini kepada tim Panitia untuk dapat mengakses dan mengelola turnamen yang sama.
              </p>
            </div>
            <Button
              onClick={handleCloseDialog}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              Kembali ke Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
