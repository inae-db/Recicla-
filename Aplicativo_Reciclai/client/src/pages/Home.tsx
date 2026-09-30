// Reciclaí — Tela Home
// Neo-Natureza Minimalista: verde musgo, cards educativos, atalhos rápidos
import { useState } from "react";
import { useLocation } from "wouter";
import {
  Search,
  ScanLine,
  MapPin,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  Leaf,
  Bell,
  Bluetooth,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { materials } from "@/lib/materials";

const motivationalPhrases = [
  "Cada pequena ação conta para um planeta mais verde 🌿",
  "Reciclar é um ato de amor pelo futuro 💚",
  "Você tem o poder de mudar o mundo, um descarte por vez ♻️",
  "A natureza agradece cada escolha consciente sua 🌍",
];

const quickActions = [
  {
    label: "Pesquisar material",
    icon: Search,
    color: "bg-blue-50 text-blue-600",
    iconBg: "bg-blue-100",
    path: "/pesquisa",
  },
  {
    label: "Escanear item",
    icon: ScanLine,
    color: "bg-purple-50 text-purple-600",
    iconBg: "bg-purple-100",
    path: "/scanner",
  },
  {
    label: "Mapa de reciclagem",
    icon: MapPin,
    color: "bg-red-50 text-[#E63946]",
    iconBg: "bg-red-100",
    path: "/mapa",
  },
  {
    label: "Em qual lixo?",
    icon: HelpCircle,
    color: "bg-purple-50 text-purple-600",
    iconBg: "bg-purple-100",
    path: "/qual-lixo",
  },
  {
    label: "Como reciclar?",
    icon: Leaf,
    color: "bg-emerald-50 text-emerald-600",
    iconBg: "bg-emerald-100",
    path: "/educacao",
  },
  {
    label: "Dicas sustentáveis",
    icon: Lightbulb,
    color: "bg-yellow-50 text-yellow-600",
    iconBg: "bg-yellow-100",
    path: "/educacao",
  },
  {
    label: "Digitar código",
    icon: Bluetooth,
    color: "bg-teal-50 text-teal-600",
    iconBg: "bg-teal-100",
    path: "/scanner-ean",
  },
];

const educationalCards = [
  {
    emoji: "🔵",
    title: "Papel e Papelão",
    desc: "Vai na lixeira azul. Deve estar seco e limpo.",
    bg: "from-blue-50 to-blue-100",
    border: "border-blue-200",
  },
  {
    emoji: "🔴",
    title: "Plástico",
    desc: "Lixeira vermelha. Lave antes de descartar.",
    bg: "from-red-50 to-red-100",
    border: "border-red-200",
  },
  {
    emoji: "🟢",
    title: "Vidro",
    desc: "Lixeira verde. Não quebre — pode machucar.",
    bg: "from-green-50 to-green-100",
    border: "border-green-200",
  },
  {
    emoji: "🟡",
    title: "Metal",
    desc: "Lixeira amarela. Amasse latas para economizar espaço.",
    bg: "from-yellow-50 to-yellow-100",
    border: "border-yellow-200",
  },
];

export default function Home() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const phrase = motivationalPhrases[new Date().getDay() % motivationalPhrases.length];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/pesquisa?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const featuredMaterials = materials.slice(0, 4);

  return (
    <div className="mobile-app bg-gray-50 flex flex-col">
      {/* Scrollable content wrapper */}
      <div className="overflow-y-auto pb-24 flex-1">
        {/* Header */}
        <div
          className="relative px-5 pt-12 pb-8 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #006633 0%, #2FAF4A 50%, #7ED957 100%)",
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-white/5" />

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <p className="text-green-100 text-sm font-medium font-['Nunito_Sans']">Olá, bem-vindo! 👋</p>
              <h1 className="text-white text-3xl font-bold font-['Plus_Jakarta_Sans']">
                Recicla<span className="text-[#7ED957]">í</span>
              </h1>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <Bell size={18} className="text-white" />
            </button>
          </div>

          {/* Motivational phrase */}
          <p className="text-green-100 text-sm mb-5 relative z-10 font-['Nunito_Sans'] leading-relaxed">
            {phrase}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative z-10">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquise um material para reciclar..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-gray-700 text-sm shadow-lg outline-none font-['Nunito_Sans'] placeholder:text-gray-400"
              />
            </div>
          </form>
        </div>
        {/* Digitar Código CTA */}
        <div className="px-5 -mt-4 mb-5">
          <button
            onClick={() => navigate("/scanner-bluetooth")}
            className="w-full rounded-2xl p-4 flex items-center gap-4 shadow-lg transition-all duration-200 active:scale-[0.98] fade-slide-up fade-slide-up-1"
            style={{ background: "linear-gradient(135deg, #2FAF4A, #006633)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bluetooth size={24} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="text-white font-bold text-base font-['Plus_Jakarta_Sans']">
                Digitar Código
              </p>
              <p className="text-green-100 text-xs font-['Nunito_Sans']">
                Digite o código do produto via teclado
              </p>
            </div>
            <ChevronRight size={20} className="text-white/70" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-5 mb-6 fade-slide-up fade-slide-up-2">
          <h2 className="text-gray-800 font-bold text-base mb-3 font-['Plus_Jakarta_Sans']">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map(({ label, icon: Icon, color, iconBg, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`${color} rounded-2xl p-3 flex flex-col items-center gap-2 border border-white/50 shadow-sm transition-all duration-200 active:scale-95`}
              >
                <div className={`${iconBg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
                <span className="text-[10px] font-semibold text-center leading-tight font-['Nunito_Sans']">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Educational Cards - Bin Colors */}
        <div className="px-5 mb-6 fade-slide-up fade-slide-up-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-800 font-bold text-base font-['Plus_Jakarta_Sans']">
              Cores das Lixeiras
            </h2>
            <button
              onClick={() => navigate("/educacao")}
              className="text-[#2D6A4F] text-xs font-semibold font-['Nunito_Sans'] flex items-center gap-1"
            >
              Ver tudo <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {educationalCards.map((card) => (
              <div
                key={card.title}
                className={`flex-shrink-0 w-36 rounded-2xl p-3.5 bg-gradient-to-br ${card.bg} border ${card.border}`}
              >
                <span className="text-2xl mb-2 block">{card.emoji}</span>
                <p className="text-gray-800 font-bold text-xs mb-1 font-['Plus_Jakarta_Sans']">
                  {card.title}
                </p>
                <p className="text-gray-600 text-[10px] leading-tight font-['Nunito_Sans']">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Materials */}
        <div className="px-5 mb-6 fade-slide-up fade-slide-up-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-800 font-bold text-base font-['Plus_Jakarta_Sans']">
              Materiais em Destaque
            </h2>
            <button
              onClick={() => navigate("/pesquisa")}
              className="text-[#2D6A4F] text-xs font-semibold font-['Nunito_Sans'] flex items-center gap-1"
            >
              Ver todos <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {featuredMaterials.map((material) => (
              <button
                key={material.id}
                onClick={() => navigate(`/material/${material.id}`)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 transition-all duration-200 active:scale-[0.98] text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {material.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-semibold text-sm font-['Plus_Jakarta_Sans'] truncate">
                    {material.name}
                  </p>
                  <p className="text-gray-500 text-xs font-['Nunito_Sans'] capitalize">
                    {material.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full font-['Nunito_Sans'] ${
                      material.recyclable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {material.recyclable ? "Reciclável" : "Especial"}
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Banner */}
        <div className="px-5 mb-6 fade-slide-up fade-slide-up-5">
          <div className="relative rounded-3xl overflow-hidden h-40">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663670387059/dXLAGAphvpS78habUgFtR5/reciclai-hero-banner-a5bs69YbAwTRKq7Fk4ekMM.webp"
              alt="Reciclaí"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332]/80 to-transparent flex items-center px-5">
              <div>
                <p className="text-white font-bold text-base font-['Plus_Jakarta_Sans'] leading-tight">
                  Juntos por um<br />planeta melhor
                </p>
                <button
                  onClick={() => navigate("/educacao")}
                  className="mt-2 bg-[#F4A261] text-white text-xs font-bold px-4 py-2 rounded-full font-['Nunito_Sans']"
                >
                  Aprender mais
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
