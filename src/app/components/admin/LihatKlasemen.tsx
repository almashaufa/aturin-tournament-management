import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useApp } from "../../context/AppContext";
import { Button } from "../ui/button";

export function LihatKlasemen() {
  const navigate = useNavigate();
  const { teams } = useApp();

  // Sort teams by points (descending), then by wins
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h1 className="text-3xl text-primary font-medium mb-2">Klasemen Turnamen</h1>
          <p className="text-muted-foreground mb-8">Lihat klasemen turnamen bulu tangkis</p>

          {sortedTeams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Belum ada tim terdaftar.</p>
              <Button
                onClick={() => navigate("/admin/tambah-tim")}
                className="bg-secondary hover:bg-secondary/90"
              >
                Tambah Tim
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-primary">Posisi</TableHead>
                    <TableHead className="text-primary">Tim</TableHead>
                    <TableHead className="text-primary text-center">Main</TableHead>
                    <TableHead className="text-primary text-center">Menang</TableHead>
                    <TableHead className="text-primary text-center">Kalah</TableHead>
                    <TableHead className="text-primary text-center">Poin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTeams.map((team, index) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium text-primary">{team.name}</TableCell>
                      <TableCell className="text-center">{team.matches}</TableCell>
                      <TableCell className="text-center">{team.wins}</TableCell>
                      <TableCell className="text-center">{team.losses}</TableCell>
                      <TableCell className="text-center font-medium text-primary">{team.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
        <span className="text-xl font-medium">?</span>
      </button>
    </div>
  );
}
