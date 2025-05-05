/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUserMd, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt,
    FaChevronLeft, FaCheckCircle, FaGlobe, FaStar,
    FaPhone, FaGraduationCap, FaClinicMedical, FaAward
} from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function DoctorPublicProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: authUser } = useAuth();
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await api.get(`/doctors/public/${id}`);
                setDoctor(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching doctor:', err);
                setError('Failed to load doctor profile');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    const handleBooking = () => {
        if (!authUser) {
            navigate(`/login?redirect=/patient/reservation/${id}`);
            return;
        }

        if (authUser.role === 'doctor' || authUser.role === 'admin') {
            setShowRoleModal(true);
            return;
        }

        navigate(`/patient/reservation/${id}`);
    };

    const RoleModal = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg"
            >
                <h3 className="text-xl font-semibold mb-3 dark:text-white">
                    Booking Not Available
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {authUser.role === 'admin'
                        ? "Administrators cannot make reservations. Please use a patient account."
                        : "Doctors cannot make reservations. Please use a patient account."}
                </p>
                <button
                    onClick={() => setShowRoleModal(false)}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    Understood
                </button>
            </motion.div>
        </motion.div>
    );

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center p-6 max-w-md">
                    <h2 className="text-xl text-gray-800 dark:text-gray-200 mb-4">{error || 'Doctor not found'}</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 border border-emerald-600 dark:border-emerald-400 rounded-lg"
                    >
                        Return to List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Navigation Bar - Increased z-index */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 p-2"
                    >
                        <FaChevronLeft className="mr-2" />
                        Back
                    </button>
                </div>
            </nav>

            {/* Main Content - Add padding bottom to account for mobile booking button */}
            <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 mb-24 lg:mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Main Content Column */}
                    <motion.div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Profile Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                                {/* Profile Image */}
                                <div className="relative flex-shrink-0">
                                    {doctor?.profile_picture ? (
                                        <img
                                            src={doctor.profile_picture}
                                            alt={doctor.name}
                                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover shadow-md"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-emerald-50 dark:bg-gray-700 flex items-center justify-center">
                                            <FaUserMd className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500/50" />
                                        </div>
                                    )}
                                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
                                        <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                        Dr. {doctor?.name}
                                    </h1>
                                    <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                                        {doctor?.speciality}
                                    </p>

                                    {/* Enhanced Doctor Stats */}
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-6">
                                        <div className="flex items-center bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 px-5 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
                                            <div className="mr-4 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                                <FaBriefcase className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-medium">
                                                    Experience
                                                </p>
                                                <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                                                    {doctor?.experience}+ Years
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 px-5 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
                                            <div className="mr-4 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                                <FaStar className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-medium">
                                                    Rating
                                                </p>
                                                <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                                                    4.8/5.0
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced About Section */}
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <FaUserMd className="text-emerald-500" />
                                About Dr. {doctor?.name}
                            </h2>
                            <div className="relative">
                                <p className={`text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base ${!isExpanded ? 'line-clamp-4' : ''}`}>
                                    {doctor?.description || 'No description available.'}
                                </p>
                                {doctor?.description && doctor.description.length > 200 && (
                                    <button
                                        onClick={toggleExpand}
                                        className="mt-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                                    >
                                        {isExpanded ? 'Show less' : 'Read more'}
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* Qualifications & Languages */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Education */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <FaGraduationCap className="text-emerald-500" />
                                    Education
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                                    {doctor?.education}
                                </p>
                            </div>

                            {/* Languages */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <FaGlobe className="text-emerald-500" />
                                    Languages
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {doctor?.languages?.map((language, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-sm"
                                        >
                                            {language}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Location Map Section - Adjusted height and margins */}
                        {doctor?.latitude && doctor?.longitude && (
                            <motion.div
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-emerald-500" />
                                    Location
                                </h2>
                                <div className="h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mt-4">
                                    <MapContainer
                                        center={[doctor.latitude, doctor.longitude]}
                                        zoom={15}
                                        style={{ height: '100%', width: '100%' }}
                                        scrollWheelZoom={false}
                                        zoomControl={true}
                                        className="z-10"
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[doctor.latitude, doctor.longitude]}>
                                            <Popup>
                                                <div className="text-sm">
                                                    <strong>Dr. {doctor.name}</strong>
                                                    <br />
                                                    {doctor.location}
                                                </div>
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-emerald-400 flex-shrink-0" />
                                    <span className="line-clamp-2">{doctor.location}</span>
                                </p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Booking Card - Adjusted sticky positioning */}
                    <motion.div className="hidden lg:block">
                        <div className="sticky top-[88px] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Book Appointment</h2>

                            {/* Enhanced Consultation Fee Section */}
                            <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Consultation Fee</h3>
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                    {doctor?.price} Dh
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Payment required at booking
                                </p>
                            </div>

                            {/* Enhanced Availability Section */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                    <FaCalendarAlt className="text-emerald-500" />
                                    Available Time Slots
                                </h3>
                                <div className="space-y-2">
                                    {doctor?.availabilities?.slice(0, 3).map((slot, index) => (
                                        <div
                                            key={index}
                                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all cursor-default"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    {slot.day_of_week}
                                                </span>
                                                <span className="text-emerald-600 dark:text-emerald-400">
                                                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Book Button and Call Button Group */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleBooking}
                                    className="flex-1 py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-[0.98]"
                                >
                                    <FaCalendarAlt className="text-lg" />
                                    Book Appointment
                                </button>
                                <a
                                    href={`tel:${doctor?.phone}`}
                                    className="px-4 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg font-medium transition-all flex items-center justify-center shadow-md hover:shadow-lg transform active:scale-[0.98]"
                                >
                                    <FaPhone className="text-lg" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Mobile Booking Button - Updated with Call Button */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-50">
                <div className="flex gap-3">
                    <button
                        onClick={handleBooking}
                        className="flex-1 py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg transform active:scale-[0.98]"
                    >
                        <FaCalendarAlt className="text-lg" />
                        <span>Book - {doctor?.price} Dh</span>
                    </button>
                    <a
                        href={`tel:${doctor?.phone}`}
                        className="px-6 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-all flex items-center justify-center shadow-lg transform active:scale-[0.98]"
                    >
                        <FaPhone className="text-lg" />
                    </a>
                </div>
            </div>

            {/* Role Modal - Keep highest z-index */}
            <AnimatePresence>
                {showRoleModal && (
                    <div className="z-[60]">
                        <RoleModal />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}