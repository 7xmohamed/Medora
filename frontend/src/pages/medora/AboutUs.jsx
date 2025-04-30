/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUserMd, FaStar, FaClock, FaHeart, FaStethoscope, FaSearch, FaSyncAlt } from 'react-icons/fa';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">

            {/* Hero Section */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
                    <div className="absolute inset-0 bg-[url('/images/dot-pattern.svg')] dark:bg-[url('/images/dot-pattern-dark.svg')]"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-transparent bg-clip-text dark:from-emerald-400 dark:to-emerald-600">
                                About Medora Health
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Revolutionizing healthcare through innovative technology and compassionate service.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 dark:bg-emerald-900 dark:border-emerald-700 mb-6">
                                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                                    Our Mission
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Redefining Healthcare Excellence</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                                Founded in 2025, Medora Health was created to bridge the gap between patients and healthcare providers through cutting-edge technology. Our platform combines medical expertise with digital innovation to deliver seamless healthcare experiences.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                We've helped over 50,000 patients access quality care while empowering healthcare professionals to focus on what matters most - patient outcomes.
                            </p>
                            <Link
                                to="/doctors"
                                className="inline-flex items-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 dark:hover:bg-emerald-500 shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Find Your Doctor
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { value: "500+", label: "Verified Specialists", icon: <FaUserMd className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" /> },
                                { value: "98%", label: "Patient Satisfaction", icon: <FaStar className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" /> },
                                { value: "24/7", label: "Appointment Access", icon: <FaClock className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" /> },
                                { value: "50K+", label: "Patients Served", icon: <FaHeart className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" /> }
                            ].map((stat, index) => (
                                <div key={index} className="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow text-center">
                                    <div className="mb-2 flex justify-center">{stat.icon}</div>
                                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stat.value}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-300 mt-2">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Integrated Approach</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            A seamless healthcare experience from start to finish
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Comprehensive Provider Network",
                                description: "Access to a carefully vetted network of healthcare professionals across all specialties.",
                                icon: <FaStethoscope className="w-10 h-10 mx-auto text-emerald-600 dark:text-emerald-400" />
                            },
                            {
                                title: "Intelligent Matching",
                                description: "Our algorithm matches you with the ideal provider based on your needs and preferences.",
                                icon: <FaSearch className="w-10 h-10 mx-auto text-emerald-600 dark:text-emerald-400" />
                            },
                            {
                                title: "Seamless Coordination",
                                description: "Integrated scheduling, reminders, and follow-ups for complete care continuity.",
                                icon: <FaSyncAlt className="w-10 h-10 mx-auto text-emerald-600 dark:text-emerald-400" />
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-xl bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-all text-center"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-emerald-600 dark:bg-emerald-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Healthcare Revolution</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Experience the difference with Medora Health's patient-centered approach.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="px-8 py-3.5 bg-white text-emerald-600 dark:text-emerald-700 font-medium rounded-lg hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/contact"
                                className="px-8 py-3.5 border border-white text-white font-medium rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-300"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}