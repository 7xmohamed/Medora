/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function Faqs() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I book an appointment?",
            answer: "Booking an appointment is easy! Simply search for a doctor based on your location or specialty, select your preferred time slot, and confirm your booking. You can manage all your appointments from your patient dashboard."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept various payment methods including credit/debit cards and local payment options. All payments are processed securely through our platform."
        },
        {
            question: "Can I cancel or reschedule my appointment?",
            answer: "Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time through your patient dashboard without any penalty."
        },
        {
            question: "How do I become a verified doctor on Medora?",
            answer: "To become a verified doctor, you need to register and provide your medical credentials, licenses, and other required documentation. Our team will verify your information before activating your profile."
        },
        {
            question: "Is my medical information secure?",
            answer: "Yes, we take data security very seriously. All medical information is encrypted and stored securely following international healthcare data protection standards."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl mx-auto px-4 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Find answers to common questions about Medora Health
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full text-left px-6 py-4 flex items-center justify-between"
                            >
                                <h3 className="font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                                <FiChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'transform rotate-180' : ''}`} />
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-4">
                                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
