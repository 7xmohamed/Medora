/* eslint-disable no-unused-vars */
import { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ModelViewer from '../components/3D/ModelViewer';

export default function HomePage() {
    const [location, setLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);

    const detectLocation = () => {
        setIsLocating(true);
        setLocationError(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation("Near You");
                    setIsLocating(false);
                },
                (error) => {
                    setLocationError("Location access denied. Please enable permissions.");
                    setIsLocating(false);
                }
            );
        } else {
            setLocationError("Location services not available");
            setIsLocating(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-cyan-900/20"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent)]"></div>
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.1),transparent)]"></div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-left"
                        >
                            <div className="mb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-violet-600/10 to-cyan-600/10 border border-gray-700 mb-6"
                                >
                                    <span className="bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text">
                                        Healthcare Reimagined
                                    </span>
                                </motion.div>
                                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                    Your Health,{' '}
                                    <span className="bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text">
                                        Your Way
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-400 mb-8">
                                    Find doctors. Book visits. Get better. All in person, all in one place.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button
                                    onClick={detectLocation}
                                    disabled={isLocating}
                                    className="group relative px-6 py-4 rounded-xl overflow-hidden bg-white text-black font-semibold hover:scale-105 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    {isLocating ? (
                                        <div className="flex items-center gap-3">
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Detecting Location...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{location || 'Find Doctors Near Me'}</span>
                                        </div>
                                    )}
                                </button>

                                <Link
                                    to={location ? '/doctors?location=nearby' : '/doctors'}
                                    className="group relative px-6 py-4 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 font-semibold hover:scale-105 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    {location ? 'View Available Doctors' : 'Browse All Doctors'}
                                </Link>
                            </div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="grid grid-cols-3 gap-8"
                            >
                                {[
                                    { value: '500+', label: 'Doctors' },
                                    { value: '50K+', label: 'Patients' },
                                    { value: '98%', label: 'Satisfaction' },
                                ].map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-400">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right Column */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="hidden lg:block relative"
                        >
                            <div className="relative w-full h-[600px]">
                                <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading 3D Model...</div>}>
                                    <ModelViewer />
                                </Suspense>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Exceptional Care, Simplified</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Everything you need for seamless healthcare experiences
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                                title: "Verified Professionals",
                                description: "All doctors are thoroughly vetted to ensure you receive top-quality care."
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12h.01M12 12h.01M9 12h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
                                    </svg>
                                ),
                                title: "Seamless Appointments",
                                description: "Book, manage, and attend appointments easily, all from one platform."
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ),
                                title: "Trusted by Thousands",
                                description: "Our platform is trusted by thousands of patients worldwide for quality care."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 * index }}
                                viewport={{ once: true }}
                                className="p-6 rounded-xl bg-gray-800"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
