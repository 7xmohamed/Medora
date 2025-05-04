/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useCallback, memo, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { FaCalendarAlt, FaMapMarkerAlt, FaChevronRight, FaMapMarked, FaInfoCircle, FaUserMd, FaHome, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';
import React from 'react';

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

const DoctorCard = memo(({ doctor }) => {
    const formatAvailability = (availabilities) => {
        if (!availabilities || availabilities.length === 0) return "No availability";
        const nextAvailable = availabilities[0];
        return `Available ${nextAvailable.day_of_week} ${nextAvailable.start_time}`;
    };

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
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-4 hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                    {user.profile_picture && !imageError ? (
                        <img
                            src={user.profile_picture}
                            alt={user.name}
                            className="w-24 h-24 rounded-full object-cover border-2 border-emerald-200 dark:border-emerald-800"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 border-2 border-emerald-200 dark:border-emerald-800">
                            <FaUserMd className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    )}
                </div>
                <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-1">
                                {user.name || 'Unknown Doctor'}
                                {is_verified === 1 && (
                                    <FaCheckCircle className="text-emerald-500 dark:text-emerald-400" title="Verified Doctor" />
                                )}
                            </h3>
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium">{speciality}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">${price}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">/consultation</span>
                        </div>
                    </div>

                    {description && (
                        <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm">{description}</p>
                    )}

                    {location && (
                        <div className="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <FaMapMarkerAlt className="text-emerald-400 dark:text-emerald-500 mr-2" />
                            {location}
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center">
                                <FaCalendarAlt className="text-emerald-500 dark:text-emerald-400 mr-2" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {formatAvailability(availabilities)}
                                </span>
                            </div>
                            <button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-all duration-200 shadow-sm">
                                Book Appointment <FaChevronRight className="ml-1 text-xs" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

const priceRanges = [
    { id: 'all', label: 'All Prices', min: 0, max: Infinity },
    { id: 'under50', label: 'Under $50', min: 0, max: 50 },
    { id: '50to100', label: '$50 - $100', min: 50, max: 100 },
    { id: '100to200', label: '$100 - $200', min: 100, max: 200 },
    { id: 'over200', label: 'Over $200', min: 200, max: Infinity }
];

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

    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(
                `/doctors/location/${encodeURIComponent(country.toLowerCase())}/${encodeURIComponent(city.toLowerCase())}`
            );

            if (response.data.doctors) {
                // Filter to only show verified doctors (is_verified === 1)
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

    // Only include specialties from verified doctors
    const allSpecialties = [...new Set(data.doctors.map(doctor => doctor.speciality))];

    const handleFilterChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'specialties') {
            setFilters(prev => ({
                ...prev,
                specialties: checked
                    ? [...prev.specialties, value]
                    : prev.specialties.filter(spec => spec !== value)
            }));
        }
    };

    const resetFilters = () => {
        setFilters({
            specialties: []
        });
        setSelectedPriceRange('all');
    };

    const PriceRangeSelector = () => (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Range
            </label>
            <div className="space-y-2">
                {priceRanges.map(range => (
                    <label key={range.id} className="flex items-center space-x-3">
                        <input
                            type="radio"
                            name="priceRange"
                            value={range.id}
                            checked={selectedPriceRange === range.id}
                            onChange={(e) => setSelectedPriceRange(e.target.value)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {range.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );

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

    const doctorsToDisplay = data.doctors; // Already filtered to only verified doctors

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

                    {doctorsToDisplay.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-gray-600 dark:text-gray-400">
                                    {doctorsToDisplay.length} {doctorsToDisplay.length === 1 ? 'verified doctor' : 'verified doctors'} found
                                </p>
                                <div className="flex items-center">
                                    <select
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm"
                                    >
                                        <option value="price">Sort by Price</option>
                                        <option value="distance">Sort by Distance</option>
                                    </select>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="ml-2 appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm"
                                    >
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="md:w-64">
                                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-28">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-medium text-gray-800 dark:text-white">Filters</h3>
                                            <button
                                                onClick={resetFilters}
                                                className="text-emerald-600 dark:text-emerald-400 text-sm hover:underline"
                                            >
                                                Reset
                                            </button>
                                        </div>

                                        <div className="space-y-5">
                                            <PriceRangeSelector />
                                            {allSpecialties.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialties</label>
                                                    <div className="space-y-2">
                                                        {allSpecialties.map(specialty => (
                                                            <label key={specialty} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                                <input
                                                                    type="checkbox"
                                                                    name="specialties"
                                                                    value={specialty}
                                                                    checked={filters.specialties.includes(specialty)}
                                                                    onChange={handleFilterChange}
                                                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700"
                                                                />
                                                                {specialty}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <ErrorBoundary
                                        fallback={
                                            <div className="text-center text-red-600 dark:text-red-400 p-4">
                                                Error loading doctor listings
                                            </div>
                                        }
                                    >
                                        <div className="space-y-4">
                                            {doctorsToDisplay.map((doctor) => (
                                                <DoctorCard key={doctor.id} doctor={doctor} />
                                            ))}
                                        </div>
                                    </ErrorBoundary>
                                </div>
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