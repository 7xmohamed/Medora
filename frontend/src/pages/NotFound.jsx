/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white text-gray-900">
            <Navbar />
            <main className="flex-grow flex items-center justify-center pt-16 pb-24 px-4">
                <div className="text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-[200px] font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent leading-none mb-8">
                            404
                        </h1>
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <p className="text-4xl text-gray-700 mb-10">Oops! Page not found</p>
                        <p className="text-gray-600 mb-12 text-xl max-w-xl mx-auto leading-relaxed">
                            The page you are looking for might have been removed, had its name changed,
                            or is temporarily unavailable.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/"
                                    className="px-8 py-3.5 text-lg bg-emerald-600 rounded-lg text-white font-medium hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    Go Back Home
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/contact"
                                    className="px-8 py-3.5 text-lg border border-emerald-500 rounded-lg text-emerald-600 font-medium hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v4a1 1 0 001 1h1v1.586l1.293-1.293a1 1 0 011.414 0L11 11.586V10h1a1 1 0 001-1V5a1 1 0 00-1-1H4z" clipRule="evenodd" />
                                    </svg>
                                    Contact Support
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}