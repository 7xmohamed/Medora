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
                setReservationSummary(response.data.data.summary || {});
            } else {
                throw new Error(response.data.error || 'Failed to fetch stats');
            }
        } catch (err) {
            console.error('Failed to fetch reservation stats:', err);
            setReservationStats([]);
            setReservationSummary({
                total: 0,
                confirmed: 0,
                pending: 0,
                cancelled: 0,
                confirmation_rate: 0,
                cancellation_rate: 0
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
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold dark:text-white">User Growth Analytics</h3>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <span>Growth Trend:</span>
                                            <span className={`font-medium ${(userGrowthSummary?.growthTrend || 0) >= 0
                                                ? 'text-emerald-500'
                                                : 'text-red-500'}`}>
                                                {userGrowthSummary?.growthTrend?.toFixed(2) || '0.00'}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {userGrowthSummary.totalUsers || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Doctor/Patient Ratio</p>
                                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {userGrowthSummary.doctorPatientRatio || 0}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">3-Month Trend</p>
                                        <p className="text-xl font-semibold capitalize text-gray-900 dark:text-white">
                                            {userGrowthSummary.lastThreeMonths?.trend || 'stable'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyUsers}>
                                        <defs>
                                            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fill: '#6B7280' }}
                                            tickFormatter={(value) => {
                                                const date = new Date(value);
                                                return date.toLocaleDateString('default', { month: 'short' });
                                            }}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            tick={{ fill: '#6B7280' }}
                                            label={{ value: 'Users', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            tick={{ fill: '#6B7280' }}
                                            label={{ value: 'Growth %', angle: 90, position: 'insideRight', fill: '#6B7280' }}
                                        />
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                                                            <p className="text-gray-600 dark:text-gray-400">{payload[0].payload.month}</p>
                                                            <p className="font-semibold text-emerald-600">Users: {payload[0].payload.count}</p>
                                                            <p className="font-semibold text-blue-600">Growth: {payload[0].payload.growthRate}%</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#10B981"
                                            fill="url(#colorGrowth)"
                                            dot={{ fill: '#10B981' }}
                                        />
                                        <Area
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="growthRate"
                                            stroke="#3B82F6"
                                            fill="none"
                                            dot={{ fill: '#3B82F6' }}
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
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold dark:text-white">Reservation Analytics</h3>
                                    <div className="text-sm">
                                        <div className="font-medium text-emerald-600">
                                            Best Performance: {' '}
                                            {reservationSummary.bestPerformance?.date &&
                                                `${new Date(reservationSummary.bestPerformance.date).toLocaleDateString()} 
                                                (${reservationSummary.bestPerformance.rate}% success)`
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                    <MetricCard
                                        label="Success Rate"
                                        value={`${reservationSummary.avgConfirmationRate || 0}%`}
                                        colorClass="text-emerald-600"
                                    />
                                    <MetricCard
                                        label="Pending Rate"
                                        value={`${reservationSummary.avgPendingRate || 0}%`}
                                        colorClass="text-yellow-600"
                                    />
                                    <MetricCard
                                        label="Cancel Rate"
                                        value={`${reservationSummary.avgCancellationRate || 0}%`}
                                        colorClass="text-red-600"
                                    />
                                    <MetricCard
                                        label="Total"
                                        value={reservationSummary.totalReservations || 0}
                                        colorClass="text-blue-600"
                                    />
                                </div>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={reservationStats || []}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fill: '#6B7280' }}
                                            tickFormatter={(value) => new Date(value).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                                        />
                                        <YAxis
                                            tick={{ fill: '#6B7280' }}
                                            label={{
                                                value: 'Number of Reservations',
                                                angle: -90,
                                                position: 'insideLeft',
                                                fill: '#6B7280'
                                            }}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                                                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                                                {new Date(label).toLocaleDateString()}
                                                            </p>
                                                            {payload.map((item, index) => (
                                                                <p
                                                                    key={index}
                                                                    className={`${item.name === 'confirmed' ? 'text-emerald-600' :
                                                                        item.name === 'pending' ? 'text-yellow-600' :
                                                                            'text-red-600'
                                                                        } font-medium`}
                                                                >
                                                                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}: {item.value}
                                                                </p>
                                                            ))}
                                                            <p className="text-blue-600 font-medium mt-2">
                                                                Total: {payload.reduce((sum, item) => sum + item.value, 0)}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="confirmed"
                                            stackId="a"
                                            fill="#10B981"
                                            name="Confirmed"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="pending"
                                            stackId="a"
                                            fill="#F59E0B"
                                            name="Pending"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="cancelled"
                                            stackId="a"
                                            fill="#EF4444"
                                            name="Cancelled"
                                            radius={[4, 4, 0, 0]}
                                        />
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

const MetricCard = ({ label, value, colorClass }) => (
    <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-xl font-semibold ${colorClass}`}>
            {value}
        </p>
    </div>
);