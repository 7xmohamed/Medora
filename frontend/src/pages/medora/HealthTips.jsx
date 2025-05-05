/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaBrain, FaAppleAlt, FaRunning, FaLungs, FaBed, FaSmile, FaTint, FaShieldAlt } from 'react-icons/fa';

export default function HealthTips() {
    const tips = [
        {
            icon: <FaHeart />,
            title: "Heart Health",
            tips: [
                "Exercise regularly for at least 30 minutes daily",
                "Maintain a balanced diet low in saturated fats",
                "Monitor your blood pressure regularly",
                "Get adequate sleep each night"
            ]
        },
        {
            icon: <FaBrain />,
            title: "Mental Wellness",
            tips: [
                "Practice mindfulness or meditation",
                "Maintain social connections",
                "Take regular breaks during work",
                "Seek professional help when needed"
            ]
        },
        {
            icon: <FaAppleAlt />,
            title: "Nutrition",
            tips: [
                "Eat plenty of fruits and vegetables",
                "Stay hydrated throughout the day",
                "Limit processed food intake",
                "Include protein in every meal"
            ]
        },
        {
            icon: <FaRunning />,
            title: "Physical Activity",
            tips: [
                "Take regular walking breaks",
                "Do strength training twice a week",
                "Practice flexibility exercises",
                "Find activities you enjoy"
            ]
        },
        {
            icon: <FaLungs />,
            title: "Respiratory Health",
            tips: [
                "Avoid smoking and secondhand smoke",
                "Practice deep breathing exercises",
                "Stay away from air pollutants",
                "Use a mask in dusty or polluted environments"
            ]
        },
        {
            icon: <FaBed />,
            title: "Sleep Hygiene",
            tips: [
                "Stick to a regular sleep schedule",
                "Avoid screens 1 hour before bedtime",
                "Keep your bedroom dark and cool",
                "Limit caffeine intake in the evening"
            ]
        },
        {
            icon: <FaSmile />,
            title: "Emotional Wellbeing",
            tips: [
                "Express gratitude daily",
                "Engage in hobbies you love",
                "Talk about your feelings openly",
                "Accept that it's okay to not be okay"
            ]
        },
        {
            icon: <FaTint />,
            title: "Hydration",
            tips: [
                "Start your day with a glass of water",
                "Carry a water bottle with you",
                "Drink water before meals",
                "Limit sugary and caffeinated drinks"
            ]
        },
        {
            icon: <FaShieldAlt />,
            title: "Immune Support",
            tips: [
                "Get enough vitamin C and D",
                "Avoid excessive stress",
                "Stay physically active",
                "Practice good hygiene"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-6xl mx-auto px-4 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                            Health Tips & Wellness Guide
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Expert advice for maintaining your physical and mental well-being
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tips.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    {section.icon}
                                </div>
                                <h2 className="text-xl font-semibold ml-4 text-gray-900 dark:text-white">
                                    {section.title}
                                </h2>
                            </div>
                            <ul className="space-y-3">
                                {section.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                                        <div className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full mr-3"></div>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
