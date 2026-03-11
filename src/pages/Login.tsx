import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"login" | "recovery">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  const switchView = (next: "login" | "recovery") => {
    setTransitioning(true);
    setTimeout(() => {
      setView(next);
      setTimeout(() => setTransitioning(false), 50);
    }, 250);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Completa todos los campos");
      return;
    }
    toast.success("Sesión iniciada correctamente");
    navigate("/");
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      toast.error("Introduce tu correo electrónico");
      return;
    }
    toast.success("Enlace de recuperación enviado a " + recoveryEmail);
    switchView("login");
  };

  return (
    <div
      className="h-screen flex flex-col items-center justify-center px-4 overflow-auto"
      style={{
        background: "linear-gradient(135deg, hsl(168, 62%, 55%), hsl(40, 95%, 62%), hsl(340, 82%, 65%))",
      }}
    >
      <div
        className={`w-full max-w-md transition-all duration-300 ${
          transitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="bg-white rounded-2xl p-8 space-y-6">
          {/* Logo */}
          <div className="text-center space-y-1">
            <h1
              className="text-3xl font-light tracking-wide"
              style={{
                fontFamily: "'Poppins', sans-serif",
                background: "linear-gradient(135deg, hsl(168, 62%, 55%), hsl(40, 95%, 62%), hsl(340, 82%, 65%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Daidalonic <span className="font-semibold">ERP</span>
            </h1>
            <p className="text-sm text-gray-400">
              {view === "login" ? "Inicia sesión en tu cuenta" : "Recupera tu contraseña"}
            </p>
          </div>

          {view === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-600">Usuario o correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@correo.com"
                    className="pl-10 border-gray-200 bg-white focus-visible:ring-[hsl(168,62%,55%)] shadow-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-600">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 border-gray-200 bg-white focus-visible:ring-[hsl(168,62%,55%)] shadow-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-white border-0 shadow-none"
                style={{ backgroundColor: "hsl(168, 62%, 55%)" }}
              >
                Iniciar sesión
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => switchView("recovery")}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRecovery} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-600">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  <Input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="nombre@correo.com"
                    className="pl-10 border-gray-200 bg-white focus-visible:ring-[hsl(168,62%,55%)] shadow-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-white border-0 shadow-none gap-2"
                style={{ backgroundColor: "hsl(168, 62%, 55%)" }}
              >
                <Send className="h-4 w-4" strokeWidth={1.5} />
                Enviar enlace de recuperación
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => switchView("login")}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-white/60 tracking-wide">
        Daidalonic UPV &amp; Sigma Data Club
      </p>
    </div>
  );
};

export default Login;
