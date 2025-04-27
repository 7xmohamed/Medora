import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-black/90 backdrop-blur-lg border-b border-cyan-500/20 fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="h-9 w-9 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-violet-600 via-cyan-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30"
                        >
                            <span className="text-white text-xl font-bold">M</span>
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                            Medora
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-sm px-4 py-2 text-cyan-100 hover:text-white transition-all hover:bg-black/50 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-[0_0_10px_-3px_rgba(34,211,238,0.3)]"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-sm px-4 py-2 text-rose-300 hover:text-white transition-all hover:bg-rose-900/30 rounded-lg border border-rose-500/30 hover:border-rose-400/50 hover:shadow-[0_0_10px_-3px_rgba(244,63,94,0.3)]"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm px-4 py-2 text-cyan-100 hover:text-white transition-all hover:bg-black/50 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-[0_0_10px_-3px_rgba(34,211,238,0.3)]"
                                >
                                    Login
                                </Link>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/register"
                                        className="text-sm px-4 py-2 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-violet-600 via-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-all border border-cyan-400/40"
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