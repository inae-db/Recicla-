// Perfil do Usuário com Dados Reais
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { calculateEnvironmentalImpact, generateAchievements, findProductByEAN } from '@/lib/products';
import {
  ArrowLeft,
  Settings,
  Leaf,
  Droplets,
  Zap,
  TreePine,
  Award,
  History,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Calendar,
  Trash2,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Profile() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  if (!user) {
    return <div>Carregando...</div>;
  }

  // Calcular impacto ambiental
  const impact = calculateEnvironmentalImpact(user.recycledItems);

  // Gerar conquistas
  const achievements = generateAchievements(user.recycledItems.length, user.activeDays);

  // Obter histórico de produtos
  const recycledProducts = user.recycledItems
    .map((ean) => findProductByEAN(ean))
    .filter((p) => p !== undefined);

  const handleLogout = () => {
    logout();
    toast.success('Desconectado com sucesso!');
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006633] via-[#2FAF4A] to-[#7ED957] text-white p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/')} className="hover:opacity-80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <Settings className="w-6 h-6 opacity-50" />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-6">
        {/* Informações do Usuário */}
        <Card className="p-6 bg-gradient-to-br from-[#F5F7F4] to-white border-[#7ED957]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#006633] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#006633]">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </Card>

        {/* Estatísticas de Impacto */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3">🌍 Seu Impacto Ambiental</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* CO2 Evitado */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">CO₂ Evitado</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{impact.co2Saved}</p>
              <p className="text-xs text-blue-700">kg de CO₂</p>
            </Card>

            {/* Água Economizada */}
            <Card className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-cyan-600" />
                <span className="text-xs font-semibold text-cyan-700">Água Economizada</span>
              </div>
              <p className="text-2xl font-bold text-cyan-900">{impact.waterSaved}</p>
              <p className="text-xs text-cyan-700">litros</p>
            </Card>

            {/* Energia Poupada */}
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-700">Energia Poupada</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{impact.energySaved}</p>
              <p className="text-xs text-yellow-700">kWh</p>
            </Card>

            {/* Árvores Salvas */}
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TreePine className="w-5 h-5 text-green-600" />
                <span className="text-xs font-semibold text-green-700">Árvores Salvas</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{impact.treesSaved.toFixed(2)}</p>
              <p className="text-xs text-green-700">árvores</p>
            </Card>
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3">📊 Suas Estatísticas</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-[#F5F7F4] border-[#7ED957]">
              <p className="text-xs text-muted-foreground mb-1">Itens Reciclados</p>
              <p className="text-3xl font-bold text-[#006633]">{user.recycledItems.length}</p>
            </Card>
            <Card className="p-4 bg-[#F5F7F4] border-[#7ED957]">
              <p className="text-xs text-muted-foreground mb-1">Dias Ativos</p>
              <p className="text-3xl font-bold text-[#006633]">{user.activeDays}</p>
            </Card>
          </div>
        </div>

        {/* Conquistas */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3">🏆 Conquistas ({achievements.length})</h3>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="p-3 text-center bg-[#F5F7F4] border-[#7ED957]">
                <p className="text-2xl mb-1">{achievement.icon}</p>
                <p className="text-xs font-semibold text-[#006633]">{achievement.name}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Histórico de Produtos Reciclados */}
        {recycledProducts.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">
              <History className="inline w-5 h-5 mr-2" />
              Histórico de Reciclagem ({recycledProducts.length})
            </h3>
            <div className="space-y-2">
              {recycledProducts.slice(0, 10).map((product, idx) => (
                <Card key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{product?.name}</p>
                    <p className="text-xs text-muted-foreground">{product?.category}</p>
                  </div>
                  <Trash2 className="w-4 h-4 text-[#006633]" />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Configurações */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3">⚙️ Configurações</h3>
          <div className="space-y-2">
            <Card className="p-4 flex items-center justify-between hover:bg-muted cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#006633]" />
                <div>
                  <p className="font-semibold text-foreground">Notificações</p>
                  <p className="text-xs text-muted-foreground">Dicas e lembretes diários</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between hover:bg-muted cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#006633]" />
                <div>
                  <p className="font-semibold text-foreground">Privacidade</p>
                  <p className="text-xs text-muted-foreground">Configurações de dados</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between hover:bg-muted cursor-pointer">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#006633]" />
                <div>
                  <p className="font-semibold text-foreground">Ajuda e suporte</p>
                  <p className="text-xs text-muted-foreground">FAQ e contato</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Botão Sair */}
        <Button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
