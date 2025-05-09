"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, refreshToken } from '@/lib/api';
import { getAuthToken } from '@/lib/apiUtils';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 토큰이 있는 경우 인증된 상태로 설정
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        if (token) {
          // 여기서는 간단히 토큰 존재 여부만 확인합니다.
          // 실제로는 서버에 유효한 토큰인지 확인하는 API 호출이 필요할 수 있습니다.
          setIsAuthenticated(true);
          
          // 로컬 스토리지에서 사용자 정보를 가져옵니다.
          const userInfo = localStorage.getItem('yuseong_user');
          if (userInfo) {
            setUser(JSON.parse(userInfo));
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(username, password);
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('yuseong_user', JSON.stringify(response.user));
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('yuseong_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
