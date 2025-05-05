import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    CalendarIcon, ChartBarIcon, UserGroupIcon,
    DocumentTextIcon, CurrencyDollarIcon, ClockIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AvailabilityCalendar from '../../components/doctor/AvailabilityCalendar';

export default function DoctorDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        stats: {},
        today_appointments: [],
        doctor: {}
    });
    const [availabilities, setAvailabilities] = useState([]);

    useEffect(() => {
        fetchDashboardData();
        fetchAvailabilities();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/doctor/dashboard');
            setDashboardData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailabilities = async () => {
        try {
            const response = await api.get('/doctor/availabilities');
            setAvailabilities(response.data.availabilities);
        } catch (err) {
            console.error('Failed to fetch availabilities:', err);
        }
    };

    const handleDeleteAvailability = async (id, deleteAll = false) => {
        try {
            await api.delete(`/doctor/availabilities/${id}`, {
                params: { delete_all: deleteAll }
            });

            if (deleteAll) {
                // Remove all matching day availabilities
                const targetDay = availabilities.find(a => a.id === id)?.day_of_week;
                setAvailabilities(availabilities.filter(a => a.day_of_week !== targetDay));
            } else {
                // Remove only the specific availability
                setAvailabilities(availabilities.filter(a => a.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete availability:', err);
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
            name: 'Total Patients',
            value: dashboardData.stats.total_patients,
            icon: UserGroupIcon,
            color: "blue"
        },
        {
            name: 'Total Prescriptions',
            value: dashboardData.stats.total_prescriptions,
            icon: DocumentTextIcon,
            color: "purple"
        },
        {
            name: 'Pending Appointments',
            value: dashboardData.stats.pending_appointments,
            icon: ClockIcon,
            color: "yellow"
        },
        {
            name: 'Total Revenue',
            value: `${dashboardData.stats.total_revenue} dh`,
            icon: CurrencyDollarIcon,
            color: "green"
        },
        {
            name: 'Satisfaction Rate',
            value: dashboardData.stats.satisfaction_rate,
            icon: ChartBarIcon,
            color: "pink"
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctor Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/doctor/profile"
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                        >
                            {dashboardData.doctor.profile_picture ? (
                                <img
                                    src={dashboardData.doctor.profile_picture}
                                    alt=""
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <UserGroupIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            )}
                            <span>{dashboardData.doctor.name}</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg"
                        >
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                                        <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                {stat.name}
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                    {stat.value}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8"
                >
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today's Appointments</h3>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden">
                        {dashboardData.today_appointments.length > 0 ? (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {dashboardData.today_appointments.map((appointment) => (
                                    <li key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                    {appointment.patient_name}
                                                </div>
                                                <div className="ml-2 flex-shrink-0 flex space-x-2">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                        {appointment.time}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                        {appointment.reason}
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                                        {appointment.price} dh
                                                    </span>
                                                <button 
                                                    className="text-sm px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full transition-colors dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 dark:text-emerald-200"
                                                    onClick={() => {window.location.href = `/doctor/Appointment/${appointment.id}`; }}
                                                    >
                                                    Details
                                                </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                No appointments scheduled for today
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg"
                >
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link
                                to="/doctor/prescriptions/new"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:ring-offset-gray-900"
                            >
                                New Prescription
                            </Link>
                            <Link
                                to="/doctor/patients"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-900"
                            >
                                View Patients
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mt-8"
                >
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Availability Schedule</h3>
                    </div>
                    <div className="p-6">
                        <AvailabilityCalendar
                            availabilities={availabilities}
                            onAddAvailability={async (data) => {
                                try {
                                    const response = await api.post('/doctor/availabilities', data);
                                    setAvailabilities([...availabilities, response.data.availability]);
                                } catch (err) {
                                    console.error('Failed to add availability:', err);
                                }
                            }}
                            onDeleteAvailability={handleDeleteAvailability}
                        />
                    </div>
                </motion.div>
            </main>
        </div>
    );
}