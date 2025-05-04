/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getDashboardLink = () => {
        switch (user?.role) {
            case 'admin':
                return '/admin/dashboard';
            case 'doctor':
                return '/doctor/dashboard';
            default:
                return '/404';
        }
    };

    const getProfileLink = () => {
        switch (user?.role) {
            case 'doctor':
                return '/doctor/profile';
            case 'patient':
                return '/patient/profile';
            default:
                return '/404';
        }
    };

    const showDashboardLink = user && (user.role === 'admin' || user.role === 'doctor');
    const showProfileLink = user && (user.role === 'doctor' || user.role === 'patient');

    return (
        <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 fixed w-full z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="h-9 w-9 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-emerald-600 via-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20"
                        >
                            <span className="text-white text-xl font-bold">M</span>
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                            Medora
                        </span>
                    </Link>

                    {/* Mobile menu button */}
                    <div className="flex items-center gap-3 md:hidden">
                        <motion.button
                            onClick={toggleDarkMode}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {darkMode ? (
                                <SunIcon className="h-5 w-5" />
                            ) : (
                                <MoonIcon className="h-5 w-5" />
                            )}
                        </motion.button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center gap-3">
                        <motion.button
                            onClick={toggleDarkMode}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode ? (
                                <SunIcon className="h-5 w-5" />
                            ) : (
                                <MoonIcon className="h-5 w-5" />
                            )}
                        </motion.button>

                        {user ? (
                            <>
                                {showProfileLink && (
                                    <Link
                                        to={getProfileLink()}
                                        className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        aria-label="Profile"
                                    >
                                        <UserCircleIcon className="h-6 w-6" />
                                    </Link>
                                )}
                                {showDashboardLink && (
                                    <Link
                                        to={getDashboardLink()}
                                        className="text-sm px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
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
                                    className="text-sm px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                                >
                                    Login
                                </Link>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/register"
                                        className="text-sm px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
                                    >
                                        Register
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-700"
                    >
                        <div className="px-4 py-3 space-y-3">
                            {user ? (
                                <>
                                    {showProfileLink && (
                                        <Link
                                            to={getProfileLink()}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <UserCircleIcon className="h-5 w-5" />
                                            <span>Profile</span>
                                        </Link>
                                    )}
                                    {showDashboardLink && (
                                        <Link
                                            to={getDashboardLink()}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block p-2 rounded-lg text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}