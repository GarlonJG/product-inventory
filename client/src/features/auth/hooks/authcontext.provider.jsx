import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useLogoutMutation, useRefreshMutation } from '../api/authApi';
import { setCredentials, clearCredentials, selectCurrentToken, selectCurrentUser, selectIsAuthenticated } from '../authSlice';
import { baseApi } from '../../../shared/lib/baseApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const accessToken = useSelector(selectCurrentToken);
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
    const [logoutMutation] = useLogoutMutation();
    const [refreshMutation] = useRefreshMutation();

    const login = useCallback(async (credentials) => {
        try {
            const result = await loginMutation(credentials).unwrap();
            dispatch(setCredentials(result));
            return result;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }, [loginMutation]);

    const refresh = useCallback(async () => {
        try {
            const result = await refreshMutation().unwrap();
            dispatch(setCredentials(result));
            return result;
        } catch (error) {
            console.error('Refresh failed:', error);
            dispatch(clearCredentials());
            throw error;
        }
    }, [refreshMutation]);

    const logout = useCallback(async () => {
        try {
            await logoutMutation().unwrap();
            console.log("awaited logoutMutation");
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            console.log("finally about to clear credentials")
            dispatch(clearCredentials());

            //TODO: Figure better place to reset api state.
            //Currently it's here because it's the only place where the API can be reset
            //without a global re-render on all API endpoints
            dispatch(baseApi.util.resetApiState());
            console.log("cleared Credentials");
        }
    }, [logoutMutation]);

    useEffect(() => {
        console.log('Current path:', window.location.pathname);
        console.log('Is public route?', isPublicRoute(window.location.pathname));
        if (isPublicRoute(window.location.pathname)) return;
        console.log("Client in useEffect");
        refresh().catch((error) => {
            console.error('Failed to refresh token:', error);
        // Failed refresh, nothing to do or optionally logout
        });
    }, [refresh]);

    //TOTHINK: Don't forget to handle 401 errors in the baseApi.
    //(e.g.baseApi.util.getRunningOperationPromises, error.status === 401, logout();)

    const value = {
        accessToken,
        user,
        isLoading: isLoggingIn,
        isAuthenticated,
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