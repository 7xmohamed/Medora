import React, { useEffect, useState } from 'react';
import {
    UsersIcon,
    UserGroupIcon,
    ClipboardDocumentIcon,
    HomeIcon,
    CogIcon,
    BellIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
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
            color: 'green'
        },
        {
            name: 'Patients',
            value: stats.totalPatients,
            icon: ClipboardDocumentIcon,
            color: 'purple'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <BellIcon className="h-6 w-6 text-gray-500" />
                        <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full" src="https://placehold.co/100" alt="Admin" />
                            <span className="ml-2 text-sm font-medium">Admin User</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error ? (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
                            {userStats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`bg-white overflow-hidden shadow rounded-lg border-l-4 border-${stat.color}-500`}
                                >
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className={`flex-shrink-0 rounded-full bg-${stat.color}-100 p-3`}>
                                                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                                                    <dd className="flex items-baseline">
                                                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity Section */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                            </div>
                            <div className="px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <button
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <UsersIcon className="-ml-1 mr-2 h-5 w-5" />
                                        Manage Users
                                    </button>
                                    <button
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <UserGroupIcon className="-ml-1 mr-2 h-5 w-5" />
                                        Manage Doctors
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}