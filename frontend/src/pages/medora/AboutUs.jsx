// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-cyan-900/20"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent)]"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text">
                                About Medora
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Transforming healthcare through innovative technology and compassionate service.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Healthcare Vision</h2>
                            <p className="text-lg text-gray-300 mb-6">
                                Medora was founded on the belief that healthcare should be accessible,
                                personalized, and seamlessly integrated into people's lives. Our platform
                                connects patients with top-tier medical professionals through an intuitive,
                                technology-driven experience.
                            </p>
                            <p className="text-lg text-gray-300 mb-8">
                                Since our launch, we've helped thousands of patients find the right care
                                at the right time, reducing wait times and improving health outcomes.
                            </p>
                            <Link
                                to="/doctors"
                                className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white font-medium transition-all"
                            >
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
                                { value: "500+", label: "Verified Doctors" },
                                { value: "24/7", label: "Appointment Booking" },
                                { value: "50K+", label: "Patients Helped" },
                                { value: "98%", label: "Satisfaction Rate" }
                            ].map((stat, index) => (
                                <div key={index} className="p-6 rounded-xl bg-gray-800 text-center">
                                    <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">How Medora Works</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Simple steps to better healthcare
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                ),
                                title: "Find Your Specialist",
                                description: "Search our network of verified healthcare providers by specialty, location, or availability."
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                ),
                                title: "Book Instantly",
                                description: "Schedule appointments 24/7 with real-time availability and instant confirmation."
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                                title: "Receive Quality Care",
                                description: "Attend your appointment with confidence, knowing you're seeing a vetted professional."
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/30 transition-all"
                            >
                                <div className="text-cyan-400 mb-4">{step.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-gray-400">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            The principles that guide our platform
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Quality Care",
                                description: "We rigorously vet all healthcare providers to ensure exceptional standards.",
                                icon: "🩺"
                            },
                            {
                                title: "Transparency",
                                description: "Clear pricing, provider credentials, and patient reviews available upfront.",
                                icon: "🔍"
                            },
                            {
                                title: "Accessibility",
                                description: "Designed for all patients, regardless of tech-savviness or ability.",
                                icon: "♿"
                            },
                            {
                                title: "Privacy",
                                description: "Your health data is protected with enterprise-grade security.",
                                icon: "🔒"
                            },
                            {
                                title: "Innovation",
                                description: "Continuously improving our platform to serve you better.",
                                icon: "🚀"
                            },
                            {
                                title: "Compassion",
                                description: "Healthcare delivered with empathy and understanding.",
                                icon: "💙"
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700/50 transition-all"
                            >
                                <div className="text-3xl mb-3">{value.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                <p className="text-gray-400">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Better Healthcare?</h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of patients who've found quality care through Medora.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white font-medium transition-all"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/contact"
                                className="px-6 py-3 rounded-lg border border-gray-600 hover:border-cyan-400 hover:text-cyan-400 font-medium transition-all"
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