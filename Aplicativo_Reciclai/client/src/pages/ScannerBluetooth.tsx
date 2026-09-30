import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, AlertCircle, CheckCircle, Loader } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useBluetooth } from "@/contexts/BluetoothContext";
import { materials } from "@/lib/materials";
import { findProductByEAN } from "@/lib/products";
import { Button } from "@/components/ui/button";

export default function ScannerBluetooth() {
  const [, navigate] = useLocation();
  const { status, lastCode, errorMessage } = useBluetooth();
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [manualCode, setManualCode] = useState("");

  // Buscar produto quando código é recebido
  useEffect(() => {
    if (lastCode) {
      searchProduct(lastCode);
    }
  }, [lastCode]);

  const searchProduct = (code: string) => {
    setLoading(true);
    setNotFound(false);
    setCurrentProduct(null);

    // Simular busca no banco de dados
    setTimeout(() => {
      const normalizedCode = code.trim();
      const catalogProduct = findProductByEAN(normalizedCode);
      const product = catalogProduct
        ? {
            id: catalogProduct.ean,
            name: catalogProduct.name,
            category: catalogProduct.category,
            binColor: catalogProduct.bin === "preto" ? "#111827" : "#2FAF4A",
            binLabel: catalogProduct.bin === "preto" ? "Lixeira preta — não reciclável" : catalogProduct.bin,
            disposalSteps: catalogProduct.disposalInstructions,
            decompositionTime: catalogProduct.decompositionTime,
            impact: `Estimativa educativa: ${catalogProduct.environmental.co2Saved} kg de CO₂ evitado, ${catalogProduct.environmental.waterSaved} L de água economizada, ${catalogProduct.environmental.energySaved} kWh de energia poupada e ${catalogProduct.environmental.treesSaved} árvores preservadas.`,
            environmental: catalogProduct.environmental,
          }
        : materials.find(
            (m) =>
              m.id.toLowerCase() === normalizedCode.toLowerCase() ||
              m.name.toLowerCase().includes(normalizedCode.toLowerCase())
          );

      if (product) {
        setCurrentProduct(product);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 500);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      searchProduct(manualCode);
      setManualCode("");
    }
  };

  return (
    <div className="mobile-app bg-[#F5F7F4] min-h-screen flex flex-col pb-20">
      {/* Header */}
      <div
        className="relative pt-6 pb-8 px-5 text-white sticky top-0 z-40"
        style={{
          background: "linear-gradient(135deg, #006633 0%, #2FAF4A 50%, #7ED957 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-lg font-bold font-['Plus_Jakarta_Sans']">Digitar Código</h1>
        </div>

        {/* Bluetooth Status */}
        <div className="flex items-center gap-2 text-sm font-['Nunito_Sans']">
          {status === "connected" && (
            <>
              <CheckCircle size={16} />
              <span>Conectado ao ESP32</span>
            </>
          )}
          {status === "searching" && (
            <>
              <Loader size={16} className="animate-spin" />
              <span>Procurando ESP32...</span>
            </>
          )}
          {status === "disconnected" && (
            <>
              <AlertCircle size={16} />
              <span>Desconectado</span>
            </>
          )}
          {status === "error" && (
            <>
              <AlertCircle size={16} />
              <span>Erro na conexão</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-6">
        {/* Connection Status Card */}
        {status !== "connected" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-yellow-900 font-['Nunito_Sans']">
                  Bluetooth não conectado
                </p>
                <p className="text-sm text-yellow-800 mt-1 font-['Nunito_Sans']">
                  Conecte ao ESP32 para receber códigos automaticamente
                </p>
                <Button
                  onClick={() => navigate("/bluetooth")}
                  className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-['Nunito_Sans']"
                >
                  Ir para Conexão Bluetooth
                </Button>
              </div>
            </div>
          </div>
        )}

        {(status === "disconnected" || status === "error") && errorMessage && (
          <div role="status" aria-live="assertive" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-bold text-red-900 font-['Nunito_Sans']">Conexão com o ESP32 encerrada</p>
                <p className="mt-1 text-sm text-red-800 font-['Nunito_Sans']">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Manual Code Input */}
        <form onSubmit={handleManualSearch} className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2 font-['Nunito_Sans']">
            Digitar código do teclado ou nome do produto:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Ex: 123456 (Caneta)"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-[#2FAF4A] font-['Nunito_Sans']"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#2FAF4A] hover:bg-[#1B7E3A] text-white font-bold rounded-xl font-['Nunito_Sans']"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-12 h-12 text-[#2FAF4A] animate-spin mb-4" />
            <p className="text-gray-600 font-['Nunito_Sans']">Buscando produto...</p>
          </div>
        )}

        {/* Product Not Found */}
        {notFound && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h3 className="font-bold text-red-900 mb-2 font-['Plus_Jakarta_Sans']">
              Produto não encontrado
            </h3>
            <p className="text-sm text-red-800 font-['Nunito_Sans']">
              Verifique o código digitado e tente novamente.
            </p>
          </div>
        )}

        {/* Product Found */}
        {currentProduct && !loading && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
                {currentProduct.name}
              </h2>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase mb-1 font-['Nunito_Sans']">
                  Categoria
                </p>
                <p className="text-gray-900 font-['Nunito_Sans']">{currentProduct.category}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 uppercase mb-1 font-['Nunito_Sans']">
                  Lixeira Correta
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: currentProduct.binColor }}
                  />
                  <span className="text-gray-900 font-['Nunito_Sans']">
                    {currentProduct.binLabel}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 uppercase mb-2 font-['Nunito_Sans']">
                  Passos para Descarte
                </p>
                <ol className="space-y-2">
                  {currentProduct.disposalSteps?.map((step: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-sm font-['Nunito_Sans'] text-gray-700">
                      <span className="font-bold text-[#2FAF4A] flex-shrink-0">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {currentProduct.decompositionTime && (
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1 font-['Nunito_Sans']">
                    Tempo de Decomposição
                  </p>
                  <p className="text-gray-900 font-['Nunito_Sans']">
                    {currentProduct.decompositionTime}
                  </p>
                </div>
              )}

              {currentProduct.impact && (
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1 font-['Nunito_Sans']">
                    Impacto Ambiental
                  </p>
                  <p className="text-gray-900 font-['Nunito_Sans']">{currentProduct.impact}</p>
                </div>
              )}

              {currentProduct.environmental && (
                <div className="grid grid-cols-2 gap-2" aria-label="Indicadores sustentáveis">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-xs font-bold text-blue-800">CO₂ evitado</p>
                    <p className="font-bold text-blue-900">{currentProduct.environmental.co2Saved} kg</p>
                  </div>
                  <div className="rounded-xl bg-cyan-50 p-3">
                    <p className="text-xs font-bold text-cyan-800">Água</p>
                    <p className="font-bold text-cyan-900">{currentProduct.environmental.waterSaved} L</p>
                  </div>
                  <div className="rounded-xl bg-yellow-50 p-3">
                    <p className="text-xs font-bold text-yellow-800">Energia</p>
                    <p className="font-bold text-yellow-900">{currentProduct.environmental.energySaved} kWh</p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-3">
                    <p className="text-xs font-bold text-green-800">Árvores</p>
                    <p className="font-bold text-green-900">{currentProduct.environmental.treesSaved}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              onClick={() => {
                setCurrentProduct(null);
                setNotFound(false);
              }}
              className="w-full mt-6 bg-[#2FAF4A] hover:bg-[#1B7E3A] text-white font-bold py-3 rounded-xl font-['Nunito_Sans']"
            >
              Buscar Outro Produto
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
