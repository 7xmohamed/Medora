/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    ChartPieIcon, UsersIcon, UserGroupIcon, EnvelopeIcon,
    Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Layout/Navbar';

const navigation = [
    { name: 'Overview', href: '/admin/dashboard', icon: ChartPieIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Doctors', href: '/admin/doctors', icon: UserGroupIcon },
    { name: 'Messages', href: '/admin/messages', icon: EnvelopeIcon },
];

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            {/* Mobile menu button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden fixed bottom-6 right-6 z-50 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
                aria-label="Toggle menu"
            >
                {isSidebarOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                ) : (
                    <Bars3Icon className="h-6 w-6" />
                )}
            </button>

            <div className="flex">
                {/* Sidebar for mobile */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black md:hidden z-40"
                                onClick={() => setIsSidebarOpen(false)}
                            />
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'tween' }}
                                className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 md:hidden"
                            >
                                <AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Sidebar for desktop */}
                <div className="hidden md:block w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <AdminSidebar />
                </div>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 mt-16 md:ml-64 transition-all duration-300">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

// Separate sidebar component for reusability
function AdminSidebar({ closeSidebar }) {
    return (
        <nav className="p-4 space-y-2">
            {navigation.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`
                    }
                >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.name}</span>
                </NavLink>
            ))}
        </nav>
    );
}