/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
            <Navbar />
            <main className="flex-grow flex items-center justify-center pt-16 pb-24 px-4">
                <div className="text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-[200px] font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-none mb-8">
                            404
                        </h1>
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <p className="text-4xl text-gray-300 mb-10">Oops! Page not found</p>
                        <p className="text-gray-400 mb-12 text-xl max-w-xl mx-auto leading-relaxed">
                            The page you are looking for might have been removed, had its name changed,
                            or is temporarily unavailable.
                        </p>
                        <div className="flex justify-center gap-6">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/"
                                    className="px-8 py-4 text-lg bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                                >
                                    Go Back Home
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/contact"
                                    className="px-8 py-4 text-lg border border-cyan-500/30 rounded-lg text-cyan-400 font-medium hover:bg-cyan-500/10 transition-all duration-300"
                                >
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