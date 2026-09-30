import { useEffect } from "react";
import { useLocation } from "wouter";
import { Bluetooth, AlertCircle, CheckCircle, Loader } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { ESP32_BLUETOOTH_CONFIG, useBluetooth } from "@/contexts/BluetoothContext";
import { Button } from "@/components/ui/button";

export default function BluetoothConnection() {
  const [, navigate] = useLocation();
  const { status, errorMessage, connect, disconnect } = useBluetooth();

  const statusMessages = {
    disconnected: "Desconectado do ESP32",
    searching: "Procurando dispositivo ESP32...",
    connected: "Conectado ao ESP32",
    error: "Erro na conexão",
  };

  const statusColors = {
    disconnected: "text-gray-600",
    searching: "text-yellow-600",
    connected: "text-green-600",
    error: "text-red-600",
  };

  const statusBgColors = {
    disconnected: "bg-gray-50",
    searching: "bg-yellow-50",
    connected: "bg-green-50",
    error: "bg-red-50",
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-['Nunito_Sans'] opacity-90">Conexão Bluetooth</p>
            <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] mt-1">
              Recicl<span className="text-[#7ED957]">a</span>í
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-8">
        {/* Status Card */}
        <div className={`rounded-2xl p-6 mb-6 ${statusBgColors[status]}`}>
          <div className="flex items-center gap-4 mb-4">
            {status === "searching" && (
              <Loader className={`w-8 h-8 ${statusColors[status]} animate-spin`} />
            )}
            {status === "connected" && (
              <CheckCircle className={`w-8 h-8 ${statusColors[status]}`} />
            )}
            {status === "error" && (
              <AlertCircle className={`w-8 h-8 ${statusColors[status]}`} />
            )}
            {status === "disconnected" && (
              <Bluetooth className={`w-8 h-8 ${statusColors[status]}`} />
            )}
            <div>
              <p className={`font-bold text-lg ${statusColors[status]} font-['Plus_Jakarta_Sans']`}>
                {statusMessages[status]}
              </p>
              {errorMessage && (
                <p className="text-sm text-gray-600 mt-1 font-['Nunito_Sans']">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Connection Info */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans'] mb-4 text-gray-900">
            Sobre a Conexão
          </h2>
          <div className="space-y-3 text-sm font-['Nunito_Sans'] text-gray-700">
            <p>
              <strong>Dispositivo:</strong> {ESP32_BLUETOOTH_CONFIG.deviceName}
            </p>
            <p>
              <strong>Serviço:</strong> <code className="break-all text-xs">{ESP32_BLUETOOTH_CONFIG.serviceUuid}</code>
            </p>
            <p>
              <strong>Característica:</strong> <code className="break-all text-xs">{ESP32_BLUETOOTH_CONFIG.characteristicUuid}</code>
            </p>
            <p>
              <strong>Função:</strong> Receber códigos de produtos digitados no teclado
            </p>
            <p>
              <strong>Status:</strong> {statusMessages[status]}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-200">
          <h3 className="font-bold font-['Plus_Jakarta_Sans'] text-gray-900 mb-3">
            Como usar:
          </h3>
          <ol className="space-y-2 text-sm font-['Nunito_Sans'] text-gray-700">
            <li>1. Clique em "Conectar ao ESP32"</li>
            <li>2. Selecione o dispositivo ESP32 na lista</li>
            <li>3. Digite o código do produto no teclado matricial</li>
            <li>4. O código será recebido automaticamente</li>
            <li>5. As informações do produto aparecerão na tela</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {status === "disconnected" || status === "error" ? (
            <Button
              onClick={connect}
              className="w-full bg-[#2FAF4A] hover:bg-[#1B7E3A] text-white font-bold py-3 rounded-xl font-['Nunito_Sans']"
            >
              <Bluetooth className="w-5 h-5 mr-2" />
              Conectar ao ESP32
            </Button>
          ) : (
            <Button
              onClick={disconnect}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl font-['Nunito_Sans']"
            >
              Desconectar
            </Button>
          )}

          <Button
            onClick={() => navigate("/")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-xl font-['Nunito_Sans']"
          >
            Voltar para Home
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
