import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            if (localStorage.getItem('authenticated')) {
                const response = await authService.check();
                setUser(response.data.user);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
            setInitialized(true);
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authService.login(credentials);
            setUser(response.data.user);
            navigate('/dashboard');
            return response;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            setUser(null);
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (err) {
            toast.error('Logout failed');
        } finally {
            setLoading(false);
        }
    };

    if (!initialized) {
        return null; // or loading spinner
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isAuthenticated: !!user,
            checkAuth
        }}>
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
