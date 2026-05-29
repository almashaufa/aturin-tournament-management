import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Play } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Scoreboard } from "./Scoreboard";
import { useApp } from "../context/AppContext";

export function PenulisSkor() {
  const navigate = useNavigate();
  const location = useLocation();
  // Get data from AppContext
  const { matches, getTeamById } = useApp();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(
    location.state?.matchId || null
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const handleStartMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
  };

  const handleBackToList = () => {
    setSelectedMatchId(null);
  };

  const selectedMatch = selectedMatchId ? matches.find(m => m.id === selectedMatchId) : null;

  if (selectedMatch) {
    return (
      <Scoreboard
        matchId={selectedMatch.id}
        onBack={handleBackToList}
      />
    );
  }

  const availableMatches = matches.filter(m => m.status !== "Selesai");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/role-selection")}
            className="flex items-center gap-2 text-primary hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h1 className="text-3xl md:text-4xl text-secondary">Penulis Skor</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Pilih pertandingan untuk mencatat skor
            </p>
          </div>
        </div>

        {/* Match List */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl text-primary mb-4">Daftar Pertandingan</h2>

          {availableMatches.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-center mb-6">
                <p className="text-muted-foreground mb-2">Belum ada pertandingan tersedia.</p>
                <p className="text-sm text-muted-foreground">Pertandingan yang dibuat di Mode Admin akan otomatis muncul di sini.</p>
              </div>
              <div className="bg-[#e8f0f7] rounded-xl p-4 mb-6">
                <p className="text-sm text-primary mb-2"><strong>Cara memulai:</strong></p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Masuk ke Mode Admin</li>
                  <li>Buat Turnamen baru</li>
                  <li>Tambah Tim peserta</li>
                  <li>Buat Jadwal Pertandingan</li>
                  <li>Kembali ke Mode Penulis Skor untuk mencatat hasil</li>
                </ol>
              </div>
              <Button
                onClick={() => navigate("/role-selection")}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Pilih Role Lain
              </Button>
            </div>
          ) : (
            availableMatches.map((match) => {
              const team1 = getTeamById(match.team1Id);
              const team2 = getTeamById(match.team2Id);

              // Display logic: Singles shows "Team - Player", Doubles shows "Team" only
              const team1Display = team1
                ? team1.athlete2
                  ? team1.name
                  : `${team1.name} - ${team1.athlete1}`
                : "Tim Tidak Ditemukan";

              const team2Display = team2
                ? team2.athlete2
                  ? team2.name
                  : `${team2.name} - ${team2.athlete1}`
                : "Tim Tidak Ditemukan";

              const matchType = team1?.athlete2 || team2?.athlete2 ? "Ganda" : "Tunggal";

              return (
                <div
                  key={match.id}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#e8f0f7] text-primary px-4 py-2 rounded-lg font-medium">
                        {match.code}
                      </div>
                      <Badge className="bg-[#f5edc8] text-muted-foreground hover:bg-[#f5edc8]">
                        {match.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                      <span className="text-lg md:text-xl text-primary font-medium">
                        {team1Display}
                      </span>
                      <span className="text-muted-foreground text-sm md:text-base">vs</span>
                      <span className="text-lg md:text-xl text-primary font-medium">
                        {team2Display}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mt-2">
                      {formatDate(match.date)} • {match.time} • {matchType}
                    </p>
                  </div>

                  <Button
                    onClick={() => handleStartMatch(match.id)}
                    className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Mulai
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
        <span className="text-xl font-medium">?</span>
      </button>
    </div>
  );
}
