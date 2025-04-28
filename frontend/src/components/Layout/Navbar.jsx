import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function Navbar() {
    const { user, logout } = useAuth();

    const getDashboardLink = () => {
        switch (user?.role) {
            case 'admin':
                return '/dashboard';
            case 'doctor':
                return '/doctor/dashboard';
            default:
                return '/404';
        }
    };

    const showDashboardLink = user && (user.role === 'admin' || user.role === 'doctor');

    return (
        <nav className="bg-gray-50/95 backdrop-blur-lg border-b border-gray-200 fixed w-full z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="h-9 w-9 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-600 via-teal-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20"
                        >
                            <span className="text-white text-xl font-bold">M</span>
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                            Medora
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                {showDashboardLink && (
                                    <Link
                                        to={getDashboardLink()}
                                        className="text-sm px-4 py-2 text-gray-700 hover:text-gray-900 transition-all hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300"
                                    >
                                        {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="text-sm px-4 py-2 text-rose-500 hover:text-rose-700 transition-all hover:bg-rose-50 rounded-lg border border-rose-200 hover:border-rose-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm px-4 py-2 text-gray-700 hover:text-gray-900 transition-all hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300"
                                >
                                    Login
                                </Link>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/register"
                                        className="text-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                                    >
                                        Register
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}