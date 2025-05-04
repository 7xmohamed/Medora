/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../../services/api';
import ContactMessagesSection from '../sections/ContactMessagesSection';
import {
    UsersIcon,
    UserGroupIcon,
    ClipboardDocumentIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar
} from 'recharts';

export default function Overview() {
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

    const [reservationStats, setReservationStats] = useState([]);
    const [doctorSpecialties, setDoctorSpecialties] = useState([]);
    const [monthlyUsers, setMonthlyUsers] = useState([]);

    useEffect(() => {
        fetchDashboardData();
        fetchContactMessages();
        fetchReservationStats();
        fetchDoctorSpecialties();
        fetchMonthlyUsers();
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

    const fetchReservationStats = async () => {
        try {
            const response = await api.get('/admin/reservation-stats');
            setReservationStats(response.data.stats);
        } catch (err) {
            console.error('Failed to fetch reservation stats:', err);
        }
    };

    const fetchDoctorSpecialties = async () => {
        try {
            const response = await api.get('/admin/doctor-specialties');
            setDoctorSpecialties(response.data.specialties);
        } catch (err) {
            console.error('Failed to fetch doctor specialties:', err);
        }
    };

    const fetchMonthlyUsers = async () => {
        try {
            const response = await api.get('/admin/monthly-users');
            setMonthlyUsers(response.data.users);
        } catch (err) {
            console.error('Failed to fetch monthly users:', err);
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

    const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];

    return (
        <>
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

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Monthly Users Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
                        >
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">User Growth</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyUsers}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#10B981"
                                            fill="#10B981"
                                            fillOpacity={0.2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Doctor Specialties Distribution */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
                        >
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">Doctor Specialties</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={doctorSpecialties}
                                            dataKey="count"
                                            nameKey="specialty"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label
                                        >
                                            {doctorSpecialties.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Reservation Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
                        >
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">Reservation Statistics</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={reservationStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="confirmed" fill="#10B981" name="Confirmed" />
                                        <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                                        <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
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
        </>
    );
}