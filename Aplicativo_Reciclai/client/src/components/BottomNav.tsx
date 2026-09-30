// Reciclaí — Bottom Navigation Bar
// Neo-Natureza Minimalista: Verde musgo, bordas suaves, ícones amigáveis
import { useLocation } from "wouter";
import { Home, ScanLine, Search, MapPin, User } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/scanner", label: "Scanner", icon: ScanLine },
  { path: "/pesquisa", label: "Pesquisa", icon: Search },
  { path: "/mapa", label: "Mapa", icon: MapPin },
  { path: "/perfil", label: "Perfil", icon: User },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 z-50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location === path;
          const isScanner = path === "/scanner";

          if (isScanner) {
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-0.5 -mt-6 relative"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 eco-pulse ${
                    isActive
                      ? "bg-[#2D6A4F] scale-105"
                      : "bg-[#2D6A4F]"
                  }`}
                >
                  <Icon size={26} className="text-white" />
                </div>
                <span
                  className={`text-[10px] font-semibold mt-1 ${
                    isActive ? "text-[#2D6A4F]" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200"
            >
              <div
                className={`w-6 h-6 flex items-center justify-center transition-all duration-200 ${
                  isActive ? "text-[#2D6A4F]" : "text-gray-400"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors duration-200 ${
                  isActive ? "text-[#2D6A4F]" : "text-gray-400"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#2D6A4F] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
