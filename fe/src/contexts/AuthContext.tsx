import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: 'guest' | 'host') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: 'guest' | 'host') => {
    if (role === 'guest') {
      setUser({
        id: 'guest1',
        name: 'Nguyễn Văn Minh',
        email: 'guest@homestayvietnam.com',
        role: 'guest',
        createdAt: '2024-01-01'
      });
    } else {
      setUser({
        id: 'host1',
        name: 'Trần Thị Lan',
        email: 'host@homestayvietnam.com',
        role: 'host',
        createdAt: '2024-01-01'
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};