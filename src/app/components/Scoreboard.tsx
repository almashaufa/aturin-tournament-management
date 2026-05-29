import { useState, useEffect } from "react";
import { ArrowLeft, Radio, Download, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useApp } from "../context/AppContext";

interface ScoreboardProps {
  matchId: string;
  onBack: () => void;
}

interface Violation {
  id: string;
  team: "A" | "B";
  type: string;
  timestamp: string;
}

const violationTypes = [
  "Out",
  "Net",
  "Fault",
  "Servis Fault",
  "Double Hit",
  "Let",
  "Touch",
];

export function Scoreboard({ matchId, onBack }: ScoreboardProps) {
  const { getMatchById, getTeamById, finishMatch, updateMatch } = useApp();
  const match = getMatchById(matchId);

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [serving, setServing] = useState<"A" | "B">("A");
  const [violations, setViolations] = useState<{id: string; teamId: string; type: string; timestamp: string}[]>([]);
  const [showViolationDialog, setShowViolationDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<"A" | "B" | null>(null);
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  useEffect(() => {
    if (match && match.status === "Belum Dimulai") {
      updateMatch(matchId, { status: "Berlangsung" });
    }
  }, [matchId]);

  if (!match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-primary mb-4">Pertandingan tidak ditemukan.</p>
          <Button onClick={onBack}>Kembali</Button>
        </div>
      </div>
    );
  }

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

  const handleScoreChange = (team: "A" | "B", delta: number) => {
    if (team === "A") {
      setScoreA(Math.max(0, scoreA + delta));
    } else {
      setScoreB(Math.max(0, scoreB + delta));
    }
  };

  const handleAddViolation = (type: string) => {
    if (!selectedTeam || !match) return;

    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, "0")}.${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}.${now.getSeconds().toString().padStart(2, "0")}`;

    const teamId = selectedTeam === "A" ? match.team1Id : match.team2Id;

    const newViolation = {
      id: Date.now().toString(),
      teamId,
      type: type.toLowerCase(),
      timestamp,
    };

    setViolations([...violations, newViolation]);
    setShowViolationDialog(false);
    setSelectedTeam(null);
  };

  const openViolationDialog = (team: "A" | "B") => {
    setSelectedTeam(team);
    setShowViolationDialog(true);
  };

  const handleFinishMatch = () => {
    setShowFinishDialog(true);
  };

  const handleExportData = () => {
    if (!match || !team1 || !team2) return;

    // Finish the match in the context
    finishMatch(matchId, scoreA, scoreB, violations);

    const violationText = violations.map(v => {
      const team = getTeamById(v.teamId);
      return `${team?.name || 'Unknown'} - ${v.type} (${v.timestamp})`;
    }).join("; ");

    const csvHeader = "Kode Pertandingan,Tim 1,Tim 2,Skor Tim 1,Skor Tim 2,Pelanggaran\n";
    const csvRow = `${match.code},${team1.name},${team2.name},${scoreA},${scoreB},"${violationText || '-'}"`;
    const csvContent = csvHeader + csvRow;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${match.code}_hasil-pertandingan.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowFinishDialog(false);
    onBack();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>

        {/* Set Indicator */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex gap-2">
            {[1, 2, 3].map((set) => (
              <button
                key={set}
                onClick={() => setCurrentSet(set)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  currentSet === set
                    ? "bg-primary text-white"
                    : "bg-white text-primary border border-primary"
                }`}
              >
                Set {set}
              </button>
            ))}
          </div>
        </div>

        {/* Scoreboard */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md mb-6">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Team A */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl text-primary">{team1Display}</h2>
                {serving === "A" && (
                  <Badge className="bg-secondary text-white hover:bg-secondary gap-1 text-xs">
                    <Radio className="w-3 h-3" />
                    Servis
                  </Badge>
                )}
              </div>

              <div className="text-center">
                <div className="text-6xl md:text-7xl font-bold text-primary mb-4 md:mb-6">{scoreA}</div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleScoreChange("A", 1)}
                    className="flex-1 h-12 md:h-14 text-lg md:text-xl rounded-xl bg-primary hover:bg-primary/90"
                  >
                    +
                  </Button>
                  <Button
                    onClick={() => handleScoreChange("A", -1)}
                    variant="outline"
                    className="flex-1 h-12 md:h-14 text-lg md:text-xl rounded-xl border-2"
                  >
                    −
                  </Button>
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl text-primary">{team2Display}</h2>
                {serving === "B" && (
                  <Badge className="bg-secondary text-white hover:bg-secondary gap-1 text-xs">
                    <Radio className="w-3 h-3" />
                    Servis
                  </Badge>
                )}
              </div>

              <div className="text-center">
                <div className="text-6xl md:text-7xl font-bold text-primary mb-4 md:mb-6">{scoreB}</div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleScoreChange("B", 1)}
                    className="flex-1 h-12 md:h-14 text-lg md:text-xl rounded-xl bg-primary hover:bg-primary/90"
                  >
                    +
                  </Button>
                  <Button
                    onClick={() => handleScoreChange("B", -1)}
                    variant="outline"
                    className="flex-1 h-12 md:h-14 text-lg md:text-xl rounded-xl border-2"
                  >
                    −
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Violation Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md mb-6">
          <h3 className="text-xl md:text-2xl text-primary mb-4">Catat Pelanggaran</h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Team A Violations */}
            <div>
              <h4 className="text-base md:text-lg text-primary mb-3">{team1Display}</h4>
              <div className="flex flex-wrap gap-2">
                {violationTypes.map((type) => (
                  <button
                    key={`A-${type}`}
                    onClick={() => openViolationDialog("A")}
                    className="px-3 py-2 text-sm md:text-base bg-[#f5edc8] text-primary rounded-full hover:bg-[#ebe3b8] transition-colors"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Team B Violations */}
            <div>
              <h4 className="text-base md:text-lg text-primary mb-3">{team2Display}</h4>
              <div className="flex flex-wrap gap-2">
                {violationTypes.map((type) => (
                  <button
                    key={`B-${type}`}
                    onClick={() => openViolationDialog("B")}
                    className="px-3 py-2 text-sm md:text-base bg-[#f5edc8] text-primary rounded-full hover:bg-[#ebe3b8] transition-colors"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Violation History */}
          <div>
            <h4 className="text-base md:text-lg text-primary mb-3">Riwayat Pelanggaran</h4>
            <div className="space-y-2">
              {violations.map((violation) => (
                <div
                  key={violation.id}
                  className="bg-[#f5edc8] p-3 rounded-lg flex items-center justify-between"
                >
                  <span className="text-primary">
                    <strong>{violation.team === "A" ? team1Display : team2Display}</strong> - {violation.type} ({violation.timestamp})
                  </span>
                </div>
              ))}
              {violations.length === 0 && (
                <p className="text-muted-foreground text-sm">Belum ada pelanggaran tercatat</p>
              )}
            </div>
          </div>
        </div>

        {/* Finish Button */}
        <Button
          onClick={handleFinishMatch}
          className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 gap-2"
        >
          <Check className="w-5 h-5" />
          Selesaikan Pertandingan
        </Button>
      </div>

      {/* Violation Dialog */}
      <Dialog open={showViolationDialog} onOpenChange={setShowViolationDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-primary">Pilih Jenis Pelanggaran</DialogTitle>
            <DialogDescription className="sr-only">Pilih jenis pelanggaran untuk tim</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Tim: {selectedTeam === "A" ? team1Display : team2Display}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {violationTypes.map((type) => (
                <Button
                  key={type}
                  onClick={() => handleAddViolation(type)}
                  variant="outline"
                  className="h-12 rounded-xl"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Finish Match Dialog */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-primary">Selesaikan Pertandingan</DialogTitle>
            <DialogDescription className="sr-only">Konfirmasi untuk menyelesaikan pertandingan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Pertandingan akan diselesaikan dengan skor:
            </p>
            <div className="bg-[#f5edc8] p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-primary font-medium">{team1Display}</span>
                <span className="text-2xl font-bold text-primary">{scoreA}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-primary font-medium">{team2Display}</span>
                <span className="text-2xl font-bold text-primary">{scoreB}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowFinishDialog(false)}
                variant="outline"
                className="flex-1 h-12 rounded-xl"
              >
                Batal
              </Button>
              <Button
                onClick={handleExportData}
                className="flex-1 h-12 rounded-xl bg-secondary hover:bg-secondary/90 gap-2"
              >
                <Download className="w-4 h-4" />
                Ekspor & Selesai
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
        <span className="text-xl">?</span>
      </button>
    </div>
  );
}
