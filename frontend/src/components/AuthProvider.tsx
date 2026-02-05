'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserSession, signIn as signInFn, signOut as signOutFn } from '../lib/auth';
 
interface AuthContextType {
  session: any;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getUserSession();
        setSession(sessionData);
      } catch (error) {
        console.error('Error fetching session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Listen for storage changes (when login/logout happens in another tab)
    const handleStorageChange = () => {
      fetchSession();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const success = await signInFn(email, password);
      if (success) {
        const sessionData = await getUserSession();
        setSession(sessionData);
        // Redirect to dashboard after successful login
        window.location.href = '/dashboard';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await signOutFn();
      setSession(null);
      // Redirect to login page after sign out
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    session,
    signIn,
    signOut,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};