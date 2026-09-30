// Reciclaí — Tela "Em qual lixo jogar?"
// Neo-Natureza Minimalista: resposta rápida e visual com cores das lixeiras
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, RotateCcw } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { quickBinAnswers, type BinColor } from "@/lib/materials";

const binColorStyles: Record<BinColor, { bg: string; text: string; border: string; emoji: string; label: string; description: string }> = {
  blue: {
    bg: "bg-blue-600",
    text: "text-white",
    border: "border-blue-700",
    emoji: "🔵",
    label: "Lixeira Azul",
    description: "Papel e Papelão",
  },
  red: {
    bg: "bg-red-600",
    text: "text-white",
    border: "border-red-700",
    emoji: "🔴",
    label: "Lixeira Vermelha",
    description: "Plástico e Isopor",
  },
  green: {
    bg: "bg-green-700",
    text: "text-white",
    border: "border-green-800",
    emoji: "🟢",
    label: "Lixeira Verde",
    description: "Vidro",
  },
  yellow: {
    bg: "bg-yellow-400",
    text: "text-gray-900",
    border: "border-yellow-500",
    emoji: "🟡",
    label: "Lixeira Amarela",
    description: "Metal",
  },
  orange: {
    bg: "bg-orange-600",
    text: "text-white",
    border: "border-orange-700",
    emoji: "🟠",
    label: "Lixeira Laranja",
    description: "Perigoso ou Contaminados",
  },
  brown: {
    bg: "bg-amber-800",
    text: "text-white",
    border: "border-amber-900",
    emoji: "🟤",
    label: "Lixeira Marrom",
    description: "Orgânicos",
  },
  purple: {
    bg: "bg-purple-700",
    text: "text-white",
    border: "border-purple-800",
    emoji: "🟣",
    label: "Lixeira Roxa",
    description: "Radioativos",
  },
  gray: {
    bg: "bg-gray-500",
    text: "text-white",
    border: "border-gray-600",
    emoji: "⚫",
    label: "Lixeira Preta",
    description: "Não-Recicláveis ou Misturados",
  },
};

const quickSuggestions = [
  "garrafa pet",
  "lata",
  "papel",
  "vidro",
  "pilha",
  "celular",
  "óleo",
  "comida",
  "papelão",
  "isopor",
  "bateria",
  "plástico",
];

type AnswerState = {
  bin: string;
  color: BinColor;
  label: string;
} | null;

export default function QuickBin() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<AnswerState>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (searchQuery: string) => {
    const q = searchQuery.toLowerCase().trim();
    setQuery(searchQuery);
    setNotFound(false);
    setAnswer(null);

    if (!q) return;

    // Find matching answer
    const found = Object.entries(quickBinAnswers).find(([key]) =>
      q.includes(key) || key.includes(q)
    );

    if (found) {
      setAnswer(found[1]);
    } else {
      setNotFound(true);
    }
  };

  const handleReset = () => {
    setQuery("");
    setAnswer(null);
    setNotFound(false);
  };

  return (
    <div className="mobile-app bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-gray-900 font-bold text-lg font-['Plus_Jakarta_Sans']">
              Em qual lixo jogar?
            </h1>
            <p className="text-gray-500 text-xs font-['Nunito_Sans']">
              Resposta rápida e visual
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Digite o item (ex: garrafa, pilha...)"
            className="w-full pl-11 pr-10 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none focus:border-[#2D6A4F] focus:bg-white transition-all font-['Nunito_Sans'] text-base"
          />
          {query && (
            <button
              onClick={handleReset}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <RotateCcw size={16} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto pb-24 px-5 pt-5">
        {/* Answer */}
        {answer && (
          <div className="mb-6 fade-slide-up">
            {/* Big bin display */}
            <div
              className={`${binColorStyles[answer.color].bg} rounded-3xl p-8 text-center shadow-xl mb-4`}
            >
              <div className="text-7xl mb-4">🗑️</div>
              <p className={`text-3xl font-black font-['Plus_Jakarta_Sans'] ${binColorStyles[answer.color].text} mb-1`}>
                {answer.bin}
              </p>
              <p className={`text-base font-['Nunito_Sans'] ${binColorStyles[answer.color].text} opacity-80`}>
                {binColorStyles[answer.color].description}
              </p>
            </div>

            {/* Item label */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500 text-xs font-['Nunito_Sans'] mb-1">
                Você pesquisou:
              </p>
              <p className="text-gray-900 font-bold text-lg font-['Plus_Jakarta_Sans'] capitalize">
                {query}
              </p>
              <div className="mt-2 inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                <span className="text-lg">{binColorStyles[answer.color].emoji}</span>
                <span className="text-gray-700 text-sm font-semibold font-['Nunito_Sans']">
                  {answer.label}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate(`/pesquisa?q=${encodeURIComponent(query)}`)}
                className="flex-1 bg-[#2D6A4F] text-white py-3.5 rounded-2xl font-bold text-sm font-['Plus_Jakarta_Sans']"
              >
                Ver detalhes completos
              </button>
              <button
                onClick={handleReset}
                className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0"
              >
                <RotateCcw size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* Not found */}
        {notFound && query && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center mb-6 fade-slide-up">
            <div className="text-4xl mb-3">🤔</div>
            <p className="text-gray-700 font-bold text-base font-['Plus_Jakarta_Sans'] mb-2">
              Não encontrei "{query}"
            </p>
            <p className="text-gray-500 text-sm font-['Nunito_Sans'] mb-4">
              Tente pesquisar de outra forma ou use o scanner para identificar o item
            </p>
            <button
              onClick={() => navigate("/scanner")}
              className="bg-[#F4A261] text-white px-6 py-3 rounded-2xl font-bold text-sm font-['Plus_Jakarta_Sans']"
            >
              Usar Scanner IA
            </button>
          </div>
        )}

        {/* Quick suggestions */}
        {!answer && !notFound && (
          <>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3 font-['Nunito_Sans']">
              Itens comuns
            </p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {quickSuggestions.map((item) => {
                const ans = quickBinAnswers[item];
                if (!ans) return null;
                const style = binColorStyles[ans.color];
                return (
                  <button
                    key={item}
                    onClick={() => handleSearch(item)}
                    className={`${style.bg} rounded-2xl p-3 text-center shadow-sm active:scale-95 transition-all duration-200`}
                  >
                    <div className="text-2xl mb-1">🗑️</div>
                    <p className={`text-xs font-bold capitalize font-['Nunito_Sans'] ${style.text}`}>
                      {item}
                    </p>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Bin color guide */}
        {!answer && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-gray-700 font-bold text-sm mb-4 font-['Plus_Jakarta_Sans']">
              Guia de cores das lixeiras
            </p>
            <div className="space-y-2">
              {(Object.entries(binColorStyles) as [BinColor, typeof binColorStyles[BinColor]][]).map(([color, style]) => (
                <div key={color} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center text-sm`}>
                    🗑️
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold text-sm font-['Plus_Jakarta_Sans']">
                      {style.label}
                    </p>
                    <p className="text-gray-400 text-xs font-['Nunito_Sans']">
                      {style.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
