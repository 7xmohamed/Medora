/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    FiEdit,
    FiCalendar,
    FiClock,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCheckCircle,
    FiXCircle,
    FiActivity,
    FiHeart,
    FiTrendingUp,
    FiSave,
    FiX,
    FiCamera
} from 'react-icons/fi';
import { motion } from 'framer-motion';

// Mock data - These can be replaced with real API calls later
const mockReservations = [
    {
        id: 1,
        doctor_name: 'Dr. Sarah Johnson',
        specialization: 'Cardiologist',
        date_time: '2023-06-15T10:30:00',
        status: 'confirmed',
        location: 'Main Hospital, Room 302'
    },
    {
        id: 2,
        doctor_name: 'Dr. Michael Chen',
        specialization: 'Dermatologist',
        date_time: '2023-06-18T14:00:00',
        status: 'pending',
        location: 'West Clinic, Room 105'
    },
    {
        id: 3,
        doctor_name: 'Dr. Emily Wilson',
        specialization: 'Pediatrician',
        date_time: '2023-05-20T09:15:00',
        status: 'canceled',
        location: 'Children\'s Center, Room 201'
    }
];

const mockAnalytics = {
    totalAppointments: 12,
    upcomingAppointments: 2,
    canceledAppointments: 3,
    favoriteSpecialization: 'Cardiology',
    healthScore: 85,
    lastCheckup: '2023-05-10'
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

export default function PatientProfileView() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        profile_picture: null,
    });
    const [reservations, setReservations] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [useMockData, setUseMockData] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/patient/profile');
                setProfile({
                    name: data.name,
                    email: data.email,
                    address: data.address,
                    phone: data.phone,
                    profile_picture: data.profile_picture,
                });
                setEditForm({
                    name: data.name,
                    email: data.email,
                    address: data.address,
                    phone: data.phone,
                });
                if (data.profile_picture) {
                    setPreviewImage(data.profile_picture);
                }

                if (useMockData) {
                    setReservations(mockReservations);
                    setAnalytics(mockAnalytics);
                } else {
                    const reservationsRes = await api.get('/patient/reservations');
                    const analyticsRes = await api.get('/patient/analytics');
                    setReservations(reservationsRes.data);
                    setAnalytics(analyticsRes.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [useMockData]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setEditForm(prev => ({
                ...prev,
                profile_picture: file
            }));
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        setEditForm(prev => ({
            ...prev,
            profile_picture: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('name', editForm.name);
            formData.append('email', editForm.email);
            formData.append('address', editForm.address);
            formData.append('phone', editForm.phone);
            if (editForm.profile_picture instanceof File) {
                formData.append('profile_picture', editForm.profile_picture);
            }

            const response = await api.post('/patient/profile/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProfile({
                name: editForm.name,
                email: editForm.email,
                address: editForm.address,
                phone: editForm.phone,
                profile_picture: previewImage || profile.profile_picture,
            });
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                        <FiCheckCircle className="mr-1" /> Confirmed
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                        Pending
                    </span>
                );
            case 'canceled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                        <FiXCircle className="mr-1" /> Canceled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300">
                        Unknown
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 dark:border-emerald-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl mx-auto"
            >
                {/* Header with Edit Button */}
                <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Healthcare Profile</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-lg transition-colors shadow-md"
                        >
                            <FiEdit className="w-5 h-5" />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </motion.div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <motion.div
                        variants={itemVariants}
                        className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start border border-green-100 dark:border-green-900/30"
                    >
                        <FiCheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        variants={itemVariants}
                        className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start border border-red-100 dark:border-red-900/30"
                    >
                        <FiXCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        {isEditing ? (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                            >
                                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
                                    <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
                                </div>
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-4">
                                            {previewImage ? (
                                                <div className="relative">
                                                    <img
                                                        src={previewImage}
                                                        alt="Profile preview"
                                                        className="w-32 h-32 rounded-full object-cover border-4 border-emerald-100 dark:border-gray-700"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                    <FiUser className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="cursor-pointer">
                                            <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 dark:text-emerald-300 rounded-lg transition-colors">
                                                <FiCamera className="w-5 h-5" />
                                                <span>Change Photo</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={editForm.name}
                                            onChange={handleEditChange}
                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-2.5 transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={editForm.email}
                                            onChange={handleEditChange}
                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-2.5 transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={editForm.phone}
                                            onChange={handleEditChange}
                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-2.5 transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={editForm.address}
                                            onChange={handleEditChange}
                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-2.5 transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="pt-4 flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-lg transition-colors shadow-md disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <>
                                                    <FiSave className="w-5 h-5 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
                                    <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-4">
                                            {profile.profile_picture ? (
                                                <img
                                                    src={profile.profile_picture}
                                                    alt="Profile"
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-emerald-100 dark:border-gray-700"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                    <FiUser className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{profile.name}</h2>
                                        <p className="text-emerald-600 dark:text-emerald-400">Patient Member</p>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <FiMail className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                <p className="text-gray-800 dark:text-gray-200">{profile.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <FiPhone className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                                <p className="text-gray-800 dark:text-gray-200">{profile.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <FiMapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                                <p className="text-gray-800 dark:text-gray-200">{profile.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Quick Actions Card */}
                        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-4">
                                <button className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 dark:text-emerald-300 transition-colors">
                                    <FiCalendar className="w-6 h-6 mx-auto mb-1" />
                                    <span className="text-sm">New Appointment</span>
                                </button>
                                <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 dark:text-blue-300 transition-colors">
                                    <FiActivity className="w-6 h-6 mx-auto mb-1" />
                                    <span className="text-sm">Health Stats</span>
                                </button>
                                <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 dark:text-purple-300 transition-colors">
                                    <FiHeart className="w-6 h-6 mx-auto mb-1" />
                                    <span className="text-sm">Medical Records</span>
                                </button>
                                <button className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 dark:bg-orange-900/30 dark:hover:bg-orange-800/50 dark:text-orange-300 transition-colors">
                                    <FiTrendingUp className="w-6 h-6 mx-auto mb-1" />
                                    <span className="text-sm">Wellness Plan</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Reservations and Analytics */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* My Reservations */}
                        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <FiCalendar className="w-5 h-5" />
                                    <span>My Reservations</span>
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {reservations.length > 0 ? (
                                    reservations.map((reservation) => (
                                        <div key={reservation.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-800 dark:text-white">{reservation.doctor_name}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{reservation.specialization}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{reservation.location}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="mb-2">
                                                        {getStatusBadge(reservation.status)}
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                                                        <FiClock className="w-4 h-4" />
                                                        <span className="text-sm">
                                                            {new Date(reservation.date_time).toLocaleDateString()} • {new Date(reservation.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex justify-end space-x-2">
                                                {reservation.status === 'confirmed' && (
                                                    <button className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-full transition-colors dark:bg-red-900/30 dark:hover:bg-red-800/50 dark:text-red-200">
                                                        Cancel
                                                    </button>
                                                )}
                                                <button className="text-sm px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full transition-colors dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 dark:text-emerald-200">
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                        No reservations found
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* My Analytics */}
                        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <FiActivity className="w-5 h-5" />
                                    <span>My Healthcare Analytics</span>
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg">
                                        <p className="text-sm text-emerald-800 dark:text-emerald-200">Total Appointments</p>
                                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{analytics.totalAppointments || 0}</p>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">Upcoming</p>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.upcomingAppointments || 0}</p>
                                    </div>
                                    <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                                        <p className="text-sm text-red-800 dark:text-red-200">Canceled</p>
                                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{analytics.canceledAppointments || 0}</p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                                        <p className="text-sm text-purple-800 dark:text-purple-200">Favorite Specialty</p>
                                        <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{analytics.favoriteSpecialization || 'N/A'}</p>
                                    </div>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">Health Score</p>
                                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{analytics.healthScore || 0}%</p>
                                    </div>
                                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                        <p className="text-sm text-indigo-800 dark:text-indigo-200">Last Checkup</p>
                                        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                            {analytics.lastCheckup ? new Date(analytics.lastCheckup).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Development Note - Can be removed in production */}
                {useMockData && (
                    <motion.div
                        variants={itemVariants}
                        className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-800 dark:text-yellow-200 text-sm border border-yellow-100 dark:border-yellow-900/30"
                    >
                        <p>Note: Currently using mock data for reservations and analytics. To switch to real API data, set <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">useMockData</code> to false in the component.</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}