/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import axios from '../services/api';
import { handleApiError } from '../utils/errorHandler';

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
            await api.get('/sanctum/csrf-cookie');
            await checkAuth();
        } catch (error) {
            setError('Unable to initialize authentication. Please check your internet connection and try again.');
            setLoading(false);
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
            const errorMessage = error.response?.status === 401
                ? 'Your session has expired. Please login again.'
                : 'Authentication check failed. Please try logging in again.';
            setError(errorMessage);
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
            const { message, fields } = handleApiError(error, 'Login failed');
            setError(message);
            if (fields) {
                throw { message, fields };
            }
            throw new Error(message);
        }
    };

    const register = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
            };

            const response = await api.post('/register', formData, config);
            if (response.data.user && response.data.token) {
                setUser(response.data.user);
                localStorage.setItem('token', response.data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                setError(null);
            }
            return response.data;
        } catch (error) {
            const { message, fields } = handleApiError(error, 'Registration failed');
            setError(message);
            if (fields) {
                throw { message, fields };
            }
            throw new Error(message);
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
            setError(null);
        } catch (error) {
            setError('Unable to logout properly. Your local session has been cleared.');
        } finally {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    // Helper function to get error messages
    const getErrorMessage = (error) => {
        if (error.status === 422) {
            if (error.details?.errors) {
                // Get first validation error message
                const firstError = Object.values(error.details.errors)[0];
                return Array.isArray(firstError) ? firstError[0] : firstError;
            }
            return 'Please check your input and try again.';
        }

        if (error.status === 429) {
            return 'Too many attempts. Please try again later.';
        }

        return error.message || 'An unexpected error occurred. Please try again.';
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
