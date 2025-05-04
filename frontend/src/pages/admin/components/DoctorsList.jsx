/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
    UserGroupIcon, CheckCircleIcon, XCircleIcon,
    PencilSquareIcon, ArrowPathIcon, ClockIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function DoctorsList() {
    const { darkMode } = useDarkMode();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/doctors');
            if (response.data.doctors) {
                setDoctors(response.data.doctors);
            }
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch doctors:', err);
            setError(err.response?.data?.error || 'Failed to load doctors');
            setLoading(false);
        }
    };

    const handleDoctorAction = async (doctorId, action) => {
        try {
            await api.put(`/admin/doctors/${doctorId}/verify`, { action });
            setDoctors(doctors.map(doctor =>
                doctor.id === doctorId ? {
                    ...doctor,
                    is_verified: action === 'verify' ? 1 : 0
                } : doctor
            ));
        } catch (err) {
            console.error(`Failed to ${action} doctor:`, err);
            alert(`Failed to ${action} doctor. Please try again.`);
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        if (filter === 'verified') return doctor.is_verified === 1;
        if (filter === 'pending') return doctor.is_verified === 0;
        return true;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 p-4 rounded-xl text-red-700 dark:text-red-400 mb-6">
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold dark:text-white">Doctor Management</h2>
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <div className="flex rounded-md shadow-sm">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1 text-sm font-medium rounded-l-md ${filter === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('verified')}
                                className={`px-3 py-1 text-sm font-medium ${filter === 'verified' ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                Verified
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-3 py-1 text-sm font-medium rounded-r-md ${filter === 'pending' ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                Pending
                            </button>
                        </div>
                        <button
                            onClick={fetchDoctors}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <ArrowPathIcon className="h-4 w-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {filteredDoctors.length === 0 ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-xl text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
                            <p className="text-yellow-700 dark:text-yellow-400">
                                No {filter === 'all' ? '' : filter} doctors found
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Doctor
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Speciality
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Registered
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredDoctors.map((doctor) => (
                                    <tr key={doctor.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={doctor.profile_picture}
                                                        alt={doctor.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/images/no-photo.png';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {doctor.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {doctor.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {doctor.speciality}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {doctor.is_verified === 1 ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                                                    <ClockIcon className="h-3 w-3 mr-1" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(doctor.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {doctor.is_verified === 0 ? (
                                                    <>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleDoctorAction(doctor.id, 'verify')}
                                                            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                                                            title="Verify Doctor"
                                                        >
                                                            <CheckCircleIcon className="h-5 w-5" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleDoctorAction(doctor.id, 'reject')}
                                                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                                            title="Reject Doctor"
                                                        >
                                                            <XCircleIcon className="h-5 w-5" />
                                                        </motion.button>
                                                    </>
                                                ) : (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDoctorAction(doctor.id, 'reject')}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                                        title="Revoke Verification"
                                                    >
                                                        <XCircleIcon className="h-5 w-5" />
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                    title="Edit Doctor"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}