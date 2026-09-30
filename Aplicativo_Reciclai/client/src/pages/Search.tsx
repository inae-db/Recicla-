// Reciclaí — Tela de Pesquisa
// Neo-Natureza Minimalista: busca inteligente com sugestões e resultados detalhados
import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, Search as SearchIcon, X, ChevronRight, Filter } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { materials, type Category } from "@/lib/materials";

const suggestions = [
  "garrafa PET",
  "isopor",
  "pilha",
  "caixa de leite",
  "óleo de cozinha",
  "lata de alumínio",
  "vidro",
  "papelão",
  "celular",
  "bateria",
];

const categories: { label: string; value: Category | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Plástico", value: "plástico" },
  { label: "Metal", value: "metal" },
  { label: "Vidro", value: "vidro" },
  { label: "Papel", value: "papel" },
  { label: "Eletrônico", value: "eletrônico" },
  { label: "Orgânico", value: "orgânico" },
  { label: "Especial", value: "especial" },
];

const impactColors = {
  baixo: "bg-green-100 text-green-700",
  médio: "bg-yellow-100 text-yellow-700",
  alto: "bg-orange-100 text-orange-700",
  "muito alto": "bg-red-100 text-red-700",
};

const binColorDot: Record<string, string> = {
  blue: "bg-blue-600",
  red: "bg-red-600",
  green: "bg-green-700",
  yellow: "bg-yellow-500",
  orange: "bg-orange-600",
  brown: "bg-amber-900",
  purple: "bg-purple-700",
  gray: "bg-gray-500",
};

export default function Search() {
  const [, navigate] = useLocation();
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const initialQuery = params.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<Category | "todos">("todos");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMaterials = materials.filter((m) => {
    const matchesQuery =
      query === "" ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      selectedCategory === "todos" || m.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="mobile-app bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h1 className="text-gray-900 font-bold text-lg font-['Plus_Jakarta_Sans']">
            Pesquisar Material
          </h1>
        </div>

        {/* Search input */}
        <div className="relative">
          <SearchIcon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Ex: garrafa PET, pilha, isopor..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none focus:border-[#2D6A4F] focus:bg-white transition-colors font-['Nunito_Sans']"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && query && filteredSuggestions.length > 0 && (
          <div className="absolute left-5 right-5 bg-white rounded-xl shadow-lg border border-gray-100 z-50 mt-1 overflow-hidden">
            {filteredSuggestions.slice(0, 5).map((s) => (
              <button
                key={s}
                onMouseDown={() => {
                  setQuery(s);
                  setShowSuggestions(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-['Nunito_Sans']"
              >
                <SearchIcon size={14} className="text-gray-400" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category filters */}
      <div className="bg-white border-b border-gray-100 px-5 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedCategory(value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 font-['Nunito_Sans'] ${
                selectedCategory === value
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="overflow-y-auto pb-24 px-5 pt-4">
        {/* Quick suggestions when empty */}
        {query === "" && (
          <div className="mb-5">
            <p className="text-gray-500 text-xs font-semibold mb-3 font-['Nunito_Sans'] uppercase tracking-wide">
              Pesquisas populares
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 8).map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full font-['Nunito_Sans'] shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        {query && (
          <p className="text-gray-500 text-xs mb-3 font-['Nunito_Sans']">
            {filteredMaterials.length} resultado(s) para "{query}"
          </p>
        )}

        {/* Material cards */}
        <div className="space-y-3">
          {filteredMaterials.map((material) => (
            <button
              key={material.id}
              onClick={() => navigate(`/material/${material.id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left transition-all duration-200 active:scale-[0.98] fade-slide-up"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-3xl flex-shrink-0">
                  {material.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-gray-900 font-bold text-sm font-['Plus_Jakarta_Sans']">
                      {material.name}
                    </h3>
                    <ChevronRight size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${binColorDot[material.binColor]}`} />
                    <p className="text-gray-500 text-xs font-['Nunito_Sans'] truncate">
                      {material.binLabel}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full font-['Nunito_Sans'] ${
                        material.recyclable
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {material.recyclable ? "✓ Reciclável" : "⚠ Especial"}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full font-['Nunito_Sans'] ${
                        impactColors[material.impactLevel]
                      }`}
                    >
                      Impacto {material.impactLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decomposition time */}
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
                <span className="text-gray-400 text-xs font-['Nunito_Sans']">⏱</span>
                <p className="text-gray-500 text-xs font-['Nunito_Sans']">
                  Decomposição: <span className="font-semibold text-gray-700">{material.decompositionTime}</span>
                </p>
              </div>
            </button>
          ))}

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 font-['Nunito_Sans'] text-sm">
                Nenhum material encontrado para "{query}"
              </p>
              <button
                onClick={() => setQuery("")}
                className="mt-3 text-[#2D6A4F] text-sm font-semibold font-['Nunito_Sans']"
              >
                Limpar pesquisa
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
