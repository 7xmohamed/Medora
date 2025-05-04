/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { UserCircleIcon, TrashIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        action: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.users);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
            setLoading(false);
        }
    };

    const handleViewDetails = async (userId) => {
        try {
            const response = await api.get(`/admin/users/${userId}`);
            setSelectedUser(response.data.user);
        } catch (err) {
            alert('Failed to fetch user details');
        }
    };

    const handleDelete = async (userId) => {
        try {
            setIsSubmitting(true);
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            setSelectedUser(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setIsSubmitting(false);
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }
    };

    const showDeleteConfirmation = (userId) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            action: () => handleDelete(userId)
        });
    };

    if (loading) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
                </div>
            </div>
        );
    }

    const UserDetailsModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold dark:text-white">User Details</h3>
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                            <p className="font-medium dark:text-white">{selectedUser?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                            <p className="font-medium dark:text-white">{selectedUser?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                            <p className="font-medium dark:text-white capitalize">{selectedUser?.role}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="font-medium dark:text-white">{selectedUser?.phone || 'N/A'}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                            <p className="font-medium dark:text-white">{selectedUser?.address || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Doctor Information */}
                    {selectedUser?.doctor && (
                        <div className="border-t pt-6 mt-6 border-gray-200 dark:border-gray-700">
                            <h4 className="text-lg font-semibold dark:text-white mb-4">Doctor Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Specialty</p>
                                    <p className="font-medium dark:text-white">{selectedUser.doctor.speciality}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">NIOM</p>
                                    <p className="font-medium dark:text-white">{selectedUser.doctor.niom}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                                    <p className="font-medium dark:text-white">{selectedUser.doctor.experience}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Verification Status</p>
                                    <p className={`font-medium ${selectedUser.doctor.is_verified ? 'text-green-500' : 'text-yellow-500'}`}>
                                        {selectedUser.doctor.is_verified ? 'Verified' : 'Pending'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Patient Information */}
                    {selectedUser?.patient && (
                        <div className="border-t pt-6 mt-6 border-gray-200 dark:border-gray-700">
                            <h4 className="text-lg font-semibold dark:text-white mb-4">Patient Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Blood Type</p>
                                    <p className="font-medium dark:text-white">{selectedUser.patient.blood_type || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                                    <p className="font-medium dark:text-white capitalize">{selectedUser.patient.gender || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Height</p>
                                    <p className="font-medium dark:text-white">{selectedUser.patient.height ? `${selectedUser.patient.height} cm` : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                                    <p className="font-medium dark:text-white">{selectedUser.patient.weight ? `${selectedUser.patient.weight} kg` : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold dark:text-white">Users Management</h2>
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                                    <th className="p-4">User</th>
                                    <th className="p-4 hidden sm:table-cell">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4 hidden sm:table-cell">Joined</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium dark:text-white">{user.name}</span>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden sm:table-cell text-gray-600 dark:text-gray-300">{user.email}</td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                                        user.role === 'doctor' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 hidden sm:table-cell whitespace-nowrap text-gray-600 dark:text-gray-300">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(user.id)}
                                                        className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                                                    >
                                                        <UserCircleIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => showDeleteConfirmation(user.id)}
                                                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
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
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedUser && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-40"
                            onClick={() => setSelectedUser(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-2 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 max-w-2xl w-full max-h-[calc(100vh-1rem)] overflow-y-auto z-50"
                        >
                            <UserDetailsModal />
                        </motion.div>
                    </>
                )}
                <ConfirmationModal
                    isOpen={confirmationModal.isOpen}
                    onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={confirmationModal.action}
                    title={confirmationModal.title}
                    message={confirmationModal.message}
                    confirmText="Delete"
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                    isLoading={isSubmitting}
                />
            </AnimatePresence>
        </div>
    );
}
