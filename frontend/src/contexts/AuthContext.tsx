import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const API_URL = 'http://localhost:3333/api/v1';

export interface AuthOperator {
  id: number;
  nickname: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  role: string;
}

interface AuthContextType {
  operator: AuthOperator | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

interface RegisterData {
  nickname: string;
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [operator, setOperator] = useState<AuthOperator | null>(() => {
    const stored = localStorage.getItem('play12_operator');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  // Persist operator in localStorage
  useEffect(() => {
    if (operator) {
      localStorage.setItem('play12_operator', JSON.stringify(operator));
    } else {
      localStorage.removeItem('play12_operator');
    }
  }, [operator]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Credenciais inválidas');
      }

      const data = await res.json();
      setOperator(data.operator);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (regData: RegisterData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(regData),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Falha ao registrar');
      }

      const data = await res.json();
      setOperator(data.operator);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // silently ignore
    }
    setOperator(null);
  }, []);

  return (
    <AuthContext.Provider value={{ operator, isAuthenticated: !!operator, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
