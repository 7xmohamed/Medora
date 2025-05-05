/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    const sections = [
        {
            title: "Information We Collect",
            content: "We collect information that you provide directly to us, including name, email address, phone number, and medical history. We also collect information about your usage of our services and any communications you have with us."
        },
        {
            title: "How We Use Your Information",
            content: "We use the information we collect to provide and improve our services, communicate with you, and ensure a personalized healthcare experience. Your information helps us match you with the right healthcare providers."
        },
        {
            title: "Information Security",
            content: "We implement appropriate security measures to protect your personal information. This includes encryption, secure servers, and regular security audits to ensure your data remains safe."
        },
        {
            title: "Sharing Your Information",
            content: "We only share your information with healthcare providers involved in your care and as required by law. We never sell your personal information to third parties."
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
                            Privacy Policy
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                {section.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
