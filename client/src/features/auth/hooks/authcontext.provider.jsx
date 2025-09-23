import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLoginMutation, useLogoutMutation, useRefreshMutation } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null); // no localStorage
    const [user, setUser] = useState(null);

    const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
    const [logoutMutation] = useLogoutMutation();
    const [refreshMutation] = useRefreshMutation();

  const login = useCallback(async (credentials) => {
    try {
    const result = await loginMutation(credentials).unwrap();
    console.log("login result", result);
    setAccessToken(result.access_token);
    setUser(result.user);
    return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [loginMutation]);

  const refresh = useCallback(async () => {
    console.log("Client in refresh callback");
    try {
        const result = await refreshMutation().unwrap();
        console.log("refresh result", result);
        setAccessToken(result.access_token);
        setUser(result.user);
        return result;
    } catch (error) {
        console.error('Refresh failed:', error);
        throw error;
    }
  }, [refreshMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  }, [logoutMutation]);

  useEffect(() => {
    if (isPublicRoute(window.location.pathname)) return;
    refresh().catch(() => {
      // Failed refresh, nothing to do or optionally logout
    });
  }, [accessToken, refresh]);

  //TOTHINK: Don't forget to handle 401 errors in the baseApi.
  //(e.g.baseApi.util.getRunningOperationPromises, error.status === 401, logout();)

  const value = {
    accessToken,
    user,
    isLoading: isLoggingIn,
    isAuthenticated: !!accessToken,
    login,
    logout,
    refresh
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

function isPublicRoute(pathname) {
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    return publicRoutes.includes(pathname);
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};