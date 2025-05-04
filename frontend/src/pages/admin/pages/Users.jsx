/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { UserCircleIcon, TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

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
            setEditForm(response.data.user);
            setEditMode(false);
        } catch (err) {
            alert('Failed to fetch user details');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.put(`/admin/users/${selectedUser.id}`, editForm);
            setUsers(users.map(user =>
                user.id === selectedUser.id ? response.data.user : user
            ));
            setSelectedUser(response.data.user);
            setEditMode(false);
            alert('User updated successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            setSelectedUser(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const UserDetailsModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold dark:text-white">
                        {editMode ? 'Edit User' : 'User Details'}
                    </h3>
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {editMode ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={editForm.phone || ''}
                                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={editForm.address || ''}
                                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setEditMode(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
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

                        {selectedUser?.doctor && (
                            <div className="mt-6">
                                <h4 className="font-semibold dark:text-white mb-3">Doctor Information</h4>
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
                                        <p className="font-medium dark:text-white">
                                            {selectedUser.doctor.is_verified ? 'Verified' : 'Pending'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedUser?.patient && (
                            <div className="mt-6">
                                <h4 className="font-semibold dark:text-white mb-3">Patient Information</h4>
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
                                        <p className="font-medium dark:text-white">{selectedUser.patient.height || 'N/A'} cm</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                                        <p className="font-medium dark:text-white">{selectedUser.patient.weight || 'N/A'} kg</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setEditMode(true)}
                                className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50"
                            >
                                Edit User
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold dark:text-white">Users Management</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                            <th className="p-4">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                        <span className="font-medium dark:text-white">{user.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs
                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                            user.role === 'doctor' ? 'bg-blue-100 text-blue-600' :
                                                'bg-green-100 text-green-600'}`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-300">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleViewDetails(user.id)}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="View Details"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete User"
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
                {selectedUser && <UserDetailsModal />}
            </AnimatePresence>
        </div>
    );
}
