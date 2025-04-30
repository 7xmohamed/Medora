import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
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
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-6 text-center">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="text-3xl font-bold text-white tracking-tight">Reset Password</h1>
                                <p className="mt-1 text-emerald-100/90 font-medium">
                                    Enter your email to receive a reset link
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

                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="text-center"
                                >
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
                                        <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Password reset link sent!</h2>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        We've sent an email to <span className="font-medium text-emerald-600 dark:text-emerald-400">{email}</span> with instructions to reset your password.
                                    </p>
                                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                        Didn't receive the email? Check your spam folder or{' '}
                                        <button
                                            onClick={() => setIsSubmitted(false)}
                                            className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                                        >
                                            try again
                                        </button>.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            to="/login"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-800"
                                        >
                                            Return to sign in
                                        </Link>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                    variants={containerVariants}
                                >
                                    <motion.div variants={itemVariants}>
                                        <div className="relative rounded-lg transition-all duration-200">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Enter the email address associated with your account.
                                        </p>
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
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Reset Link
                                                        <ArrowRightIcon className="w-4 h-4 ml-2 inline group-hover:translate-x-0.5 transition-transform" />
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                    </motion.div>
                                </motion.form>
                            )}

                            <motion.div
                                variants={itemVariants}
                                className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                    Remember your password?{' '}
                                    <Link
                                        to="/login"
                                        className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}