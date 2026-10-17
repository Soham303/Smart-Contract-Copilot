'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken, setStoredToken, removeStoredToken, loginUser, registerUser, getAuthProfile } from '../../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, pwd: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, pwd: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check stored user or fetch profile
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('scc_user') : null;
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        removeStoredToken();
      }
    } else {
      // Check token validity with backend
      const token = getStoredToken();
      if (token) {
        getAuthProfile().then(res => {
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('scc_user', JSON.stringify(res.user));
          }
        }).catch(() => removeStoredToken());
      }
    }
  }, []);

  const login = async (email: string, pwd: string) => {
    try {
      const res = await loginUser(email, pwd);
      if (res.accessToken && res.user) {
        setStoredToken(res.accessToken);
        setUser(res.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('scc_user', JSON.stringify(res.user));
        }
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: res.error?.message || 'Login failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const register = async (email: string, pwd: string, name?: string) => {
    try {
      const res = await registerUser(email, pwd, name);
      if (res.accessToken && res.user) {
        setStoredToken(res.accessToken);
        setUser(res.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('scc_user', JSON.stringify(res.user));
        }
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: res.error?.message || 'Registration failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
    try {
      router.push('/');
    } catch {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        login,
        register,
        logout,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
