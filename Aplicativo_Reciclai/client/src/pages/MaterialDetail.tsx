// Reciclaí — Tela de Detalhe do Material
// Neo-Natureza Minimalista: informações completas sobre o material
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Share2,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { materials } from "@/lib/materials";

const binColorMap: Record<string, { bg: string; text: string; label: string }> = {
  blue: { bg: "#1565C0", text: "white", label: "Azul" },
  red: { bg: "#C62828", text: "white", label: "Vermelha" },
  green: { bg: "#2E7D32", text: "white", label: "Verde" },
  yellow: { bg: "#F9A825", text: "#1a1a1a", label: "Amarela" },
  orange: { bg: "#E65100", text: "white", label: "Laranja" },
  brown: { bg: "#4E342E", text: "white", label: "Marrom" },
  purple: { bg: "#6A1B9A", text: "white", label: "Roxa" },
  gray: { bg: "#546E7A", text: "white", label: "Cinza" },
};

const impactColors = {
  baixo: { bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500", width: "w-1/5" },
  médio: { bg: "bg-yellow-100", text: "text-yellow-700", bar: "bg-yellow-500", width: "w-2/5" },
  alto: { bg: "bg-orange-100", text: "text-orange-700", bar: "bg-orange-500", width: "w-3/5" },
  "muito alto": { bg: "bg-red-100", text: "text-red-700", bar: "bg-red-500", width: "w-full" },
};

const categoryIcons: Record<string, string> = {
  plástico: "🔴",
  metal: "🟡",
  vidro: "🟢",
  papel: "🔵",
  eletrônico: "🟣",
  orgânico: "🟤",
  rejeito: "⚫",
  especial: "🟠",
};

export default function MaterialDetail() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const material = materials.find((m) => m.id === params.id);

  if (!material) {
    return (
      <div className="mobile-app flex items-center justify-center">
        <div className="text-center px-8">
          <div className="text-6xl mb-4">🤔</div>
          <p className="text-gray-600 font-['Nunito_Sans'] mb-4">Material não encontrado</p>
          <button
            onClick={() => navigate("/pesquisa")}
            className="bg-[#2D6A4F] text-white px-6 py-3 rounded-2xl font-bold font-['Plus_Jakarta_Sans']"
          >
            Pesquisar materiais
          </button>
        </div>
      </div>
    );
  }

  const binInfo = binColorMap[material.binColor];
  const impact = impactColors[material.impactLevel];

  return (
    <div className="mobile-app bg-gray-50">
      {/* Header with gradient */}
      <div
        className="relative px-5 pt-12 pb-8"
        style={{
          background: `linear-gradient(135deg, ${binInfo.bg}22 0%, ${binInfo.bg}11 100%)`,
          borderBottom: `3px solid ${binInfo.bg}33`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1 as any)}
            className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
            <Share2 size={16} className="text-gray-700" />
          </button>
        </div>

        {/* Material hero */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-md flex items-center justify-center text-5xl">
            {material.icon}
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-2xl font-['Plus_Jakarta_Sans'] leading-tight">
              {material.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg">{categoryIcons[material.category]}</span>
              <span className="text-gray-600 text-sm capitalize font-['Nunito_Sans']">
                {material.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto pb-24 px-5 pt-5 space-y-4">
        {/* Recyclable status */}
        <div
          className={`rounded-2xl p-4 flex items-center gap-4 ${
            material.recyclable
              ? "bg-green-50 border border-green-200"
              : "bg-orange-50 border border-orange-200"
          }`}
        >
          {material.recyclable ? (
            <CheckCircle size={28} className="text-green-600 flex-shrink-0" />
          ) : (
            <AlertTriangle size={28} className="text-orange-500 flex-shrink-0" />
          )}
          <div>
            <p className={`font-bold text-base font-['Plus_Jakarta_Sans'] ${material.recyclable ? "text-green-700" : "text-orange-700"}`}>
              {material.recyclable ? "Material Reciclável" : "Descarte Especial Necessário"}
            </p>
            {material.specialDisposal && (
              <p className="text-orange-600 text-xs mt-0.5 font-['Nunito_Sans']">
                {material.specialDisposal}
              </p>
            )}
          </div>
        </div>

        {/* Bin color */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3 font-['Nunito_Sans']">
            Lixeira Correta
          </p>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
              style={{ backgroundColor: binInfo.bg }}
            >
              🗑️
            </div>
            <div>
              <p className="text-gray-900 font-bold text-base font-['Plus_Jakarta_Sans']">
                {material.binLabel}
              </p>
              <p className="text-gray-500 text-xs font-['Nunito_Sans'] mt-0.5">
                Cor da lixeira: <span className="font-semibold">{binInfo.label}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-4 font-['Nunito_Sans']">
            Como preparar para o descarte
          </p>
          <div className="space-y-3">
            {material.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white text-xs flex items-center justify-center flex-shrink-0 font-bold font-['Plus_Jakarta_Sans']">
                  {i + 1}
                </div>
                <p className="text-gray-700 text-sm font-['Nunito_Sans'] leading-relaxed pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {material.warnings.length > 0 && (
          <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
            <p className="text-red-700 font-bold text-sm mb-3 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <XCircle size={16} />
              Atenção
            </p>
            <div className="space-y-2">
              {material.warnings.map((w, i) => (
                <p key={i} className="text-red-600 text-sm font-['Nunito_Sans'] flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  {w}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Decomposition time */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-gray-400" />
              <p className="text-gray-500 text-xs font-['Nunito_Sans']">Decomposição</p>
            </div>
            <p className="text-gray-900 font-bold text-sm font-['Plus_Jakarta_Sans'] leading-tight">
              {material.decompositionTime}
            </p>
          </div>

          {/* Impact level */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-['Nunito_Sans'] mb-2">Impacto ambiental</p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full ${impact.bg} ${impact.text} text-xs font-bold font-['Nunito_Sans'] capitalize mb-2`}>
              {material.impactLevel}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className={`${impact.bar} h-1.5 rounded-full`} style={{ width: `${material.impactScore * 20}%` }} />
            </div>
          </div>
        </div>

        {/* Curiosities */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3 font-['Nunito_Sans'] flex items-center gap-2">
            <Lightbulb size={14} className="text-yellow-500" />
            Curiosidades Ambientais
          </p>
          <div className="space-y-3">
            {material.curiosities.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                <span className="text-yellow-500 text-sm">💡</span>
                <p className="text-gray-700 text-sm font-['Nunito_Sans'] leading-relaxed">
                  {c}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/mapa")}
          className="w-full bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold text-base font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all duration-200"
        >
          <MapPin size={20} />
          Encontrar ponto de descarte
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
