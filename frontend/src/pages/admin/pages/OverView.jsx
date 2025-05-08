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
    Legend
} from 'recharts';


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {new Date(label).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </p>
                <div className="space-y-1">
                    <p className="font-semibold text-emerald-600">
                        Total Users: {payload[0].value}
                    </p>
                    <p className="text-sm text-blue-600">
                        Growth Rate: {payload[1]?.value?.toFixed(1)}%
                    </p>
                    <div className="flex gap-2 text-xs mt-1">
                        <span className="text-emerald-500">Doctors: {payload[0].payload.doctors}</span>
                        <span className="text-indigo-500">Patients: {payload[0].payload.patients}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const ReservationTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const total = payload.reduce((sum, item) => sum + item.value, 0);
        return (
            <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                    {new Date(label).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                </p>
                <div className="space-y-1.5">
                    {payload.map((item, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <span className={`
                                ${item.name === 'confirmed' ? 'text-emerald-600' :
                                    item.name === 'pending' ? 'text-yellow-600' : 'text-red-600'} 
                                capitalize
                            `}>
                                {item.name}
                            </span>
                            <span className="font-medium">{item.value}</span>
                        </div>
                    ))}
                    <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
                        <div className="flex items-center justify-between font-medium">
                            <span className="text-blue-600">Total</span>
                            <span>{total}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

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
    const [userGrowthSummary, setUserGrowthSummary] = useState({});
    const [reservationSummary, setReservationSummary] = useState({});

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
            if (response.data.success) {
                setReservationStats(response.data.data.daily || []);
                setReservationSummary({
                    ...response.data.data.summary,
                    today: response.data.data.today,
                    monthly: response.data.data.monthly
                });
            } else {
                throw new Error(response.data.error || 'Failed to fetch stats');
            }
        } catch (err) {
            console.error('Failed to fetch reservation stats:', err);
            setReservationStats([]);
            setReservationSummary({
                today: { confirmed: 0, pending: 0, cancelled: 0, total: 0 },
                monthly: { confirmed: 0, pending: 0, cancelled: 0, total: 0 },
                avgConfirmationRate: 0,
                avgCancellationRate: 0
            });
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
            if (response.data.success) {
                setMonthlyUsers(response.data.data.users || []);
                setUserGrowthSummary(response.data.data.summary || {
                    totalUsers: 0,
                    totalDoctors: 0,
                    totalPatients: 0,
                    averageGrowth: 0,
                    lastMonthGrowth: 0,
                    growthTrend: 0,
                    doctorPatientRatio: 0
                });
            } else {
                throw new Error(response.data.error || 'Failed to fetch data');
            }
        } catch (err) {
            console.error('Failed to fetch monthly users:', err);
            setMonthlyUsers([]);
            setUserGrowthSummary({
                totalUsers: 0,
                totalDoctors: 0,
                totalPatients: 0,
                averageGrowth: 0,
                lastMonthGrowth: 0,
                growthTrend: 0,
                doctorPatientRatio: 0
            });
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
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                                    <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-500" />
                                    User Growth Analytics
                                </h3>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={monthlyUsers}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            opacity={0.1}
                                            vertical={false}
                                            stroke="#E5E7EB"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                            tickFormatter={(value) => new Date(value).toLocaleDateString('default', {
                                                month: 'short',
                                                year: '2-digit'
                                            })}
                                            axisLine={{ stroke: '#E5E7EB' }}
                                            dy={10}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                            axisLine={{ stroke: '#E5E7EB' }}
                                            tickLine={{ stroke: '#E5E7EB' }}
                                            tickFormatter={(value) => value.toLocaleString()}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                            axisLine={{ stroke: '#E5E7EB' }}
                                            tickLine={{ stroke: '#E5E7EB' }}
                                            domain={[-100, 100]}
                                            tickFormatter={(value) => `${value}%`}
                                        />
                                        <Tooltip content={CustomTooltip} />
                                        <Area
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="count"
                                            name="Users"
                                            stroke="#10B981"
                                            strokeWidth={3}
                                            fill="url(#colorUsers)"
                                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 8, strokeWidth: 0 }}
                                        />
                                        <Area
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="growthRate"
                                            name="Growth"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            fill="url(#colorGrowth)"
                                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 8, strokeWidth: 0 }}
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
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                                        <ClipboardDocumentIcon className="h-5 w-5 text-blue-500" />
                                        Reservation Analytics
                                    </h3>
                                    <div className="text-sm bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
                                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                            Success Rate: {reservationSummary.avgConfirmationRate}%
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <MetricCard
                                        label="Monthly Confirmed"
                                        value={reservationSummary?.monthly?.confirmed || 0}
                                        colorClass="text-emerald-600"
                                        bgClass="bg-emerald-50 dark:bg-emerald-500/10"
                                    />
                                    <MetricCard
                                        label="Monthly Pending"
                                        value={reservationSummary?.monthly?.pending || 0}
                                        colorClass="text-yellow-600"
                                        bgClass="bg-yellow-50 dark:bg-yellow-500/10"
                                    />
                                    <MetricCard
                                        label="Monthly Cancelled"
                                        value={reservationSummary?.monthly?.cancelled || 0}
                                        colorClass="text-red-600"
                                        bgClass="bg-red-50 dark:bg-red-500/10"
                                    />
                                    <MetricCard
                                        label="Monthly Total"
                                        value={reservationSummary?.monthly?.total || 0}
                                        colorClass="text-blue-600"
                                        bgClass="bg-blue-50 dark:bg-blue-500/10"
                                    />
                                </div>
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

const StatsCard = ({ label, value, trend, subtitle, icon, valueClassName = '' }) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
            {icon}
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        <p className={`text-xl font-semibold ${valueClassName || 'dark:text-white'}`}>
            {value}
            {trend && (
                <span className={`text-sm ml-2 ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    ({trend >= 0 ? '+' : ''}{trend.toFixed(1)}%)
                </span>
            )}
        </p>
        {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
    </div>
);

const MetricCard = ({ label, value, colorClass, bgClass }) => (
    <div className={`p-4 rounded-lg ${bgClass}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-xl font-semibold ${colorClass}`}>
            {value}
        </p>
    </div>
);