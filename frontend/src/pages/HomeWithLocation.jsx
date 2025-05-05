/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useCallback, memo, Suspense } from 'react';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { FaCalendarAlt, FaMapMarkerAlt, FaChevronRight, FaMapMarked, FaInfoCircle, FaUserMd, FaHome, FaCheckCircle, FaFilter } from 'react-icons/fa';
import api from '../services/api';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || <div>Something went wrong.</div>;
        }
        return this.props.children;
    }
}

const RoleCheckModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden p-6"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                            Patient Account Required
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Only patients can make reservations. Please use a patient account to book appointments.
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                            >
                                Got it
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const DoctorCard = memo(({ doctor }) => {
    const { user: authUser } = useAuth();
    const [showRoleModal, setShowRoleModal] = useState(false);
    const navigate = useNavigate();

    const formatAvailability = (availabilities) => {
        if (!availabilities || availabilities.length === 0) return "No availability";
        const nextAvailable = availabilities[0];
        return `Available ${nextAvailable.day_of_week} ${nextAvailable.start_time}`;
    };

    const handleProfileClick = () => {
        navigate(`/doctor/public/${doctor.id}`);
    };

    const handleBooking = () => {
        if (!authUser) {
            navigate(`/login?redirect=/patient/reservation/${doctor.id}`);
            return;
        }

        // Show role restriction modal for doctors and admins
        if (authUser.role === 'doctor' || authUser.role === 'admin') {
            setShowRoleModal(true);
            return;
        }

        navigate(`/patient/reservation/${doctor.id}`);
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
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl"
            >
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                    Booking Not Available
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {authUser?.role === 'admin'
                        ? "Administrators cannot make reservations. Please use a patient account."
                        : "Doctors cannot make reservations. Please use a patient account."}
                </p>
                <button
                    onClick={() => setShowRoleModal(false)}
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    Understood
                </button>
            </motion.div>
        </motion.div>
    );

    const {
        user = {},
        speciality = 'Not specified',
        price = 0,
        description = '',
        location = 'Location not specified',
        availabilities = [],
        is_verified = 0
    } = doctor || {};

    const [imageError, setImageError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden relative"
        >
            <div className="absolute top-3 right-3">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 dark:bg-emerald-900/30">
                    <span className="text-emerald-800 dark:text-emerald-300">{price} Dh</span>
                    <span className="ml-1 text-xs text-emerald-600 dark:text-emerald-400">/visit</span>
                </div>
            </div>

            <div className="p-3 sm:p-4">
                <div className="flex items-start gap-3">

                    {/* Profile Image Section */}
                    <div className="relative flex-shrink-0">
                        {user.profile_picture && !imageError ? (
                            <img
                                src={user.profile_picture}
                                alt={user.name}
                                className="w-16 h-16 rounded-lg object-cover border-2 border-emerald-200 dark:border-emerald-800"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/40 border-2 border-emerald-200 dark:border-emerald-800">
                                <FaUserMd className="w-8 h-8 text-emerald-500" />
                            </div>
                        )}
                        {is_verified === 1 && (
                            <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5">
                                <FaCheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
                            <div className="min-w-0">
                                <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                                    {user.name || 'Unknown Doctor'}
                                </h3>
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 truncate">
                                    {speciality}
                                </p>
                            </div>
                        </div>

                        {description && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 break-words">
                                {description}
                            </p>
                        )}

                        {/* Location and Availability */}
                        <div className="mt-3 space-y-2">
                            {location && (
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <FaMapMarkerAlt className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                                    <span className="ml-2 truncate">{location}</span>
                                </div>
                            )}
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <FaCalendarAlt className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                                <span className="ml-2 truncate">
                                    {formatAvailability(availabilities)}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={handleProfileClick}
                                className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                                <FaInfoCircle className="w-3.5 h-3.5" />
                                Profile
                            </button>
                            <button
                                onClick={handleBooking}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                                Book Now <FaChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add role modal */}
            <AnimatePresence>
                {showRoleModal && <RoleModal />}
            </AnimatePresence>
        </motion.div>
    );
});

const PRICE_RANGES = [
    { id: 'all', label: 'All Prices', min: 0, max: Infinity },
    { id: 'under50', label: 'Under $50', min: 0, max: 50 },
    { id: '50to100', label: '$50 - $100', min: 50, max: 100 },
    { id: '100to200', label: '$100 - $200', min: 100, max: 200 },
    { id: 'over200', label: 'Over $200', min: 200, max: Infinity }
].map(range => ({
    ...range,
    value: range.id,
    badge: range.id === 'all' ? '' : range.id === 'over200' ? '$200+' : `$${range.min}-$${range.max}`
}));

