import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  recycledItems: string[]; // Array de EANs reciclados
  activeDays: number;
  lastActiveDate: Date;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  addRecycledItem: (ean: string) => void;
  updateActiveDays: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('reciclaUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        parsedUser.createdAt = new Date(parsedUser.createdAt);
        parsedUser.lastActiveDate = new Date(parsedUser.lastActiveDate);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('reciclaUser');
      }
    }
  }, []);

  // Salvar usuário no localStorage sempre que mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('reciclaUser', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Simular login (em produção, seria uma chamada à API)
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Verificar se o usuário existe no localStorage
    const savedUser = localStorage.getItem('reciclaUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.email === email) {
          // Login bem-sucedido
          parsedUser.createdAt = new Date(parsedUser.createdAt);
          parsedUser.lastActiveDate = new Date(parsedUser.lastActiveDate);
          setUser(parsedUser);
          setIsLoggedIn(true);
          return;
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
      }
    }

    throw new Error('Email ou senha incorretos');
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simular signup (em produção, seria uma chamada à API)
    if (!email || !password || !name) {
      throw new Error('Todos os campos são obrigatórios');
    }

    // Verificar se o usuário já existe
    const savedUser = localStorage.getItem('reciclaUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.email === email) {
          throw new Error('Este email já está cadastrado');
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('cadastrado')) {
          throw error;
        }
      }
    }

    // Criar novo usuário
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: new Date(),
      recycledItems: [],
      activeDays: 1,
      lastActiveDate: new Date(),
    };

    setUser(newUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('reciclaUser');
  };

  const addRecycledItem = (ean: string) => {
    if (user) {
      setUser({
        ...user,
        recycledItems: [...user.recycledItems, ean],
      });
    }
  };

  const updateActiveDays = () => {
    if (user) {
      const today = new Date().toDateString();
      const lastActive = user.lastActiveDate.toDateString();

      let newActiveDays = user.activeDays;
      if (today !== lastActive) {
        newActiveDays += 1;
      }

      setUser({
        ...user,
        activeDays: newActiveDays,
        lastActiveDate: new Date(),
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        signup,
        logout,
        addRecycledItem,
        updateActiveDays,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
