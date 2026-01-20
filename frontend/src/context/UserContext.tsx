import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  city?: string;
  phone?: string;
  category?: string;
  instituteName?: string;
  token?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const userInfoRaw = await AsyncStorage.getItem('userInfo');
      const currentUserRaw = await AsyncStorage.getItem('currentUser');
      
      if (userInfoRaw) {
        const userInfo = JSON.parse(userInfoRaw);
        setUser(userInfo);
      } else if (currentUserRaw) {
        const currentUser = JSON.parse(currentUserRaw);
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data) {
        const userData = {
          ...response.data,
          token: user?.token, // Preserve token
        };
        setUser(userData);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
        await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('userInfo');
    await AsyncStorage.removeItem('currentUser');
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
