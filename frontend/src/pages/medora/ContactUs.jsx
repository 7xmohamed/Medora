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
        name: /^[a-zA-Z\u00C0-\u024F\u0400-\u04FF\s'-]{2,50}$/,
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
        // Clear error when user types
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
                // Handle Laravel validation errors
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
                                Contact Medora
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            We're here to help. Reach out to our team for any questions or support needs.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-xl bg-gray-900 border border-gray-800"
                    >
                        {submitSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Message Sent Successfully!</h2>
                                <p className="text-gray-300 mb-6">We'll get back to you as soon as possible.</p>
                                <button
                                    onClick={() => setSubmitSuccess(false)}
                                    className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-colors"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl md:text-3xl font-bold mb-8">Send Us a Message</h2>
                                {errors.submit && (
                                    <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
                                        {errors.submit}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} focus:border-cyan-500 focus:outline-none transition-colors`}
                                                required
                                                maxLength={50}
                                            />
                                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:border-cyan-500 focus:outline-none transition-colors`}
                                                required
                                                maxLength={100}
                                            />
                                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${errors.subject ? 'border-red-500' : 'border-gray-700'} focus:border-cyan-500 focus:outline-none transition-colors`}
                                            required
                                            maxLength={100}
                                        />
                                        {errors.subject && <p className="mt-1 text-sm text-red-400">{errors.subject}</p>}
                                    </div>
                                    <div className="mb-8">
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                                            Your Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-lg bg-gray-800 border ${errors.message ? 'border-red-500' : 'border-gray-700'} focus:border-cyan-500 focus:outline-none transition-colors`}
                                            required
                                            minLength={10}
                                            maxLength={1000}
                                        />
                                        {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${isSubmitting ? 'bg-cyan-700 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'} flex items-center justify-center`}
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
                            </>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}