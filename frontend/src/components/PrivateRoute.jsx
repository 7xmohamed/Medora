import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children, roles }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin mr-3 h-8 w-8 border-t-2 border-b-2 border-cyan-400 rounded-full"></div>
                <span>Loading...</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}
