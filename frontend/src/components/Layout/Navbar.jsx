import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-14">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-primary/5 rounded-lg flex items-center justify-center">
                            <span className="text-primary text-xl font-bold">M</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">Medora</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-sm px-4 py-2 text-gray-700 hover:text-primary transition-colors">
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="text-sm px-4 py-2 text-gray-700 hover:text-red-600 transition-colors">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm px-4 py-2 text-gray-700 hover:text-primary transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
