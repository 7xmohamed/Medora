/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    CalendarIcon, ChartBarIcon, UserGroupIcon,
    CurrencyDollarIcon, StarIcon, ClockIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import api from '../../services/api';
import AvailabilityCalendar from '../../components/doctor/AvailabilityCalendar';
import AppointmentsList from '../../components/doctor/AppointmentsList';
import RecentPatientsList from '../../components/doctor/RecentPatientsList';

const AppointmentStatus = ({ status }) => {
    const statusConfig = {
        pending: {
            className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
            icon: <FiClock className="w-4 h-4 mr-1.5" />,
            text: "Pending"
        },
        confirmed: {
            className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
            icon: <FiCheckCircle className="w-4 h-4 mr-1.5" />,
            text: "Confirmed"
        },
        canceled: {
            className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
            icon: <FiXCircle className="w-4 h-4 mr-1.5" />,
            text: "Canceled"
        }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
            {config.icon}
            {config.text}
        </span>
    );
};

export default function DoctorDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        stats: {},
        today_appointments: [],
        upcoming_appointments: [],
        past_appointments: [],
        recent_patients: [],
        doctor: {}
    });
    const [availabilities, setAvailabilities] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/doctor/dashboard');
                if (response.data) {
                    setDashboardData(prev => ({
                        ...prev,
                        ...response.data,
                        stats: {
                            ...prev.stats,
                            ...response.data.stats,
                            monthly_revenue: response.data.stats.monthly_revenue || 0
                        }
                    }));
                }
                setError(null);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        const loadAvailabilities = async () => {
            try {
                const response = await api.get('/doctor/availabilities');
                if (response.data.success) {
                    setAvailabilities(response.data.availabilities);
                }
            } catch (err) {
                setError('Failed to fetch availabilities');
            }
        };

        loadAvailabilities();
    }, []); // Run once on mount

    const fetchAvailabilities = async () => {
        try {
            const response = await api.get('/doctor/availabilities');
            if (response.data.success) {
                setAvailabilities(response.data.availabilities);
            }
        } catch (err) {
            setError('Failed to fetch availabilities');
        }
    };

    const handleDeleteAvailability = async (id, deleteAll = false) => {
        try {
            await api.delete(`/doctor/availabilities/${id}`, {
                params: { delete_all: deleteAll }
            });
            // Refresh availabilities after deletion
            await fetchAvailabilities();
        } catch (err) {
            setError('Failed to delete availability');
        }
    };

    const handleAddAvailability = async (data) => {
        try {
            const response = await api.post('/doctor/availabilities', data);
            if (response.data.success) {
                // Refresh availabilities after addition
                await fetchAvailabilities();
            }
        } catch (err) {
            setError('Failed to add availability');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-red-500 flex items-center">
                    <ExclamationCircleIcon className="h-6 w-6 mr-2" />
                    {error}
                </div>
            </div>
        );
    }

    const stats = [
        {
            name: "Today's Appointments",
            value: dashboardData.stats.today_appointments,
            icon: CalendarIcon,
            color: "emerald"
        },
        {
            name: 'Weekly Appointments',
            value: dashboardData.stats.weekly_appointments,
            icon: CalendarIcon,
            color: "blue"
        },
        {
            name: 'Total Patients',
            value: dashboardData.stats.total_patients,
            icon: UserGroupIcon,
            color: "indigo"
        },
        {
            name: 'Monthly Revenue',
            value: `${dashboardData.stats?.monthly_revenue || 0} dh`,
            icon: CurrencyDollarIcon,
            color: "green"
        },
        {
            name: 'Completion Rate',
            value: `${Math.round(dashboardData.stats.completion_rate)}%`,
            icon: ChartBarIcon,
            color: "purple"
        },
        {
            name: 'Average Rating',
            value: dashboardData.stats.average_rating,
            icon: StarIcon,
            color: "yellow"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:px-8">
                {/* Stats Grid - More responsive */}
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex items-center sm:flex-col sm:h-full">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center sm:mb-3`}>
                                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                </div>
                                <div className="ml-3 sm:ml-0 sm:text-center">
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">
                                        {stat.name}
                                    </p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content - Better grid system */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {/* Left Column - Appointments */}
                    <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                        {/* Today's Schedule */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
                        >
                            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
                                    </div>
                                    <span className="px-2 py-1 sm:px-3 text-xs sm:text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full self-start sm:self-center">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <AppointmentsList
                                    appointments={dashboardData.today_appointments}
                                    showDate={false}
                                    compact={true}
                                />
                            </div>
                        </motion.div>

                        {/* Upcoming Appointments */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
                        >
                            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
                                    </div>
                                    <Link
                                        to="/doctor/appointments"
                                        className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <AppointmentsList
                                    appointments={dashboardData.upcoming_appointments}
                                    showDate={true}
                                />
                            </div>
                        </motion.div>

                        {/* Past Appointments Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
                        >
                            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Past Appointments</h2>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <AppointmentsList
                                    appointments={dashboardData.past_appointments}
                                    showDate={true}
                                    isPast={true}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 sm:space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm"
                        >
                            <RecentPatientsList patients={dashboardData.recent_patients} />
                        </motion.div>
                    </div>
                </div>

                {/* Calendar Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
                >
                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Working Hours</h2>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                Manage your weekly availability schedule
                            </p>
                        </div>
                    </div>
                    <div className="p-2 sm:p-6">
                        <div className="overflow-x-auto">
                            <AvailabilityCalendar
                                availabilities={availabilities}
                                onAddAvailability={handleAddAvailability}
                                onDeleteAvailability={handleDeleteAvailability}
                            />
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}