function HomeWithLocation() {
    const navigate = useNavigate();
    const { country, city } = useParams();
    const [data, setData] = useState({
        doctors: [],
        isFallback: false,
        originalLocation: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('price');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filters, setFilters] = useState({
        specialties: []
    });
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');
    const [coordinates, setCoordinates] = useState(null);
    const [locationBoundary, setLocationBoundary] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [activeFilters, setActiveFilters] = useState(0);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(
                `/doctors/location/${encodeURIComponent(country.toLowerCase())}/${encodeURIComponent(city.toLowerCase())}`
            );

            if (response.data.doctors) {
                const verifiedDoctors = response.data.doctors.filter(doctor => doctor.user?.is_verified === 1);

                setData({
                    doctors: verifiedDoctors,
                    isFallback: verifiedDoctors.length === 0,
                    originalLocation: {
                        city: city,
                        country: country
                    }
                });
            } else {
                setData({
                    doctors: [],
                    isFallback: true,
                    originalLocation: {
                        city: city,
                        country: country
                    }
                });
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setData({
                doctors: [],
                isFallback: true,
                originalLocation: {
                    city: city,
                    country: country
                }
            });
        } finally {
            setLoading(false);
        }
    }, [city, country]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    useEffect(() => {
        let filtered = [...data.doctors];

        // specialty filter
        if (filters.specialties.length > 0) {
            filtered = filtered.filter(doctor =>
                filters.specialties.includes(doctor.speciality)
            );
        }

        // rice range filter
        const selectedRange = PRICE_RANGES.find(range => range.id === selectedPriceRange);
        if (selectedRange && selectedRange.id !== 'all') {
            filtered = filtered.filter(doctor =>
                doctor.price >= selectedRange.min && doctor.price <= selectedRange.max
            );
        }

        // sorting
        filtered.sort((a, b) => {
            if (sortOption === 'price') {
                return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
            } else if (sortOption === 'distance') {
                return 0;
            }
            return 0;
        });

        setFilteredDoctors(filtered);
        setActiveFilters(
            (filters.specialties.length > 0 ? 1 : 0) +
            (selectedPriceRange !== 'all' ? 1 : 0)
        );
    }, [data.doctors, filters.specialties, selectedPriceRange, sortOption, sortOrder]);

    const allSpecialties = useMemo(() => {
        return [...new Set(data.doctors.map(doctor => doctor.speciality))];
    }, [data.doctors]);

    const resetFilters = useCallback(() => {
        setFilters({
            specialties: []
        });
        setSelectedPriceRange('all');
        setSortOption('price');
        setSortOrder('asc');
    }, []);

    const handleFilterChange = useCallback((e) => {
        const { name, value, checked } = e.target;
        if (name === 'specialties') {
            setFilters(prev => ({
                ...prev,
                specialties: checked
                    ? [...prev.specialties, value]
                    : prev.specialties.filter(spec => spec !== value)
            }));
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin mx-auto h-8 w-8 border-t-2 border-b-2 border-emerald-600 rounded-full mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Finding doctors in {city}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <ErrorBoundary fallback={<div>Error loading navigation</div>}>
                <Navbar />
            </ErrorBoundary>

            <main className="flex-grow py-6 pt-24">
                <div className="max-w-6xl mx-auto px-4">
                    {data.isFallback && (
                        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start">
                            <FaInfoCircle className="text-blue-500 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-blue-800 dark:text-blue-200">
                                    No verified doctors found in {city}. Showing all available verified doctors instead.
                                </p>
                            </div>
                        </div>
                    )}

                    {data.doctors.length > 0 ? (
                        <>
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <p className="text-gray-600 dark:text-gray-400">
                                    {filteredDoctors.length} {filteredDoctors.length === 1 ? 'verified doctor' : 'verified doctors'} found
                                    {(filters.specialties.length > 0 || selectedPriceRange !== 'all') && (
                                        <span className="text-sm text-gray-500 ml-2">
                                            (Filtered from {data.doctors.length})
                                        </span>
                                    )}
                                </p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowMobileFilters(true)}
                                        className="md:hidden inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <FaFilter className="w-4 h-4 mr-2" />
                                        Filters {activeFilters > 0 && `(${activeFilters})`}
                                    </button>
                                    <div className="flex gap-2">
                                        <select
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm min-w-[120px]"
                                        >
                                            <option value="price">Sort by Price</option>
                                            <option value="distance">Sort by Distance</option>
                                        </select>
                                        <select
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value)}
                                            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm"
                                        >
                                            <option value="asc">Ascending</option>
                                            <option value="desc">Descending</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <AnimatePresence>
                                    {/* Mobile Filter Drawer */}
                                    {showMobileFilters && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.5 }}
                                                exit={{ opacity: 0 }}
                                                className="fixed inset-0 bg-black md:hidden z-40"
                                                onClick={() => setShowMobileFilters(false)}
                                            />
                                            <motion.div
                                                initial={{ x: '100%' }}
                                                animate={{ x: 0 }}
                                                exit={{ x: '100%' }}
                                                transition={{ type: 'tween' }}
                                                className="fixed right-0 top-0 h-full w-[300px] bg-white dark:bg-gray-800 md:hidden z-50 overflow-y-auto"
                                            >
                                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                                                    <div className="flex justify-between items-center">
                                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                                                        <button
                                                            onClick={() => setShowMobileFilters(false)}
                                                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        >
                                                            <span className="sr-only">Close</span>
                                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    {/* Price Range Section */}
                                                    <div className="space-y-4 mb-8">
                                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Price Range
                                                        </h4>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {PRICE_RANGES.map((range) => (
                                                                <button
                                                                    key={range.id}
                                                                    onClick={() => setSelectedPriceRange(range.id)}
                                                                    className={`w-full px-4 py-2.5 rounded-lg text-left transition-all duration-200 ${selectedPriceRange === range.id
                                                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20'
                                                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm">{range.label}</span>
                                                                        {range.badge && (
                                                                            <span className={`text-xs px-2 py-1 rounded-full ${selectedPriceRange === range.id
                                                                                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                                                }`}>
                                                                                {range.badge}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Specialties Section */}
                                                    {allSpecialties.length > 0 && (
                                                        <div className="space-y-4">
                                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                Specialties
                                                            </h4>
                                                            <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar">
                                                                {allSpecialties.map(specialty => (
                                                                    <label
                                                                        key={specialty}
                                                                        className="flex items-center group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            name="specialties"
                                                                            value={specialty}
                                                                            checked={filters.specialties.includes(specialty)}
                                                                            onChange={handleFilterChange}
                                                                            className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500/20 transition-colors"
                                                                        />
                                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                                                            {specialty}
                                                                        </span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>

                                {/* Desktop Filters */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="hidden md:block md:w-72 shrink-0"
                                >
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-28">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                                                Filters
                                                {activeFilters > 0 && (
                                                    <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full">
                                                        {activeFilters}
                                                    </span>
                                                )}
                                            </h3>
                                            {activeFilters > 0 && (
                                                <button
                                                    onClick={resetFilters}
                                                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                                                >
                                                    Clear all
                                                </button>
                                            )}
                                        </div>

                                        {/* Price Range Section */}
                                        <div className="space-y-4 mb-8">
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Price Range
                                            </h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {PRICE_RANGES.map((range) => (
                                                    <button
                                                        key={range.id}
                                                        onClick={() => setSelectedPriceRange(range.id)}
                                                        className={`w-full px-4 py-2.5 rounded-lg text-left transition-all duration-200 ${selectedPriceRange === range.id
                                                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20'
                                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm">{range.label}</span>
                                                            {range.badge && (
                                                                <span className={`text-xs px-2 py-1 rounded-full ${selectedPriceRange === range.id
                                                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                                    }`}>
                                                                    {range.badge}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Specialties Section */}
                                        {allSpecialties.length > 0 && (
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Specialties
                                                </h4>
                                                <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar">
                                                    {allSpecialties.map(specialty => (
                                                        <label
                                                            key={specialty}
                                                            className="flex items-center group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                name="specialties"
                                                                value={specialty}
                                                                checked={filters.specialties.includes(specialty)}
                                                                onChange={handleFilterChange}
                                                                className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500/20 transition-colors"
                                                            />
                                                            <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                                                {specialty}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Doctor Cards */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-grow"
                                >
                                    <ErrorBoundary
                                        fallback={
                                            <div className="text-center text-red-600 dark:text-red-400 p-4">
                                                Error loading doctor listings
                                            </div>
                                        }
                                    >
                                        <div className="grid gap-4 grid-cols-1">
                                            {filteredDoctors.map((doctor) => (
                                                <DoctorCard key={doctor.id} doctor={doctor} />
                                            ))}
                                        </div>
                                    </ErrorBoundary>
                                </motion.div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <FaMapMarked className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                                No verified doctors available in {city}
                            </h3>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                We couldn't find any verified doctors in this location.
                            </p>
                            <div className="mt-6 flex justify-center gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    <FaHome className="mr-2" />
                                    Back to Home
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ErrorBoundary fallback={<div>Error loading footer</div>}>
                <Footer />
            </ErrorBoundary>
        </div>
    );
}

export default memo(HomeWithLocation);