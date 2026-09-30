import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// UUIDs do ESP32
const SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
const CHARACTERISTIC_UUID = 'abcdefab-1234-1234-1234-abcdefabcdef';
const DEVICE_NAME = 'ReciclaiESP32';

export interface BLEContextType {
  isConnected: boolean;
  connectionStatus: string;
  device: BluetoothDevice | null;
  characteristic: BluetoothRemoteGATTCharacteristic | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendData: (data: string) => Promise<void>;
  onDataReceived: (callback: (data: string) => void) => void;
  offDataReceived: (callback: (data: string) => void) => void;
}

const BLEContext = createContext<BLEContextType | undefined>(undefined);

export function BLEProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Desconectado');
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [dataCallbacks, setDataCallbacks] = useState<Set<(data: string) => void>>(new Set());

  // Verificar suporte a Web Bluetooth
  const hasBluetoothSupport = useCallback(() => {
    return 'bluetooth' in navigator;
  }, []);

  // Conectar ao ESP32
  const connect = useCallback(async () => {
    if (!hasBluetoothSupport()) {
      setConnectionStatus('Bluetooth não suportado neste navegador');
      throw new Error('Web Bluetooth API não disponível');
    }

    try {
      setConnectionStatus('Procurando dispositivo...');

      // Solicitar dispositivo Bluetooth
      const selectedDevice = await (navigator as any).bluetooth?.requestDevice({
        filters: [{ name: DEVICE_NAME }],
        optionalServices: [SERVICE_UUID],
      });
      
      if (!selectedDevice) throw new Error('Dispositivo não selecionado');

      setDevice(selectedDevice);
      setConnectionStatus('Conectando...');

      // Conectar ao GATT
      const server = await selectedDevice.gatt?.connect();
      if (!server) throw new Error('Falha ao conectar ao servidor GATT');

      // Obter serviço
      const service = await server.getPrimaryService(SERVICE_UUID);
      setConnectionStatus('Obtendo características...');

      // Obter característica
      const char = await service.getCharacteristic(CHARACTERISTIC_UUID);
      setCharacteristic(char);

      // Escutar por notificações
      if (char.properties.notify) {
        await char.startNotifications();
        char.addEventListener('characteristicvaluechanged', (event: any) => {
          const value = event.target as BluetoothRemoteGATTCharacteristic;
          const decoder = new TextDecoder();
          const data = decoder.decode(value.value);
          
          // Chamar todos os callbacks registrados
          dataCallbacks.forEach((callback: (data: string) => void) => callback(data));
        });
      }

      setIsConnected(true);
      setConnectionStatus('Conectado com sucesso!');

      // Escutar por desconexão
      selectedDevice.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setConnectionStatus('Desconectado');
        setDevice(null);
        setCharacteristic(null);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao conectar';
      setConnectionStatus(`Erro: ${message}`);
      setIsConnected(false);
      throw error;
    }
  }, [hasBluetoothSupport, dataCallbacks]);

  // Desconectar do ESP32
  const disconnect = useCallback(async () => {
    if (device && device.gatt?.connected) {
      await device.gatt.disconnect();
      setIsConnected(false);
      setConnectionStatus('Desconectado');
      setDevice(null);
      setCharacteristic(null);
    }
  }, [device]);

  // Enviar dados para o ESP32
  const sendData = useCallback(
    async (data: string) => {
      if (!characteristic) {
        throw new Error('Não conectado ao ESP32');
      }

      try {
        const encoder = new TextEncoder();
        await characteristic.writeValue(encoder.encode(data));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao enviar dados';
        setConnectionStatus(`Erro ao enviar: ${message}`);
        throw error;
      }
    },
    [characteristic]
  );

  // Registrar callback para dados recebidos
  const onDataReceived = useCallback((callback: (data: string) => void) => {
    setDataCallbacks((prev) => {
      const newSet = new Set(prev);
      newSet.add(callback);
      return newSet;
    });
  }, []);

  // Desregistrar callback
  const offDataReceived = useCallback((callback: (data: string) => void) => {
    setDataCallbacks((prev) => {
      const newSet = new Set(prev);
      newSet.delete(callback);
      return newSet;
    });
  }, []);

  // Tentar reconectar ao carregar
  useEffect(() => {
    // Aqui você poderia implementar reconexão automática
  }, []);

  return (
    <BLEContext.Provider
      value={{
        isConnected,
        connectionStatus,
        device,
        characteristic,
        connect,
        disconnect,
        sendData,
        onDataReceived,
        offDataReceived,
      }}
    >
      {children}
    </BLEContext.Provider>
  );
}

export function useBLE() {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error('useBLE deve ser usado dentro de BLEProvider');
  }
  return context;
}
