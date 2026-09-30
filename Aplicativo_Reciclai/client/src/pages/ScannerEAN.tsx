import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBluetooth } from '@/contexts/BluetoothContext';
import { findProductByEAN, Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';
import { Check, AlertCircle, Bluetooth, BluetoothOff } from 'lucide-react';
import { toast } from 'sonner';

const isSupportedProductCode = (value: string) => /^\d{6,13}$/.test(value.trim());

const binColors: Record<string, { bg: string; text: string; label: string }> = {
  azul: { bg: 'bg-blue-500', text: 'text-blue-700', label: 'Papel e Papelão' },
  vermelho: { bg: 'bg-red-500', text: 'text-red-700', label: 'Plástico' },
  verde: { bg: 'bg-green-600', text: 'text-green-700', label: 'Vidro' },
  amarelo: { bg: 'bg-yellow-400', text: 'text-yellow-700', label: 'Metal' },
  laranja: { bg: 'bg-orange-500', text: 'text-orange-700', label: 'Perigoso' },
  marrom: { bg: 'bg-amber-700', text: 'text-amber-900', label: 'Orgânicos' },
  roxo: { bg: 'bg-purple-600', text: 'text-purple-700', label: 'Radioativos' },
  preto: { bg: 'bg-black', text: 'text-gray-700', label: 'Não-Reciclável' },
};

export default function ScannerEAN() {
  const { addRecycledItem, updateActiveDays } = useAuth();
  const { status, lastCode } = useBluetooth();
  const isConnected = status === 'connected';
  const connectionStatus = status === 'connected' ? 'Conectado' : status === 'searching' ? 'Procurando...' : 'Desconectado';
  const [code, setCode] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [isDiscarded, setIsDiscarded] = useState(false);

  // Atualizar dias ativos ao entrar na página
  useEffect(() => {
    updateActiveDays();
  }, []);

  // Escutar por códigos do ESP32 via Bluetooth
  useEffect(() => {
    if (lastCode) {
      const cleanCode = lastCode.trim();
      
      // O ESP32 pode enviar um código curto no protótipo ou um EAN-13 comercial.
      if (isSupportedProductCode(cleanCode)) {
        setCode(cleanCode);
        // Buscar automaticamente após receber o código
        setTimeout(() => {
          const product = findProductByEAN(cleanCode);
          if (product) {
            setProduct(product);
            setError('');
            toast.success('✓ Produto encontrado!');
          } else {
            setError('Produto não encontrado. Verifique o código digitado.');
            toast.error('Produto não encontrado');
          }
        }, 100);
      }
    }
  }, [lastCode]);

  useEffect(() => {
    if (isConnected) {
      toast.success('✓ Bluetooth conectado! Pronto para receber códigos.');
    }
  }, [isConnected]);

  const handleSearch = () => {
    setError('');
    setProduct(null);
    setIsDiscarded(false);

    // Aceitar o código curto do protótipo e EAN-13 comercial.
    if (!isSupportedProductCode(code)) {
      setError('Código inválido! Use entre 6 e 13 dígitos.');
      toast.error('Código de produto inválido');
      return;
    }

    // Buscar produto
    const foundProduct = findProductByEAN(code);
    if (foundProduct) {
      setProduct(foundProduct);
      toast.success('Produto encontrado!');
    } else {
      setError('Produto não encontrado. Verifique o código digitado.');
      toast.error('Produto não encontrado');
    }
  };

  const handleDiscard = () => {
    if (product) {
      addRecycledItem(product.ean);
      setIsDiscarded(true);
      toast.success('✅ Produto marcado como descartado corretamente!');
      
      // Limpar após 2 segundos
      setTimeout(() => {
        setCode('');
        setProduct(null);
        setIsDiscarded(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006633] via-[#2FAF4A] to-[#7ED957] text-white p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Digitar Código EAN-13</h1>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Bluetooth className="w-5 h-5 text-[#7ED957]" />
                <span className="text-sm font-medium">Conectado</span>
              </>
            ) : (
              <>
                <BluetoothOff className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium text-red-400">{connectionStatus}</span>
              </>
            )}
          </div>
        </div>
        <p className="text-sm opacity-90">Digite ou escaneie o código de barras do produto</p>
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-6">
        {/* Input de Código */}
        <Card className="p-6">
          <label className="block text-sm font-semibold mb-3 text-foreground">
            Código do produto (6 a 13 dígitos)
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="1234561234567"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                setCode(value);
              }}
              onKeyPress={handleKeyPress}
              maxLength={13}
              className="flex-1 text-lg font-mono"
              disabled={isDiscarded}
            />
            <Button
              onClick={handleSearch}
              disabled={!isSupportedProductCode(code) || isDiscarded}
              className="bg-[#006633] hover:bg-[#005522] text-white px-6"
            >
              Buscar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Progresso: {code.length}/13 dígitos (ou código curto do ESP32)
          </p>
        </Card>

        {/* Erro */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Produto não encontrado</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Produto Encontrado */}
        {product && (
          <Card className="p-6 border-2 border-[#7ED957]">
            {/* Status */}
            {isDiscarded && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">
                  ✓ Produto descartado corretamente!
                </span>
              </div>
            )}

            {/* Nome do Produto */}
            <h2 className="text-2xl font-bold text-foreground mb-2">{product.name}</h2>
            <p className="text-muted-foreground mb-4">{product.description}</p>

            {/* Lixeira Correta */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Lixeira Correta:</p>
              <div
                className={`${binColors[product.bin].bg} ${binColors[product.bin].text} p-4 rounded-lg text-white font-bold text-lg`}
              >
                {binColors[product.bin].label.toUpperCase()}
              </div>
            </div>

            {/* Tempo de Decomposição */}
            <div className="bg-[#F5F7F4] p-4 rounded-lg mb-6">
              <p className="text-sm font-semibold text-[#006633] mb-1">Tempo de Decomposição:</p>
              <p className="text-lg font-bold text-[#006633]">{product.decompositionTime}</p>
            </div>

            {/* Instruções de Descarte */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-foreground mb-3">Passos para Descartar:</p>
              <ol className="space-y-2">
                {product.disposalInstructions.map((instruction, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="font-bold text-[#006633] flex-shrink-0">{idx + 1}.</span>
                    <span className="text-foreground">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Impacto Ambiental */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">CO₂ Evitado</p>
                <p className="text-lg font-bold text-blue-700">{product.environmental.co2Saved} kg</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Água Economizada</p>
                <p className="text-lg font-bold text-cyan-700">{product.environmental.waterSaved}L</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Energia Poupada</p>
                <p className="text-lg font-bold text-yellow-700">{product.environmental.energySaved} kWh</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Árvores Salvas</p>
                <p className="text-lg font-bold text-green-700">{product.environmental.treesSaved}</p>
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-[#F5F7F4] p-4 rounded-lg mb-6">
              <p className="text-sm font-semibold text-[#006633] mb-2">💡 Dicas:</p>
              <ul className="space-y-1">
                {product.tips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-[#006633]">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Botão de Descarte */}
            {!isDiscarded && (
              <Button
                onClick={handleDiscard}
                className="w-full bg-[#7ED957] hover:bg-[#6bc945] text-[#006633] font-bold py-3 rounded-lg transition-colors"
              >
                ✓ Descartei esse produto corretamente
              </Button>
            )}
          </Card>
        )}

        {/* Dica de Uso */}
        {!product && (
          <Card className="p-4 bg-[#F5F7F4] border-[#7ED957]">
            <p className="text-sm text-[#006633]">
              <strong>💡 Como usar:</strong> Digite o código do teclado ESP32 ou o EAN-13 do produto e clique em "Buscar" para ver as informações de descarte.
            </p>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
