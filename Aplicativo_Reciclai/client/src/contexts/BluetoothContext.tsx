import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";

export type BluetoothStatus = "disconnected" | "searching" | "connected" | "error";

interface BluetoothContextType {
  status: BluetoothStatus;
  device: BluetoothDevice | null;
  characteristic: BluetoothRemoteGATTCharacteristic | null;
  lastCode: string | null;
  errorMessage: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendData: (data: string) => Promise<void>;
}

export const ESP32_BLUETOOTH_CONFIG = {
  deviceName: "ReciclaiESP32",
  serviceUuid: "12345678-1234-1234-1234-123456789abc",
  characteristicUuid: "abcdefab-1234-1234-1234-abcdefabcdef",
};

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

function normalizeIncomingCode(rawValue: string): string | null {
  const trimmed = rawValue.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed) as { code?: unknown; codigo?: unknown; ean?: unknown };
    const jsonCode = parsed.code ?? parsed.codigo ?? parsed.ean;
    if (typeof jsonCode === "string") {
      const digits = jsonCode.replace(/\D/g, "");
      return /^\d{6,13}$/.test(digits) ? digits : null;
    }
  } catch {
    // O firmware normalmente envia texto simples; JSON é aceito como fallback.
  }

  const digits = trimmed.replace(/\D/g, "");
  return /^\d{6,13}$/.test(digits) ? digits : null;
}

export function BluetoothProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<BluetoothStatus>("disconnected");
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const deviceRef = useRef<BluetoothDevice | null>(null);

  const handleDisconnected = useCallback(() => {
    characteristicRef.current = null;
    setCharacteristic(null);
    setDevice(null);
    setStatus("disconnected");
    setErrorMessage("ESP32 desconectado. Verifique a alimentação e conecte novamente.");
  }, []);

  const handleCharacteristicValueChanged = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    if (!target?.value) return;

    const decoded = new TextDecoder().decode(target.value);
    const code = normalizeIncomingCode(decoded);
    if (code) setLastCode(code);
  }, []);

  useEffect(() => {
    if (!("bluetooth" in navigator)) {
      setErrorMessage("Bluetooth não é suportado neste navegador.");
      setStatus("error");
    }

    return () => {
      const currentDevice = deviceRef.current;
      if (currentDevice) currentDevice.removeEventListener("gattserverdisconnected", handleDisconnected);
      const currentCharacteristic = characteristicRef.current;
      if (currentCharacteristic) {
        currentCharacteristic.removeEventListener("characteristicvaluechanged", handleCharacteristicValueChanged);
      }
    };
  }, [handleCharacteristicValueChanged, handleDisconnected]);

  const connect = async () => {
    try {
      setStatus("searching");
      setErrorMessage(null);

      const bluetooth = navigator.bluetooth;
      if (!bluetooth) throw new Error("Bluetooth não é suportado neste navegador.");

      const selectedDevice = await bluetooth.requestDevice({
        filters: [
          { name: ESP32_BLUETOOTH_CONFIG.deviceName },
          { name: "ESP32" },
          { name: "Reciclaí" },
          { services: [ESP32_BLUETOOTH_CONFIG.serviceUuid] },
        ],
        optionalServices: [ESP32_BLUETOOTH_CONFIG.serviceUuid],
      });

      selectedDevice.addEventListener("gattserverdisconnected", handleDisconnected);
      const gatt = await selectedDevice.gatt?.connect();
      if (!gatt) throw new Error("Falha ao conectar ao servidor GATT do ESP32.");

      const service = await gatt.getPrimaryService(ESP32_BLUETOOTH_CONFIG.serviceUuid);
      const nextCharacteristic = await service.getCharacteristic(ESP32_BLUETOOTH_CONFIG.characteristicUuid);
      if (!nextCharacteristic.properties.notify) {
        throw new Error("A característica do ESP32 não oferece notificações.");
      }

      await nextCharacteristic.startNotifications();
      nextCharacteristic.addEventListener("characteristicvaluechanged", handleCharacteristicValueChanged);

      deviceRef.current = selectedDevice;
      characteristicRef.current = nextCharacteristic;
      setDevice(selectedDevice);
      setCharacteristic(nextCharacteristic);
      setStatus("connected");
    } catch (error) {
      const bluetoothError = error as DOMException;
      if (bluetoothError.name === "NotFoundError") {
        setStatus("disconnected");
        setErrorMessage(null);
        return;
      }

      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Erro ao conectar ao Bluetooth.");
    }
  };

  const disconnect = async () => {
    const currentCharacteristic = characteristicRef.current;
    const currentDevice = deviceRef.current;

    try {
      if (currentCharacteristic) {
        currentCharacteristic.removeEventListener("characteristicvaluechanged", handleCharacteristicValueChanged);
        if (currentCharacteristic.properties.notify) await currentCharacteristic.stopNotifications();
      }
      if (currentDevice) {
        currentDevice.removeEventListener("gattserverdisconnected", handleDisconnected);
        if (currentDevice.gatt?.connected) currentDevice.gatt.disconnect();
      }
    } finally {
      characteristicRef.current = null;
      deviceRef.current = null;
      setCharacteristic(null);
      setDevice(null);
      setStatus("disconnected");
      setErrorMessage("ESP32 desconectado.");
    }
  };

  const sendData = async (data: string) => {
    try {
      if (!characteristicRef.current) throw new Error("ESP32 não está conectado.");
      await characteristicRef.current.writeValue(new TextEncoder().encode(data));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao enviar dados.");
      throw error;
    }
  };

  return (
    <BluetoothContext.Provider value={{ status, device, characteristic, lastCode, errorMessage, connect, disconnect, sendData }}>
      {children}
    </BluetoothContext.Provider>
  );
}

export function useBluetooth() {
  const context = useContext(BluetoothContext);
  if (!context) throw new Error("useBluetooth deve ser usado dentro de BluetoothProvider");
  return context;
}
