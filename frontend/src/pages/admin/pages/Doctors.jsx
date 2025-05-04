/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { UserCircleIcon, TrashIcon, ShieldCheckIcon, ShieldExclamationIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/doctors');

            if (!response.data.success) {
                throw new Error('Failed to fetch doctors');
            }

            setDoctors(response.data.doctors.map(doctor => ({
                ...doctor,
                is_verified: Boolean(doctor.is_verified)
            })));
            setError(null);
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError(err.response?.data?.error || 'Failed to fetch doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationToggle = async (doctorId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'remove verification' : 'verify'} this doctor?`)) {
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await api.patch(`/admin/doctors/${doctorId}/verify`, {
                verified: !currentStatus
            });

            if (!response.data.success) {
                throw new Error('Failed to update doctor status');
            }

            setDoctors(prev => prev.map(doctor =>
                doctor.id === doctorId ? { ...doctor, is_verified: !currentStatus } : doctor
            ));

            setSelectedDoctor(prev => prev?.id === doctorId ?
                { ...prev, is_verified: !currentStatus } : prev
            );

            alert('Doctor verification status updated successfully');

        } catch (err) {
            console.error('Error updating doctor status:', err);
            alert(err.response?.data?.error || 'Failed to update doctor status');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (doctorId) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;

        try {
            await api.delete(`/admin/doctors/${doctorId}`);
            setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
            setSelectedDoctor(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete doctor');
        }
    };

    const DoctorDetailsModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold dark:text-white">Doctor Details</h3>
                    <button
                        onClick={() => setSelectedDoctor(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="flex items-center space-x-4">
                        {selectedDoctor?.profile_picture ? (
                            <img
                                src={selectedDoctor.profile_picture}
                                alt={selectedDoctor.name}
                                className="h-20 w-20 rounded-full object-cover"
                            />
                        ) : (
                            <UserCircleIcon className="h-20 w-20 text-gray-400" />
                        )}
                        <div>
                            <h4 className="text-xl font-semibold dark:text-white">{selectedDoctor?.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400">{selectedDoctor?.email}</p>
                            <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm
                                ${selectedDoctor?.is_verified
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}
                            >
                                {selectedDoctor?.is_verified ? 'Verified' : 'Pending Verification'}
                            </div>
                        </div>
                    </div>

                    {/* Professional Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Specialty</p>
                            <p className="font-medium dark:text-white">{selectedDoctor?.speciality}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">NIOM Number</p>
                            <p className="font-medium dark:text-white">{selectedDoctor?.niom}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                            <p className="font-medium dark:text-white">{selectedDoctor?.experience}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Education</p>
                            <p className="font-medium dark:text-white">{selectedDoctor?.education || 'N/A'}</p>
                        </div>
                    </div>

                    {/* ID Cards */}
                    <div>
                        <h5 className="font-semibold mb-3 dark:text-white">Verification Documents</h5>
                        <div className="grid grid-cols-2 gap-4">
                            {selectedDoctor?.id_card_front && (
                                <a
                                    href={selectedDoctor.id_card_front}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <img
                                        src={selectedDoctor.id_card_front}
                                        alt="ID Card Front"
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">ID Card Front</p>
                                </a>
                            )}
                            {selectedDoctor?.id_card_back && (
                                <a
                                    href={selectedDoctor.id_card_back}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <img
                                        src={selectedDoctor.id_card_back}
                                        alt="ID Card Back"
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">ID Card Back</p>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => handleVerificationToggle(selectedDoctor.id, selectedDoctor.is_verified)}
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${selectedDoctor?.is_verified
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                }`}
                        >
                            {selectedDoctor?.is_verified ? (
                                <>
                                    <ShieldExclamationIcon className="h-5 w-5" />
                                    <span>Remove Verification</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheckIcon className="h-5 w-5" />
                                    <span>Verify Doctor</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold dark:text-white">Doctors Management</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                            <th className="p-4">Doctor</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Specialty</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {doctors.map(doctor => (
                            <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {doctor.profile_picture ? (
                                            <img
                                                src={doctor.profile_picture}
                                                alt={doctor.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                        )}
                                        <span className="font-medium dark:text-white">{doctor.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-300">{doctor.email}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-300">{doctor.speciality}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs
                                        ${doctor.is_verified
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'}`}
                                    >
                                        {doctor.is_verified ? 'Verified' : 'Pending'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedDoctor(doctor)}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="View Details"
                                        >
                                            {doctor.is_verified ? (
                                                <ShieldCheckIcon className="h-5 w-5" />
                                            ) : (
                                                <ShieldExclamationIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doctor.id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete Doctor"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {selectedDoctor && <DoctorDetailsModal />}
            </AnimatePresence>
        </div>
    );
}
