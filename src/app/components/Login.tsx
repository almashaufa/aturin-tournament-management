import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/role-selection");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Trophy icons in background - very subtle */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.06]">
        {/* Top Left Trophy */}
        <svg className="absolute top-[8%] left-[8%]" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M30 25 L30 20 L50 20 L50 25 M30 25 C30 35 33 38 40 40 C47 38 50 35 50 25 M37 40 L37 50 L43 50 L43 40 M35 50 L45 50 L45 54 L35 54 Z" stroke="#195083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Right Middle Trophy */}
        <svg className="absolute top-[30%] right-[10%]" width="90" height="90" viewBox="0 0 90 90" fill="none">
          <path d="M32 28 L32 22 L58 22 L58 28 M32 28 C32 40 36 44 45 46 C54 44 58 40 58 28 M41 46 L41 58 L49 58 L49 46 M38 58 L52 58 L52 63 L38 63 Z" stroke="#195083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Bottom Left Trophy */}
        <svg className="absolute bottom-[25%] left-[12%]" width="70" height="70" viewBox="0 0 70 70" fill="none">
          <path d="M26 24 L26 19 L44 19 L44 24 M26 24 C26 33 29 36 35 38 C41 36 44 33 44 24 M32 38 L32 46 L38 46 L38 38 M30 46 L40 46 L40 50 L30 50 Z" stroke="#195083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Bottom Right Trophy */}
        <svg className="absolute bottom-[15%] right-[15%]" width="75" height="75" viewBox="0 0 75 75" fill="none">
          <path d="M28 26 L28 21 L47 21 L47 26 M28 26 C28 35 31 38 37.5 40 C44 38 47 35 47 26 M34 40 L34 49 L41 49 L41 40 M32 49 L43 49 L43 53 L32 53 Z" stroke="#195083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Top Right Trophy */}
        <svg className="absolute top-[18%] right-[20%]" width="85" height="85" viewBox="0 0 85 85" fill="none">
          <path d="M31 27 L31 22 L54 22 L54 27 M31 27 C31 38 34 41 42.5 43 C51 41 54 38 54 27 M39 43 L39 54 L46 54 L46 43 M37 54 L48 54 L48 59 L37 59 Z" stroke="#195083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Left Middle Trophy */}
        <svg className="absolute top-[50%] left-[5%]" width="65" height="65" viewBox="0 0 65 65" fill="none">
          <path d="M24 23 L24 18 L41 18 L41 23 M24 23 C24 31 27 34 32.5 36 C38 34 41 31 41 23 M30 36 L30 44 L35 44 L35 36 M28 44 L37 44 L37 48 L28 48 Z" stroke="#195083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">ATURIN</h1>
            <p className="text-muted-foreground text-xs md:text-sm">Sistem Manajemen Turnamen</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-input-background border-border rounded-xl text-base"
                required
              />
            </div>

            <div className="space-y-2">
             <Label htmlFor="password" className="text-primary text-base">
  Kata Sandi
</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-input-background border-border rounded-xl pr-12 text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-white mt-6"
            >
              Masuk
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Lupa Kata Sandi?
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
        <span className="text-xl font-medium">?</span>
      </button>
    </div>
  );
}
