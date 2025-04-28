/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        initializeAuth();
        // Set up token refresh interval
        const refreshInterval = setInterval(refreshToken, 1000 * 60 * 14); // Refresh every 14 minutes
        return () => clearInterval(refreshInterval);
    }, []);

    const initializeAuth = async () => {
        try {
            // Set CSRF cookie first
            await api.get('/sanctum/csrf-cookie');
            // Then check authentication
            await checkAuth();
        } catch (error) {
            console.error('Failed to initialize auth:', error);
        }
    };

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await api.get('/user');
            setUser(response.data);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Authentication failed');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const refreshToken = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const response = await api.post('/refresh-token');
            localStorage.setItem('token', response.data.token);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            logout();
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            setError(null);
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const formData = new FormData();
            Object.keys(userData).forEach(key => {
                formData.append(key, userData[key]);
            });

            const response = await api.post('/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            setError(null);
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const updateUser = async (userData) => {
        try {
            const response = await api.put('/user', userData);
            setUser(response.data);
            setError(null);
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Update failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setError(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            register,
            logout,
            updateUser,
            refreshToken
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
