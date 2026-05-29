import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

export function AccessCodeEntry() {
  const navigate = useNavigate();
  const { tournaments } = useApp();
  const [accessCode, setAccessCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if the access code matches any tournament
    const tournament = tournaments.find(
      t => t.accessCode?.toUpperCase() === accessCode.toUpperCase()
    );

    setIsValidating(false);

    if (tournament) {
      toast.success(`Terhubung ke ${tournament.name}`);
      navigate("/penulis-skor");
    } else {
      toast.error("Kode akses tidak valid. Periksa kembali kode Anda.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate("/role-selection")}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mb-4">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl text-primary font-medium mb-2">Masukkan Kode Akses</h1>
            <p className="text-muted-foreground">
              Masukkan kode akses yang diberikan oleh Admin untuk mengakses turnamen
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-primary font-medium">
                Kode Akses Panitia *
              </Label>
              <Input
                id="code"
                type="text"
                placeholder="Ketik kode akses (contoh: ABC123)"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="h-12 rounded-xl text-base text-center text-2xl font-bold tracking-wider"
                maxLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                Kode terdiri dari 6 karakter huruf dan angka
              </p>
            </div>

            <div className="bg-[#e8f0f7] rounded-xl p-4">
              <p className="text-sm text-primary mb-2">
                <strong>💡 Belum punya kode?</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Minta kode akses kepada Admin yang telah membuat turnamen. Kode ini dibagikan setelah turnamen berhasil dibuat.
              </p>
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
      </div>

      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
        <span className="text-xl font-medium">?</span>
      </button>
    </div>
  );
}
