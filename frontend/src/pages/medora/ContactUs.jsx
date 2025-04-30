// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '../../services/api';

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const validate = {
        name: /^[\p{L}\s'-]{2,50}$/u,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        subject: /^[\p{L}\d\s\-.,!?]{5,100}$/u,
        message: /^[\s\S]{10,1000}$/
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!validate.name.test(formData.name.trim())) {
            newErrors.name = 'Please enter a valid name (2-50 characters)';
        }

        if (!validate.email.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!validate.subject.test(formData.subject.trim())) {
            newErrors.subject = 'Subject must be 5-100 characters';
        }

        if (!validate.message.test(formData.message.trim())) {
            newErrors.message = 'Message must be 10-1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await api.post('/contact', {
                name: formData.name.trim(),
                email: formData.email.trim(),
                subject: formData.subject.trim(),
                message: formData.message.trim()
            });

            if (response.status === 200 || response.status === 201) {
                setSubmitSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            console.error('Contact form submission error:', error);

            if (error.response) {
                if (error.response.status === 422 && error.response.data.errors) {
                    const serverErrors = {};
                    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                        serverErrors[field] = messages[0];
                    });
                    setErrors(serverErrors);
                } else {
                    setErrors({ submit: error.response.data.message || 'Failed to send message' });
                }
            } else {
                setErrors({ submit: 'Network error. Please check your connection.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                Contact Us
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Our team is ready to assist you with any questions or support needs.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {submitSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Message Sent Successfully!</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">We'll get back to you within 24 hours.</p>
                            <button
                                onClick={() => setSubmitSuccess(false)}
                                className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 dark:hover:bg-emerald-500 shadow-md transition-all duration-300"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">Get In Touch</h2>
                            {errors.submit && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300">
                                    {errors.submit}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'} focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors dark:text-white`}
                                            required
                                            maxLength={50}
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'} focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors dark:text-white`}
                                            required
                                            maxLength={100}
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.subject ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'} focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors dark:text-white`}
                                        required
                                        maxLength={100}
                                    />
                                    {errors.subject && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>}
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Your Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'} focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors dark:text-white`}
                                        required
                                        minLength={10}
                                        maxLength={1000}
                                    />
                                    {errors.message && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-3.5 px-6 rounded-lg font-medium transition-colors ${isSubmitting ? 'bg-emerald-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500'} text-white shadow-md hover:shadow-lg flex items-center justify-center`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Email Us",
                                description: "For general inquiries and support",
                                contact: "support@medora.com",
                                icon: (
                                    <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                )
                            },
                            {
                                title: "Call Us",
                                description: "Available Monday-Friday, 8am-4pm",
                                contact: "+212 600000000",
                                icon: (
                                    <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                )
                            },
                            {
                                title: "Visit Us",
                                description: "Our headquarters location",
                                contact: "123 Healthcare Ave, Waha, MA 35000",
                                icon: (
                                    <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all text-center"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4 mx-auto">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-3">{item.description}</p>
                                <p className="text-emerald-600 dark:text-emerald-400 font-medium">{item.contact}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}