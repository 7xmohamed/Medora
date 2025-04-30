/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const { login, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [focusedField, setFocusedField] = useState(null);

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(formData);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'The credentials you entered are incorrect. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-md"
            >
                <motion.div variants={itemVariants}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                        {/* Auth Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-6 text-center">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
                                <p className="mt-1 text-emerald-100/90 font-medium">
                                    Sign in to your Medora account
                                </p>
                            </motion.div>
                        </div>

                        {/* Main Content */}
                        <div className="px-8 py-8 sm:px-10 sm:py-10">
                            {error && (
                                <motion.div
                                    variants={itemVariants}
                                    className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start border border-red-100 dark:border-red-900/30"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </motion.div>
                            )}

                            <motion.form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                                variants={containerVariants}
                            >
                                <motion.div variants={itemVariants}>
                                    <div className={`relative rounded-lg transition-all duration-200 ${focusedField === 'email' ? 'ring-2 ring-emerald-500/30' : ''}`}>
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EnvelopeIcon className={`h-5 w-5 ${focusedField === 'email' ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'} transition-colors`} />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <div className={`relative rounded-lg transition-all duration-200 ${focusedField === 'password' ? 'ring-2 ring-emerald-500/30' : ''}`}>
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LockClosedIcon className={`h-5 w-5 ${focusedField === 'password' ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'} transition-colors`} />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="mt-2 flex justify-end">
                                        <Link
                                            to="/forget-password"
                                            className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center items-center py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-md transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed group"
                                    >
                                        <span className="text-sm font-semibold text-white tracking-wide">
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Authenticating...
                                                </>
                                            ) : (
                                                <>
                                                    Sign In
                                                    <ArrowRightIcon className="w-4 h-4 ml-2 inline group-hover:translate-x-0.5 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </motion.div>
                            </motion.form>

                            <motion.div
                                variants={itemVariants}
                                className="mt-8 pt-5 border-t border-gray-100 dark:border-gray-700"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                                    >
                                        Get started
                                    </Link>
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="mt-6 text-center"
                >
                </motion.div>
            </motion.div>
        </div>
    );
}