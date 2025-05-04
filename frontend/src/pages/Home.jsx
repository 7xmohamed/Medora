/* eslint-disable no-unused-vars */
import { useState, Suspense, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationSelector from '../components/LocationSelector';
import { motion } from 'framer-motion';
import ModelViewer from '../components/3D/ModelViewer';
import { useDarkMode } from '../contexts/DarkModeContext';

function DelayedModelViewer() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return show ? <ModelViewer /> : null;
}

export default function HomePage() {
    const [isMapOpen, setIsMapOpen] = useState(false);
    const navigate = useNavigate();
    const howItWorksRef = useRef(null);
    const { darkMode } = useDarkMode();

    useEffect(() => {
        localStorage.removeItem('userLocation');
    }, []);

    const handleLocationSelect = (location) => {
        try {
            if (!location.city) {
                throw new Error('Invalid location data');
            }

            // Store standardized location data
            const locationData = {
                country: location.country,
                countryCode: location.countryCode,
                city: location.city,
                coordinates: {
                    lat: location.lat,
                    lng: location.lng
                },
                boundingBox: location.boundingBox,
                fullAddress: location.display_name
            };

            localStorage.setItem('userLocation', JSON.stringify(locationData));
            const path = `/en/${location.countryCode.toLowerCase()}/${location.city.toLowerCase()}`;
            navigate(path);
        } catch (error) {
            console.error('Error saving location:', error);
        }
    };

    const scrollToHowItWorks = () => {
        howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <LocationSelector
                    isOpen={isMapOpen}
                    onClose={() => setIsMapOpen(false)}
                    onLocationSelect={handleLocationSelect}
                />

                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
                    {/* Gradient background */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-50/30 to-white dark:from-gray-900/30 dark:to-gray-800 transition-colors duration-300"></div>

                    {/* Geometric pattern */}
                    <div className="absolute inset-0 z-0 opacity-10 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-[length:80px_80px] dark:opacity-20"></div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto w-full relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Column - Redesigned Content */}
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
                                        className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 shadow-sm mb-6 transition-colors duration-300"
                                    >
                                        <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2 transition-colors duration-300">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Trusted Healthcare Platform
                                        </span>
                                    </motion.div>

                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight dark:text-white">
                                        Personalized Care <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
                                            When You Need It
                                        </span>
                                    </h1>

                                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg transition-colors duration-300">
                                        Connect with top-rated doctors, book same-day appointments, and experience healthcare designed around your needs.
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                    <button
                                        onClick={() => setIsMapOpen(true)}
                                        className="group relative px-6 py-3.5 rounded-lg overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-3"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Find Nearby Doctors</span>
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    </button>

                                    <button
                                        onClick={scrollToHowItWorks}
                                        className="px-6 py-3.5 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300 flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        How It Works
                                    </button>
                                </div>

                                {/* Trust Indicators */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <img
                                                    key={i}
                                                    src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 20}.jpg`}
                                                    alt="Patient"
                                                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                                                />
                                            ))}
                                        </div>
                                        <span>5000+ Patients</span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span>4.9/5 Average Rating</span>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Right Column - 3D Model*/}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="hidden lg:block relative"
                            >
                                <div className="relative w-full h-[600px]">
                                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-gray-900 dark:text-gray-100">Loading ...</div>}>
                                        <DelayedModelViewer />
                                    </Suspense>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Your Health, Simplified</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
                                We've reimagined healthcare to give you a seamless experience from start to finish
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: (
                                        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center transition-colors duration-300">
                                            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                    ),
                                    title: "Trusted Professionals",
                                    description: "Our network includes only the most qualified and thoroughly vetted healthcare providers."
                                },
                                {
                                    icon: (
                                        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center transition-colors duration-300">
                                            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    ),
                                    title: "Instant Booking",
                                    description: "See real-time availability and book appointments in just a few taps."
                                },
                                {
                                    icon: (
                                        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center transition-colors duration-300">
                                            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                    ),
                                    title: "Transparent Pricing",
                                    description: "No surprises. See costs upfront before you book your appointment."
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 * index }}
                                    viewport={{ once: true }}
                                    className="p-8 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md dark:hover:shadow-gray-700/50 transition-all duration-300"
                                >
                                    <div className="mb-5">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section ref={howItWorksRef} className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">How It Works</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
                                Getting the care you need has never been easier
                            </p>
                        </motion.div>

                        <div className="relative">
                            {/* Progress line */}
                            <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-emerald-200 dark:bg-emerald-700/50 transform -translate-x-1/2 transition-colors duration-300"></div>

                            <div className="space-y-16 md:space-y-0">
                                {[
                                    {
                                        step: "1",
                                        title: "Find Your Doctor",
                                        description: "Search our network of verified healthcare providers by specialty, location, or availability.",
                                        icon: (
                                            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        step: "2",
                                        title: "Book an Appointment",
                                        description: "Select your preferred time slot and book instantly with our real-time scheduling system.",
                                        icon: (
                                            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        step: "3",
                                        title: "Get Treated",
                                        description: "Attend your appointment and receive exceptional care from top healthcare professionals.",
                                        icon: (
                                            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )
                                    }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 * index }}
                                        viewport={{ once: true }}
                                        className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:text-right md:flex-row-reverse' : ''}`}
                                    >
                                        <div className={`md:w-1/2 p-6 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4 transition-colors duration-300">
                                                {item.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{item.description}</p>
                                        </div>
                                        <div className="hidden md:block w-1/2 p-6">
                                            <div className="flex justify-center">
                                                <div className="text-6xl font-bold text-gray-200 dark:text-gray-700 transition-colors duration-300">{item.step}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">What Our Patients Say</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
                                Don't just take our word for it - hear from people who've used our platform
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Asmae Omari",
                                    role: "Patient",
                                    quote: "Finding a specialist was so easy with Medora. I booked an appointment the same day and got the treatment I needed quickly.",
                                    rating: 5,
                                    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                                },
                                {
                                    name: "Mohamed SALAH",
                                    role: "Patient",
                                    quote: "The transparent pricing saved me from unexpected bills. Finally a healthcare platform that puts patients first!",
                                    rating: 4.7,
                                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                                },
                                {
                                    name: "Dr. Sophia Berrada",
                                    role: "Cardiologist",
                                    quote: "As a provider, Medora has helped me manage my practice more efficiently while connecting me with patients who need my expertise.",
                                    rating: 5,
                                    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                                }
                            ].map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 * index }}
                                    viewport={{ once: true }}
                                    className="p-8 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md dark:hover:shadow-gray-700/50 transition-all duration-300"
                                >
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 italic transition-colors duration-300">"{testimonial.quote}"</p>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-emerald-600 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to take control of your health?</h2>
                            <p className="text-lg mb-8 max-w-2xl mx-auto">
                                Join thousands of patients who've found better healthcare through our platform.
                            </p>
                            <button
                                onClick={() => setIsMapOpen(true)}
                                className="px-8 py-3.5 bg-white text-emerald-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                            >
                                Get Started Today
                            </button>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    );
}