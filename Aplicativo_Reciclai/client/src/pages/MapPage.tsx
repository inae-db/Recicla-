// Reciclaí — Tela Mapa de Pontos de Reciclagem
// Neo-Natureza Minimalista: mapa com pontos de coleta e filtros
import { useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Phone,
  Star,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { recyclingPoints } from "@/lib/materials";
import { MapView } from "@/components/Map";

const categoryFilters = [
  { label: "Todos", value: "todos", icon: "♻️" },
  { label: "Plástico", value: "plástico", icon: "🔴" },
  { label: "Papel", value: "papel", icon: "🔵" },
  { label: "Vidro", value: "vidro", icon: "🟢" },
  { label: "Metal", value: "metal", icon: "🟡" },
  { label: "Eletrônico", value: "eletrônico", icon: "🟣" },
  { label: "Óleo", value: "óleo", icon: "🟠" },
  { label: "Pilha", value: "pilha", icon: "🔋" },
];

const acceptsColors: Record<string, string> = {
  plástico: "bg-red-100 text-red-700",
  papel: "bg-blue-100 text-blue-700",
  vidro: "bg-green-100 text-green-700",
  metal: "bg-yellow-100 text-yellow-700",
  eletrônico: "bg-purple-100 text-purple-700",
  celular: "bg-purple-100 text-purple-700",
  óleo: "bg-orange-100 text-orange-700",
  pilha: "bg-gray-100 text-gray-700",
  bateria: "bg-gray-100 text-gray-700",
  remédio: "bg-pink-100 text-pink-700",
};

export default function MapPage() {
  const [, navigate] = useLocation();
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [showList, setShowList] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  const filteredPoints = recyclingPoints.filter(
    (p) =>
      selectedFilter === "todos" ||
      p.accepts.some((a) => a.toLowerCase().includes(selectedFilter.toLowerCase()))
  );

  const selectedPointData = selectedPoint !== null
    ? recyclingPoints.find((p) => p.id === selectedPoint)
    : null;

  return (
    <div className="mobile-app bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm flex-shrink-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h1 className="text-gray-900 font-bold text-lg font-['Plus_Jakarta_Sans']">
            Mapa de Reciclagem
          </h1>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
          {categoryFilters.map(({ label, value, icon }) => (
            <button
              key={value}
              onClick={() => setSelectedFilter(value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 font-['Nunito_Sans'] ${
                selectedFilter === value
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1" style={{ minHeight: "280px", maxHeight: "320px" }}>
        <MapView
          onMapReady={(map: google.maps.Map) => {
            setMapReady(true);
            // Add markers for recycling points
            filteredPoints.forEach((point) => {
              const marker = new google.maps.Marker({
                position: { lat: point.lat, lng: point.lng },
                map,
                title: point.name,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "#2D6A4F",
                  fillOpacity: 1,
                  strokeColor: "white",
                  strokeWeight: 2,
                },
              });
              marker.addListener("click", () => {
                setSelectedPoint(point.id);
              });
            });
          }}
        />

        {/* Map overlay - points count */}
        <div className="absolute top-3 right-3 bg-white rounded-xl px-3 py-2 shadow-md">
          <p className="text-[#2D6A4F] font-bold text-sm font-['Plus_Jakarta_Sans']">
            {filteredPoints.length} pontos
          </p>
        </div>
      </div>

      {/* Points list */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 shadow-2xl overflow-hidden flex flex-col">
        {/* Toggle header */}
        <button
          onClick={() => setShowList(!showList)}
          className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-[#2D6A4F]" />
            <p className="text-gray-900 font-bold text-sm font-['Plus_Jakarta_Sans']">
              Pontos de Coleta Próximos
            </p>
          </div>
          {showList ? (
            <ChevronDown size={18} className="text-gray-400" />
          ) : (
            <ChevronUp size={18} className="text-gray-400" />
          )}
        </button>

        {showList && (
          <div className="overflow-y-auto pb-24 flex-1">
            {filteredPoints.map((point) => (
              <button
                key={point.id}
                onClick={() => setSelectedPoint(selectedPoint === point.id ? null : point.id)}
                className={`w-full px-5 py-4 border-b border-gray-50 text-left transition-colors ${
                  selectedPoint === point.id ? "bg-green-50" : "bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2D6A4F]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#2D6A4F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-gray-900 font-bold text-sm font-['Plus_Jakarta_Sans']">
                        {point.name}
                      </p>
                      <span className="text-[#2D6A4F] font-bold text-xs flex-shrink-0 font-['Nunito_Sans']">
                        {point.distance}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 font-['Nunito_Sans']">
                      {point.address}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock size={11} className="text-gray-400" />
                      <p className="text-gray-400 text-xs font-['Nunito_Sans']">{point.hours}</p>
                    </div>

                    {/* Accepts tags */}
                    <div className="flex gap-1.5 flex-wrap mt-2">
                      {point.accepts.map((item) => (
                        <span
                          key={item}
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize font-['Nunito_Sans'] ${
                            acceptsColors[item] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Expanded actions */}
                    {selectedPoint === point.id && (
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 bg-[#2D6A4F] text-white py-2.5 rounded-xl text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5">
                          <Navigation size={14} />
                          Traçar rota
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5">
                          <Phone size={14} />
                          Ligar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {filteredPoints.length === 0 && (
              <div className="text-center py-12 px-5">
                <div className="text-4xl mb-3">📍</div>
                <p className="text-gray-500 font-['Nunito_Sans'] text-sm">
                  Nenhum ponto de coleta encontrado para este filtro
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
