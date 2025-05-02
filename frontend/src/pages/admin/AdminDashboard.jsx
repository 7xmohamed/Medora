/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
    UsersIcon, UserGroupIcon, ClipboardDocumentIcon,
    ChartBarIcon, CogIcon, BellIcon, ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import DarkModeToggle from '../../components/DarkModeToggle';
import ContactMessagesSection from './sections/ContactMessagesSection';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function AdminDashboard() {
    const { darkMode } = useDarkMode();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0
    });
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messagesError, setMessagesError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
        fetchContactMessages();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setStats({
                totalUsers: response.data.total_users,
                totalDoctors: response.data.total_doctors,
                totalPatients: response.data.total_patients
            });
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err.response?.data?.error || 'Failed to load dashboard data');
            setLoading(false);
        }
    };

    const fetchContactMessages = async () => {
        try {
            const response = await api.get('/admin/contact-messages');
            if (response.data.messages) {
                setMessages(response.data.messages);
            }
            setMessagesLoading(false);
        } catch (err) {
            console.error('Failed to fetch contact messages:', err);
            setMessagesError(err.response?.data?.error || 'Failed to load contact messages');
            setMessagesLoading(false);
        }
    };

    const handleMessageDeleted = (deletedId) => {
        setMessages(messages.filter(message => message.id !== deletedId));
    };

    const userStats = [
        {
            name: 'Total Users',
            value: stats.totalUsers,
            icon: UsersIcon,
            color: 'blue'
        },
        {
            name: 'Doctors',
            value: stats.totalDoctors,
            icon: UserGroupIcon,
            color: 'emerald'
        },
        {
            name: 'Patients',
            value: stats.totalPatients,
            icon: ClipboardDocumentIcon,
            color: 'indigo'
        }
    ];

    const sidebarLinks = [
        { name: 'Overview', icon: ChartBarIcon, active: true },
        { name: 'Users', icon: UsersIcon },
        { name: 'Doctors', icon: UserGroupIcon },
        { name: 'Settings', icon: CogIcon }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Navbar />
                <div className="flex pt-16">
                    {/* Sidebar */}
                    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 z-30">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">M</span>
                            </div>
                            <span className="text-xl font-bold dark:text-white">Medora Admin</span>
                        </div>

                        <nav className="space-y-2">
                            {sidebarLinks.map((link) => (
                                <motion.button
                                    key={link.name}
                                    whileHover={{ x: 4 }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                        ${link.active
                                            ? 'bg-emerald-100 dark:bg-gray-700 text-emerald-700 dark:text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-gray-700/50'}`}
                                >
                                    <link.icon className="h-5 w-5" />
                                    {link.name}
                                </motion.button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content Wrapper */}
                    <div className="flex-1 pl-64">
                        {/* Header */}
                        <header className="sticky top-0 z-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
                            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                                <h1 className="text-2xl font-bold dark:text-white">Dashboard Overview</h1>
                                <div className="flex items-center space-x-4">
                                    <DarkModeToggle />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                    </motion.button>
                                </div>
                            </div>
                        </header>

                        {/* Main Content Area */}
                        <main className="py-8">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                {error ? (
                                    <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 p-4 rounded-xl text-red-700 dark:text-red-400 mb-6">
                                        <p className="text-sm">{error}</p>
                                    </div>
                                ) : loading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
                                            {userStats.map((stat, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors shadow-sm hover:shadow-md"
                                                >
                                                    <div className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                                                <stat.icon className="h-6 w-6" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-2xl font-semibold dark:text-white">{stat.value}</p>
                                                                    <span className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center">
                                                                        <ArrowTrendingUpIcon className="h-3 w-3 mr-0.5" />
                                                                        12%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm">
                                            <div className="p-6">
                                                <h3 className="text-lg font-semibold dark:text-white mb-4">Quick Actions</h3>
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all text-white"
                                                    >
                                                        <UsersIcon className="h-5 w-5" />
                                                        Manage Users
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all text-white"
                                                    >
                                                        <UserGroupIcon className="h-5 w-5" />
                                                        Manage Doctors
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Content Section */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                            {/* Recent Activity */}
                                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                                                <h3 className="text-lg font-semibold dark:text-white mb-4">Recent Activity</h3>
                                                <div className="space-y-4">
                                                    {[1, 2, 3].map((_, i) => (
                                                        <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                            <div>
                                                                <p className="text-sm dark:text-gray-200">New doctor registration</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* System Status */}
                                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                                                <h3 className="text-lg font-semibold dark:text-white mb-4">System Status</h3>
                                                <div className="space-y-4">
                                                    {[
                                                        { name: 'Server Status', status: 'Operational', color: 'emerald' },
                                                        { name: 'API Health', status: 'Good', color: 'emerald' },
                                                        { name: 'Database', status: 'Stable', color: 'emerald' }
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                                            <span className="text-sm dark:text-gray-200">{item.name}</span>
                                                            <span className={`text-xs px-2 py-1 rounded-full bg-${item.color}-100 dark:bg-${item.color}-500/10 text-${item.color}-600 dark:text-${item.color}-400`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Messages Section */}
                                        <div className="mb-8">
                                            <ContactMessagesSection
                                                messages={messages}
                                                loading={messagesLoading}
                                                error={messagesError}
                                                onMessageDeleted={handleMessageDeleted}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}