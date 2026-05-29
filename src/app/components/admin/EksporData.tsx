import { useNavigate } from "react-router";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";

export function EksporData() {
  const navigate = useNavigate();
  const { matches, getTeamById } = useApp();

  const finishedMatches = matches.filter(m => m.status === "Selesai");

  const handleExportCSV = () => {
    if (finishedMatches.length === 0) {
      toast.error("Belum ada pertandingan yang selesai untuk diekspor");
      return;
    }

    const csvHeader = "Kode Pertandingan,Tim 1,Tim 2,Skor Tim 1,Skor Tim 2,Pelanggaran\n";
    const csvRows = finishedMatches.map(match => {
      const team1 = getTeamById(match.team1Id);
      const team2 = getTeamById(match.team2Id);
      const violationText = match.violations?.map(v => {
        const team = getTeamById(v.teamId);
        return `${team?.name} - ${v.type} (${v.timestamp})`;
      }).join("; ") || "-";

      return `${match.code},${team1?.name},${team2?.name},${match.scoreTeam1},${match.scoreTeam2},"${violationText}"`;
    }).join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data-pertandingan.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Data berhasil diekspor ke CSV");
  };

  const handleExportExcel = () => {
    if (finishedMatches.length === 0) {
      toast.error("Belum ada pertandingan yang selesai untuk diekspor");
      return;
    }

    const excelHeader = "Kode Pertandingan\tTim 1\tTim 2\tSkor Tim 1\tSkor Tim 2\tPelanggaran\n";
    const excelRows = finishedMatches.map(match => {
      const team1 = getTeamById(match.team1Id);
      const team2 = getTeamById(match.team2Id);
      const violationText = match.violations?.map(v => {
        const team = getTeamById(v.teamId);
        return `${team?.name} - ${v.type} (${v.timestamp})`;
      }).join("; ") || "-";

      return `${match.code}\t${team1?.name}\t${team2?.name}\t${match.scoreTeam1}\t${match.scoreTeam2}\t${violationText}`;
    }).join("\n");

    const excelContent = excelHeader + excelRows;
    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data-pertandingan.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Data berhasil diekspor ke Excel");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
          <h1 className="text-3xl text-primary font-medium mb-2">Ekspor Data</h1>
          <p className="text-muted-foreground mb-8">Ekspor data turnamen ke file</p>

          <div className="space-y-4">
            <div className="bg-[#f5edc8] rounded-xl p-6">
              <h3 className="text-primary font-medium mb-2">Preview Data</h3>
              <p className="text-sm text-muted-foreground">
                Data yang akan diekspor berisi:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>Kode Pertandingan</li>
                <li>Tim/Pemain yang bermain</li>
                <li>Skor pertandingan</li>
                <li>Pelanggaran yang terjadi</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={handleExportCSV}
                className="h-14 rounded-xl bg-primary hover:bg-primary/90 gap-2"
              >
                <Download className="w-5 h-5" />
                Ekspor ke CSV
              </Button>

              <Button
                onClick={handleExportExcel}
                className="h-14 rounded-xl bg-secondary hover:bg-secondary/90 gap-2"
              >
                <FileText className="w-5 h-5" />
                Ekspor ke Excel
              </Button>
            </div>

            {finishedMatches.length > 0 && (
              <div className="bg-[#e8f0f7] rounded-xl p-6 mt-6">
                <h3 className="text-primary font-medium mb-3">Preview Data ({finishedMatches.length} Pertandingan Selesai)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-primary/20">
                        <th className="text-left p-2 text-primary">Kode</th>
                        <th className="text-left p-2 text-primary">Tim 1</th>
                        <th className="text-left p-2 text-primary">Tim 2</th>
                        <th className="text-center p-2 text-primary">Skor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finishedMatches.slice(0, 5).map((match, idx) => {
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

                        return (
                          <tr key={idx} className="border-b border-primary/10">
                            <td className="p-2">{match.code}</td>
                            <td className="p-2">{team1Display}</td>
                            <td className="p-2">{team2Display}</td>
                            <td className="p-2 text-center">{match.scoreTeam1} - {match.scoreTeam2}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {finishedMatches.length > 5 && (
                    <p className="text-xs text-muted-foreground mt-2">Dan {finishedMatches.length - 5} pertandingan lainnya...</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
        <span className="text-xl font-medium">?</span>
      </button>
    </div>
  );
}
