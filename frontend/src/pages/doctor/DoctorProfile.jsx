/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
    FaUserMd, FaMapMarkerAlt, FaPhone, FaEnvelope,
    FaSpinner, FaUserTie, FaCheckCircle,
    FaMoneyBillWave, FaEdit,
    FaCalendarAlt, FaRegClock, FaIdCard,
    FaUniversity, FaBriefcaseMedical, FaGlobe
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const DoctorProfileDashboard = () => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get('/doctor/profile');
                if (response.data?.doctor) {
                    setDoctor({
                        ...response.data.doctor,
                        name: response.data.doctor.user?.name || 'Dr. Unknown',
                        email: response.data.doctor.user?.email || 'Not provided',
                        phone: response.data.doctor.user?.phone || 'Not provided',
                        profilePicture: response.data.doctor.user?.profile_picture || null,
                        niom: response.data.doctor.niom || 'Not specified',
                        education: response.data.doctor.education || '',
                        experience: response.data.doctor.experience || '',
                        languages: response.data.doctor.languages || [],
                        availabilities: response.data.doctor.availabilities || [],
                        consultationFee: response.data.doctor.price || 0,
                        is_verified: Boolean(response.data.doctor.is_verified)
                    });
                }
            } catch (err) {
                console.error('Error fetching doctor profile:', err);
                toast.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorProfile();
    }, []);

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('profile_picture', file);

            const response = await api.post('/doctor/profile/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setDoctor(prev => ({
                ...prev,
                profilePicture: response.data.profile_picture
            }));

            toast.success('Profile picture updated successfully');
        } catch (err) {
            console.error('Error uploading profile picture:', err);
            toast.error('Failed to update profile picture');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const languageNames = {
        'en': 'English', 'fr': 'French', 'ar': 'Arabic',
        'es': 'Spanish', 'de': 'German', 'zh': 'Chinese'
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <FaSpinner className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Profile Unavailable</h2>
                    <p className="mb-6 text-gray-600 dark:text-gray-300">We couldn't load your profile information.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 font-medium text-white transition-colors bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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

    const isVerified = Boolean(doctor.is_verified);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <motion.header
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="bg-white dark:bg-gray-800 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <motion.h1 variants={itemVariants} className="text-2xl font-bold text-gray-900 dark:text-white">
                        My Profile
                    </motion.h1>
                    <motion.button
                        variants={itemVariants}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md font-medium transition-colors"
                    >
                        <FaEdit /> Edit Profile
                    </motion.button>
                </div>
            </motion.header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid grid-cols-1 gap-8 lg:grid-cols-4"
                >
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="p-6 text-center">
                                <div className="relative mx-auto w-32 h-32 mb-4 group">
                                    <label htmlFor="profile-upload" className="cursor-pointer">
                                        {doctor.profilePicture ? (
                                            <>
                                                <img
                                                    src={doctor.profilePicture}
                                                    alt={doctor.name}
                                                    className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg group-hover:opacity-75 transition-opacity"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/images/doctor-avatar.png';
                                                    }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                                                        <FaEdit className="text-white text-xl" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 border-4 border-white dark:border-gray-800 shadow-lg group-hover:opacity-75 transition-opacity">
                                                <FaUserMd className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                                <FaSpinner className="animate-spin text-white text-2xl" />
                                            </div>
                                        )}
                                    </label>
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfilePictureUpload}
                                        disabled={uploading}
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-1">
                                    Dr. {doctor.name}
                                    {isVerified && (
                                        <span className="text-emerald-500" title="Verified Doctor">
                                            <FaCheckCircle className="w-5 h-5" />
                                        </span>
                                    )}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">{doctor.speciality || 'Medical Specialist'}</p>
                            </div>

                            <nav className="border-t border-gray-200 dark:border-gray-700">
                                {[
                                    { id: 'profile', icon: FaUserMd, label: 'Profile' },
                                    { id: 'availability', icon: FaCalendarAlt, label: 'Availability' },
                                    { id: 'professional', icon: FaBriefcaseMedical, label: 'Professional Info' },
                                    { id: 'contact', icon: FaEnvelope, label: 'Contact' }
                                ].map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        variants={itemVariants}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center w-full px-6 py-3 text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-600 dark:border-emerald-500'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <tab.icon className="mr-3" />
                                        <span>{tab.label}</span>
                                    </motion.button>
                                ))}
                            </nav>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-3">
                        {activeTab === 'profile' && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                            >
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Personal Information</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">About Me</h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {doctor.description || 'No professional summary provided.'}
                                            </p>
                                            <div className="mt-4 flex items-center">
                                                <div className="p-2 mr-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                    <FaMapMarkerAlt />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                                                    <p className="font-medium text-gray-800 dark:text-white">{doctor.location || 'Location not specified'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Stats</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center">
                                                    <div className="p-2 mr-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                        <FaUserTie />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                                                        <p className="font-medium text-gray-800 dark:text-white">{doctor.experience || 'N/A'} years</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="p-2 mr-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                        <FaMoneyBillWave />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Consultation Fee</p>
                                                        <p className="font-medium text-gray-800 dark:text-white">{doctor.consultationFee.toFixed(0)} dh</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'professional' && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                            >
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Professional Information</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Education</h3>
                                            <div className="flex items-start">
                                                <div className="p-2 mr-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                    <FaUniversity />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white">{doctor.education || 'Not specified'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Medical License</h3>
                                            <div className="flex items-start">
                                                <div className="p-2 mr-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                    <FaIdCard />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white">{doctor.niom}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">NIOM Number</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Languages</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {doctor.languages.length > 0 ? (
                                                    doctor.languages.map((lang, index) => (
                                                        <motion.span
                                                            key={index}
                                                            whileHover={{ scale: 1.05 }}
                                                            className="flex items-center px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
                                                        >
                                                            <FaGlobe className="mr-2" />
                                                            {languageNames[lang] || lang}
                                                        </motion.span>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 dark:text-gray-400">No languages specified</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'availability' && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                            >
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Availability Schedule</h2>
                                </div>
                                <div className="p-6">
                                    {doctor.availabilities.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {doctor.availabilities.map((availability, index) => (
                                                <motion.div
                                                    key={index}
                                                    whileHover={{ y: -2 }}
                                                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                                                >
                                                    <div className="flex items-center mb-2">
                                                        <FaRegClock className="mr-2 text-emerald-500" />
                                                        <h3 className="font-medium text-gray-800 dark:text-white">{availability.day}</h3>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300">{availability.hours}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 dark:text-gray-400 mb-4">No availability schedule set</p>
                                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                                Set Availability
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'contact' && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                            >
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Contact Information</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Email</h3>
                                            <div className="flex items-start">
                                                <div className="p-2 mr-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                    <FaEnvelope />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white">{doctor.email}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Primary email</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Phone</h3>
                                            <div className="flex items-start">
                                                <div className="p-2 mr-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                    <FaPhone />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white">{doctor.phone}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact number</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default DoctorProfileDashboard;