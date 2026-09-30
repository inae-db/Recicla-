// Reciclaí — Tela Scanner Inteligente com Acesso Real à Câmera
// Neo-Natureza Minimalista: câmera real com resultado de IA
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Zap,
  RotateCcw,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { materials } from "@/lib/materials";

type ScanState = "idle" | "camera" | "scanning" | "result" | "error";

const scanResults = [
  materials[0], // Garrafa PET
  materials[1], // Lata de alumínio
  materials[3], // Garrafa de vidro
  materials[4], // Pilha
];

const binColorMap: Record<string, string> = {
  blue: "#1565C0",
  red: "#C62828",
  green: "#2E7D32",
  yellow: "#F9A825",
  orange: "#E65100",
  brown: "#4E342E",
  purple: "#6A1B9A",
  gray: "#546E7A",
};

export default function Scanner() {
  const [, navigate] = useLocation();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [result, setResult] = useState<(typeof materials)[0] | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Iniciar câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Câmera traseira em dispositivos móveis
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanState("camera");
      }
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      setScanState("error");
    }
  };

  // Parar câmera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Capturar foto e simular análise
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        // Simular análise com IA
        setScanState("scanning");
        stopCamera();
        
        setTimeout(() => {
          const randomResult = scanResults[Math.floor(Math.random() * scanResults.length)];
          setResult(randomResult);
          setScanState("result");
        }, 2500);
      }
    }
  };

  // Simular scan sem câmera (fallback)
  const handleSimulatedScan = () => {
    setScanState("scanning");
    setTimeout(() => {
      const randomResult = scanResults[Math.floor(Math.random() * scanResults.length)];
      setResult(randomResult);
      setScanState("result");
    }, 2500);
  };

  const handleReset = () => {
    setScanState("idle");
    setResult(null);
    stopCamera();
  };

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="mobile-app bg-gray-900">
      {/* Camera View */}
      <div className="relative overflow-hidden" style={{ minHeight: '100dvh' }}>
        {/* Video stream ou background */}
        {scanState === "camera" ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663670387059/dXLAGAphvpS78habUgFtR5/reciclai-scanner-bg-a9AXyWp965PgTaLXaViEVB.webp"
            alt="Camera view"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Canvas hidden para captura */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-12 pb-4">
          <button
            onClick={() => {
              stopCamera();
              navigate("/");
            }}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="text-center">
            <p className="text-white font-bold text-base font-['Plus_Jakarta_Sans']">
              Scanner Inteligente
            </p>
            <p className="text-green-300 text-xs font-['Nunito_Sans']">
              Aponte para o item
            </p>
          </div>
          <button
            onClick={() => setFlashOn(!flashOn)}
            className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
              flashOn ? "bg-yellow-400" : "bg-white/15"
            }`}
          >
            <Zap size={18} className={flashOn ? "text-black" : "text-white"} />
          </button>
        </div>

        {/* Scanner Frame */}
        {scanState !== "result" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Corner borders */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#52B788] rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#52B788] rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#52B788] rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#52B788] rounded-br-lg" />

              {/* Scan line */}
              {scanState === "scanning" && (
                <div
                  className="absolute left-2 right-2 h-0.5 bg-[#52B788] shadow-lg scan-line"
                  style={{ boxShadow: "0 0 8px #52B788, 0 0 16px #52B788" }}
                />
              )}

              {/* Center text */}
              {scanState === "idle" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/60 text-xs text-center font-['Nunito_Sans']">
                    Toque em "Ativar câmera"
                  </p>
                </div>
              )}

              {scanState === "camera" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[#52B788] text-xs text-center font-['Nunito_Sans']">
                    Enquadre o item
                  </p>
                </div>
              )}

              {scanState === "scanning" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[#52B788] text-xs text-center font-['Nunito_Sans'] animate-pulse">
                    Analisando...
                  </p>
                </div>
              )}

              {scanState === "error" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-red-400 text-xs text-center font-['Nunito_Sans']">
                    Câmera não disponível
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {scanState === "idle" && (
          <div className="absolute bottom-32 left-0 right-0 z-20 flex flex-col items-center gap-4">
            <p className="text-white/70 text-xs font-['Nunito_Sans']">
              Escolha uma opção
            </p>
            <div className="flex gap-3">
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-6 py-3 bg-[#2D6A4F] text-white rounded-full font-bold text-sm font-['Plus_Jakarta_Sans'] shadow-lg transition-all duration-200 active:scale-95"
              >
                <Camera size={16} />
                Ativar câmera
              </button>
              <button
                onClick={handleSimulatedScan}
                className="flex items-center gap-2 px-6 py-3 bg-[#52B788] text-white rounded-full font-bold text-sm font-['Plus_Jakarta_Sans'] shadow-lg transition-all duration-200 active:scale-95"
              >
                Simular scan
              </button>
            </div>
          </div>
        )}

        {/* Capture Button */}
        {scanState === "camera" && (
          <div className="absolute bottom-32 left-0 right-0 z-20 flex flex-col items-center gap-4">
            <p className="text-white/70 text-xs font-['Nunito_Sans']">
              Toque para capturar
            </p>
            <button
              onClick={handleCapture}
              className="w-20 h-20 rounded-full bg-[#2D6A4F] border-4 border-white flex items-center justify-center shadow-2xl eco-pulse transition-all duration-200 active:scale-95"
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#2D6A4F]" />
              </div>
            </button>
          </div>
        )}

        {/* Scanning indicator */}
        {scanState === "scanning" && (
          <div className="absolute bottom-32 left-0 right-0 z-20 flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#52B788] animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <p className="text-white text-sm font-['Nunito_Sans']">
              IA identificando material...
            </p>
          </div>
        )}

        {/* Result Panel */}
        {scanState === "result" && result && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-2xl max-h-[75vh] overflow-y-auto">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="px-5 pb-6">
              {/* IA Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#2D6A4F] text-white text-xs font-bold px-3 py-1 rounded-full font-['Nunito_Sans']">
                  ✨ IA Identificou
                </div>
                <span className="text-gray-400 text-xs font-['Nunito_Sans']">98% de confiança</span>
              </div>

              {/* Material info */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-4xl">
                  {result.icon}
                </div>
                <div>
                  <h2 className="text-gray-900 font-bold text-xl font-['Plus_Jakarta_Sans']">
                    {result.name}
                  </h2>
                  <p className="text-gray-500 text-sm capitalize font-['Nunito_Sans']">
                    {result.category}
                  </p>
                </div>
              </div>

              {/* Recyclable status */}
              <div
                className={`flex items-center gap-3 p-4 rounded-2xl mb-4 ${
                  result.recyclable
                    ? "bg-green-50 border border-green-200"
                    : "bg-orange-50 border border-orange-200"
                }`}
              >
                {result.recyclable ? (
                  <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle size={24} className="text-orange-500 flex-shrink-0" />
                )}
                <div>
                  <p className={`font-bold text-sm font-['Plus_Jakarta_Sans'] ${result.recyclable ? "text-green-700" : "text-orange-700"}`}>
                    {result.recyclable ? "Material Reciclável" : "Descarte Especial"}
                  </p>
                  <p className={`text-xs font-['Nunito_Sans'] ${result.recyclable ? "text-green-600" : "text-orange-600"}`}>
                    {result.recyclable ? "Pode ser reciclado na coleta seletiva" : result.specialDisposal}
                  </p>
                </div>
              </div>

              {/* Bin Color */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                  style={{ backgroundColor: binColorMap[result.binColor] }}
                >
                  🗑️
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-['Nunito_Sans']">Descarte em</p>
                  <p className="text-gray-900 font-bold text-sm font-['Plus_Jakarta_Sans']">
                    {result.binLabel}
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="mb-5">
                <p className="text-gray-700 font-bold text-sm mb-3 font-['Plus_Jakarta_Sans']">
                  Como preparar:
                </p>
                <div className="space-y-2">
                  {result.steps.slice(0, 3).map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">
                        {i + 1}
                      </div>
                      <p className="text-gray-600 text-sm font-['Nunito_Sans'] leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-5">
                  {result.warnings.map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <XCircle size={14} className="text-red-500 flex-shrink-0" />
                      <p className="text-red-700 text-xs font-['Nunito_Sans']">{w}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/mapa")}
                  className="flex-1 bg-[#2D6A4F] text-white py-3.5 rounded-2xl font-bold text-sm font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-2"
                >
                  <MapPin size={16} />
                  Encontrar ponto de coleta
                </button>
                <button
                  onClick={handleReset}
                  className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0"
                >
                  <RotateCcw size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
