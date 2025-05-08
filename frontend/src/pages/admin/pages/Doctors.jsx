/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { UserCircleIcon, TrashIcon, ShieldCheckIcon, ShieldExclamationIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';
import { toast } from 'react-toastify';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        action: null,
        confirmText: '',
        confirmButtonClass: ''
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        const filtered = doctors.filter(doctor => {
            const matchesSearch = (
                doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'verified' && doctor.is_verified) ||
                (filterStatus === 'pending' && !doctor.is_verified);

            return matchesSearch && matchesStatus;
        });
        setFilteredDoctors(filtered);
    }, [searchTerm, doctors, filterStatus]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/doctors');

            if (!response.data.success) {
                throw new Error('Failed to fetch doctors');
            }

            // Normalize doctor data to flatten user fields if present
            setDoctors(response.data.doctors.map(doctor => {
                // If doctor.user exists, flatten user fields into doctor object
                if (doctor.user) {
                    return {
                        ...doctor,
                        name: doctor.user.name,
                        email: doctor.user.email,
                        profile_picture: doctor.user.profile_picture,
                        id_card_front: doctor.user.id_card_front,
                        id_card_back: doctor.user.id_card_back,
                        // fallback for is_verified if not present at root
                        is_verified: typeof doctor.is_verified !== 'undefined'
                            ? Boolean(doctor.is_verified)
                            : Boolean(doctor.user.is_verified),
                    };
                }
                // Otherwise, fallback to root fields
                return {
                    ...doctor,
                    is_verified: Boolean(doctor.is_verified),
                };
            }));
            setError(null);
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError(err.response?.data?.error || 'Failed to fetch doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationToggle = async (doctorId, currentStatus) => {
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

            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
            console.error('Error updating doctor status:', err);
            alert(err.response?.data?.error || 'Failed to update doctor status');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (doctorId) => {
        try {
            setIsSubmitting(true);
            const response = await api.delete(`/admin/doctors/${doctorId}`);

            if (response.data.success) {
                setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
                setSelectedDoctor(null);
                setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                toast.success('Doctor deleted successfully');
            } else {
                throw new Error(response.data.error || 'Failed to delete doctor');
            }
        } catch (err) {
            console.error('Error deleting doctor:', err);
            toast.error(err.response?.data?.message || 'Failed to delete doctor');
        } finally {
            setIsSubmitting(false);
        }
    };

    const showVerificationConfirmation = (doctorId, currentStatus) => {
        setConfirmationModal({
            isOpen: true,
            title: currentStatus ? 'Remove Verification' : 'Verify Doctor',
            message: currentStatus
                ? 'Are you sure you want to remove verification from this doctor? This will affect their visibility to patients.'
                : 'Are you sure you want to verify this doctor? This will make them visible to patients.',
            action: () => handleVerificationToggle(doctorId, currentStatus),
            confirmText: currentStatus ? 'Remove Verification' : 'Verify Doctor',
            confirmButtonClass: currentStatus
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
        });
    };

    const showDeleteConfirmation = (doctorId) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Delete Doctor',
            message: 'Are you sure you want to delete this doctor? This will permanently remove all their data and cannot be undone.',
            action: () => handleDelete(doctorId),
            confirmText: 'Delete',
            confirmButtonClass: 'bg-red-600 hover:bg-red-700',
            isLoading: isSubmitting
        });
    };

    const handleModalClose = () => {
        setSelectedDoctor(null);
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
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
                        {(selectedDoctor?.id_card_front || selectedDoctor?.id_card_back) ? (
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
                                            onError={(e) => {
                                                console.error('Failed to load image:', selectedDoctor.id_card_front);
                                                e.target.src = '/images/placeholder-id-card.png';
                                            }}
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
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                            }}
                                        />
                                        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">ID Card Back</p>
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-gray-500 dark:text-gray-400">No verification documents available</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => showVerificationConfirmation(selectedDoctor.id, selectedDoctor.is_verified)}
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
        return (
            <div className="min-h-[40vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading doctors...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold dark:text-white">Doctors Management</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search doctors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="all">All Status</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                                    <th className="p-4">Doctor</th>
                                    <th className="p-4 hidden sm:table-cell">Email</th>
                                    <th className="p-4 hidden sm:table-cell">Specialty</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredDoctors.length > 0 ? (
                                    filteredDoctors.map(doctor => (
                                        <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        {doctor.profile_picture ? (
                                                            <img
                                                                src={doctor.profile_picture}
                                                                alt={doctor.name}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium dark:text-white">{doctor.name}</span>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">{doctor.speciality}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden sm:table-cell text-gray-600 dark:text-gray-300">{doctor.email}</td>
                                            <td className="p-4 hidden sm:table-cell text-gray-600 dark:text-gray-300">{doctor.speciality}</td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                                    ${doctor.is_verified
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}
                                                >
                                                    {doctor.is_verified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedDoctor(doctor)}
                                                        className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                                                        title="View Details"
                                                    >
                                                        {doctor.is_verified ? (
                                                            <ShieldCheckIcon className="h-5 w-5" />
                                                        ) : (
                                                            <ShieldExclamationIcon className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => showDeleteConfirmation(doctor.id)}
                                                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                                        title="Delete Doctor"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">
                                            No doctors found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="sync">
                <div className="relative">
                    {selectedDoctor && (
                        <motion.div
                            key="doctor-modal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50"
                        >
                            <DoctorDetailsModal />
                        </motion.div>
                    )}
                    {confirmationModal.isOpen && (
                        <motion.div
                            key="confirmation-modal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50"
                        >
                            <ConfirmationModal
                                isOpen={confirmationModal.isOpen}
                                onClose={handleModalClose}
                                onConfirm={confirmationModal.action}
                                title={confirmationModal.title}
                                message={confirmationModal.message}
                                confirmText={confirmationModal.confirmText}
                                confirmButtonClass={confirmationModal.confirmButtonClass}
                                isLoading={isSubmitting}
                            />
                        </motion.div>
                    )}
                </div>
            </AnimatePresence>
        </div>
    );
}
