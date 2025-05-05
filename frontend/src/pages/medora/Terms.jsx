/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
    const terms = [
        {
            title: "Acceptance of Terms",
            content: "By accessing and using Medora Health's services, you agree to be bound by these Terms of Service and all applicable laws and regulations."
        },
        {
            title: "User Responsibilities",
            content: "You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must provide accurate and complete information when creating an account."
        },
        {
            title: "Medical Disclaimer",
            content: "The information provided through our platform is for general informational purposes only and should not be considered as a substitute for professional medical advice. Always consult with qualified healthcare providers."
        },
        {
            title: "Service Modifications",
            content: "We reserve the right to modify or discontinue our services at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service."
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
                            Terms of Service
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Please read these terms carefully before using our services
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {terms.map((term, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                {term.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {term.content}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
