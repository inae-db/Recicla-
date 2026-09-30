import { useState } from 'react';
// Reciclaí — Autenticação acessível e acolhedora
// Design: Floresta Tecnológica com superfícies suaves, marca vegetal e microcopy sustentável.
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Login realizado com sucesso!');
      } else {
        await signup(email, password, name);
        toast.success('Cadastro realizado com sucesso!');
      }
      setLocation('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao processar solicitação';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#EAF4EC] p-4">
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#B8E6BE]/60 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#DDEFCB] blur-3xl" aria-hidden="true" />
      <Card className="relative w-full max-w-md border border-[#C8E2CC] bg-white/95 shadow-xl backdrop-blur-sm">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E8F5E9]" aria-hidden="true">
                <Leaf className="h-7 w-7 text-[#006633]" />
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#006633]">
                Recicla<span className="text-[#7ED957]">í</span>
              </h1>
            </div>
            <p className="text-sm font-medium text-[#4A7656]">Pequenas escolhas. Um planeta mais leve.</p>
          </div>

          {/* Título */}
          <h2 className="text-xl font-bold text-center mb-2 text-foreground">
            {isLogin ? 'Bem-vindo de volta!' : 'Junte-se ao movimento'}
          </h2>
          <p className="text-center text-muted-foreground mb-6">
            {isLogin ? 'Faça login para continuar reciclando' : 'Crie sua conta para começar'}
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome (apenas para signup) */}
            {!isLogin && (
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium mb-2 text-foreground">Nome</label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            )}

            {/* Email */}
            <div>
                <label htmlFor="auth-email" className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <Input
                  id="auth-email"
                  type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Senha */}
            <div>
                <label htmlFor="auth-password" className="block text-sm font-medium mb-2 text-foreground">Senha</label>
                <Input
                  id="auth-password"
                  type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006633] hover:bg-[#005522] text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground" aria-live="polite">
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="text-[#006633] font-semibold hover:underline"
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>

          {/* Dica de teste */}
          <div className="mt-6 p-3 bg-[#F5F7F4] rounded-lg border border-[#7ED957]">
            <p className="text-xs text-[#006633] font-medium">💡 Dica para teste:</p>
            <p className="text-xs text-muted-foreground mt-1">
              {isLogin
                ? 'Use qualquer email e senha para fazer login'
                : 'Use qualquer email e senha para criar uma conta'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
