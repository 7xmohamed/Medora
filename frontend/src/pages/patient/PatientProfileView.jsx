/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment, useRef } from 'react';
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
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

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

const formatDateTime = (dateTimeString) => {
    try {
        // Parse the date_time string
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }

        // Format date
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Format time
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return `${formattedDate} • ${formattedTime}`;
    } catch (error) {
        console.error('Date parsing error:', error, 'for date:', dateTimeString);
        return 'Date not available';
    }
};

const isWithin30Minutes = (dateTimeString) => {
    if (!dateTimeString) return false;
    const reservationTime = new Date(dateTimeString);
    const currentTime = new Date();
    const timeDiff = reservationTime.getTime() - currentTime.getTime();
    const minutesDiff = Math.floor(timeDiff / 1000 / 60);
    return minutesDiff <= 30 && minutesDiff > -reservationTime.getMinutes(); // Check if within 30 mins and not past
};

const validationPatterns = {
    name: /^[\p{L}\s'-]{2,50}$/u,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s-]{8,}$/,
    address: /^[\p{L}\d\s,.-]{5,255}$/u
};

const FormInput = ({ label, type, name, value, onChange, inputRef }) => {
    const [error, setError] = useState('');

    const validateInput = (value) => {
        if (!value) return 'This field is required';
        if (!validationPatterns[name].test(value)) {
            switch (name) {
                case 'name':
                    return 'Name must be 2-50 characters long and contain only letters, spaces, hyphens and apostrophes';
                case 'email':
                    return 'Please enter a valid email address';
                case 'phone':
                    return 'Please enter a valid phone number (minimum 8 digits)';
                case 'address':
                    return 'Address must be 5-255 characters long';
                default:
                    return 'Invalid input';
            }
        }
        return '';
    };

    const handleChange = (e) => {
        const newValue = e.target.value;
        setError(validateInput(newValue));
        onChange(e);
    };

    return (
        <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                className={`mt-1 w-full rounded-md border ${error
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500'
                    } dark:bg-gray-700`}
                ref={inputRef}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

export default function PatientProfileView() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
    });

    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
    });

    const [reservations, setReservations] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        reservationId: null
    });
    const navigate = useNavigate();


    const nameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const phoneInputRef = useRef(null);
    const addressInputRef = useRef(null);

    const inputRefs = {
        name: nameInputRef,
        email: emailInputRef,
        phone: phoneInputRef,
        address: addressInputRef
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, reservationsRes, analyticsRes] = await Promise.all([
                    api.get('/patient/profile'),
                    api.get('/patient/getpatientreservations'),
                    api.get('/patient/analytics')
                ]);

                const profileData = {
                    name: profileRes.data.name,
                    email: profileRes.data.email,
                    address: profileRes.data.address,
                    phone: profileRes.data.phone,
                };

                setProfile(profileData);
                setEditForm(profileData);

                setReservations(reservationsRes.data.data);
                setAnalytics(analyticsRes.data);

            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Something went wrong';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleEditChange = (e) => {
        const { name, value } = e.target;
        const cursorPosition = e.target.selectionStart;

        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));

        requestAnimationFrame(() => {
            const inputRef = inputRefs[name];
            if (inputRef && inputRef.current) {
                inputRef.current.focus();
                inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    };

    const cancelReservation = async (reservationId) => {
        try {
            const response = await api.post(`/patient/cancelReservation/${reservationId}`);

            if (response.data.status === 'success') {
                setReservations(prevReservations =>
                    prevReservations.map(res =>
                        res.id === reservationId
                            ? { ...res, status: 'canceled' }
                            : res
                    )
                );

                toast.success('Reservation canceled successfully', {
                    position: "top-right",
                    autoClose: 3000
                });

                if (response.data.reservation_price) {
                    toast.info(`Amount refunded: $${response.data.reservation_price}`, {
                        position: "top-right",
                        autoClose: 5000
                    });
                }

                setDeleteModal({ isOpen: false, reservationId: null });
            }
        } catch (error) {
            console.error('Cancel error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to cancel reservation';

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000
            });

            if (error.response?.status === 403) {
                toast.error('Not authorized to cancel this reservation', {
                    position: "top-right",
                    autoClose: 5000
                });
            }
        }
        setDeleteModal({ isOpen: false, reservationId: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Validate all fields before submission
        const errors = Object.keys(editForm).map(field => {
            if (!validationPatterns[field].test(editForm[field])) {
                return true;
            }
            return false;
        });

        if (errors.includes(true)) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.post('/patient/profile/update', editForm);

            if (response.data.status === 'success') {
                setProfile(response.data.data);
                setIsEditing(false);
                toast.success('Profile updated successfully!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
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
                        <FiClock className="mr-1" /> Pending
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

    const ConfirmationModal = () => (
        <Transition appear show={deleteModal.isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => setDeleteModal({ isOpen: false, reservationId: null })}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                    Cancel Reservation
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Are you sure you want to cancel this reservation? This action cannot be undone.
                                    </p>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg"
                                        onClick={() => setDeleteModal({ isOpen: false, reservationId: null })}
                                    >
                                        Keep Reservation
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                                        onClick={() => deleteModal.reservationId && cancelReservation(deleteModal.reservationId)}
                                    >
                                        Yes, Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );

    const PersonalInfo = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-white hover:bg-emerald-700 p-2 rounded-lg transition-colors"
                >
                    <FiEdit className="w-5 h-5" />
                </button>
            </div>
            <div className="p-6">
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                        <FiUser className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            <div className="space-y-4">
                                <FormInput
                                    label="Name"
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    inputRef={nameInputRef}
                                />
                                <FormInput
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    inputRef={emailInputRef}
                                />
                                <FormInput
                                    label="Phone"
                                    type="tel"
                                    name="phone"
                                    value={editForm.phone}
                                    onChange={handleEditChange}
                                    inputRef={phoneInputRef}
                                />
                                <FormInput
                                    label="Address"
                                    type="text"
                                    name="address"
                                    value={editForm.address}
                                    onChange={handleEditChange}
                                    inputRef={addressInputRef}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditForm(profile);
                                        setIsEditing(false);
                                    }}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{profile.name}</h2>
                            <p className="text-emerald-600 dark:text-emerald-400">Patient Member</p>
                            <div className="mt-6 space-y-4 w-full">
                                <InfoField icon={FiMail} label="Email" value={profile.email} />
                                <InfoField icon={FiPhone} label="Phone" value={profile.phone} />
                                <InfoField icon={FiMapPin} label="Address" value={profile.address} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const InfoField = ({ icon: Icon, label, value }) => (
        <div className="flex items-start space-x-3">
            <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-gray-800 dark:text-gray-200">{value}</p>
            </div>
        </div>
    );

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
                {/* Header section */}
                <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Healthcare Profile</h1>
                </motion.div>

                {/* Messages */}
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

                {/* Main grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Personal Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <PersonalInfo />
                    </div>

                    {/* Right column - Reservations and Analytics */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Reservations card */}
                        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <FiCalendar className="w-5 h-5" />
                                    <span>My Reservations</span>
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
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
                                                        {getStatusBadge(isWithin30Minutes(reservation.date_time) && reservation.status === 'pending'
                                                            ? 'confirmed'
                                                            : reservation.status
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex justify-end space-x-2">
                                                {(reservation.status === 'confirmed' || reservation.status === 'pending') &&
                                                    !isWithin30Minutes(reservation.date_time) && (
                                                        <button
                                                            className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-full transition-colors dark:bg-red-900/30 dark:hover:bg-red-800/50 dark:text-red-200"
                                                            onClick={() => setDeleteModal({ isOpen: true, reservationId: reservation.id })}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                <button
                                                    className="text-sm px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full transition-colors dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 dark:text-emerald-200"
                                                    onClick={() => navigate(`/patient/Appointment/${reservation.id}`)}
                                                >
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

                        {/* Analytics card */}
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
            </motion.div>

            {/* Modals */}
            <ConfirmationModal />
        </div>
    );
}