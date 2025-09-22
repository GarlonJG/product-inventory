import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLoginMutation, useLogoutMutation } from '../api/authApi';
import { baseApi } from '../../../shared/lib/baseApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || null);
  const [user, setUser] = useState(null);

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = useCallback(async (credentials) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      localStorage.setItem('access_token', result.access_token);
      setAccessToken(result.access_token);
      setUser(result.user);
      console.log("result", result);
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [loginMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      setAccessToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  }, [logoutMutation]);

  // Handle 401 Unauthorized responses
  useEffect(() => {
    const originalBaseQuery = baseApi.util.getRunningOperationPromises;
    
    baseApi.util.getRunningOperationPromises = async function(...args) {
      try {
        const result = await originalBaseQuery.apply(this, args);
        return result;
      } catch (error) {
        if (error.status === 401) {
          logout();
        }
        throw error;
      }
    };

    return () => {
      baseApi.util.getRunningOperationPromises = originalBaseQuery;
    };
  }, [logout]);

  const value = {
    accessToken,
    user,
    isLoading: isLoggingIn,
    isAuthenticated: !!accessToken,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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