/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { FaStar, FaRegStar, FaFilter, FaCalendarAlt, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';

const mockDoctors = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        description: "Board-certified cardiologist with 10 years of experience. Specializes in preventive cardiology and heart failure management.",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        ratings: [4, 5, 5, 4, 3],
        price: 120,
        availability: ["Mon, Jun 5", "Wed, Jun 7", "Fri, Jun 9"],
        languages: ["English", "French"],
        experience: 10,
        location: "City Medical Center, 123 Main St",
        education: "MD, Harvard Medical School",
        nextAvailable: "Mon, Jun 5 at 2:00 PM"
    },
    {
        id: 2,
        name: "Dr. Michael Chen",
        specialty: "Neurology",
        description: "Neurology specialist focusing on migraine treatment and neurodegenerative disorders. Compassionate care with evidence-based approaches.",
        image: "https://randomuser.me/api/portraits/men/42.jpg",
        ratings: [5, 5, 4, 5, 4],
        price: 150,
        availability: ["Tue, Jun 6", "Thu, Jun 8", "Sat, Jun 10"],
        languages: ["English", "Spanish"],
        experience: 8,
        location: "NeuroCare Institute, 456 Oak Ave",
        education: "PhD Neurology, Stanford University",
        nextAvailable: "Tue, Jun 6 at 10:30 AM"
    },
    {
        id: 3,
        name: "Dr. Emily Rodriguez",
        specialty: "Pediatrics",
        description: "Pediatrician with 12 years of experience. Special focus on childhood immunizations and developmental screenings.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        ratings: [5, 5, 5, 4, 5],
        price: 110,
        availability: ["Mon, Jun 5", "Tue, Jun 6", "Thu, Jun 8", "Sat, Jun 10"],
        languages: ["English", "Spanish"],
        experience: 12,
        location: "Children's Wellness Center, 789 Elm St",
        education: "MD Pediatrics, Johns Hopkins",
        nextAvailable: "Mon, Jun 5 at 9:00 AM"
    },
];

function DoctorCard({ doctor }) {
    const avgRating = doctor.ratings.reduce((a, b) => a + b, 0) / doctor.ratings.length;
    const totalRatings = doctor.ratings.length;

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-4 hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                    <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                    />
                </div>
                <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{doctor.name}</h3>
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium">{doctor.specialty}</p>
                            <div className="flex items-center mt-1">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        star <= Math.round(avgRating) ?
                                            <FaStar key={star} className="text-yellow-400 text-sm" /> :
                                            <FaRegStar key={star} className="text-gray-300 dark:text-gray-500 text-sm" />
                                    ))}
                                </div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                                    {avgRating.toFixed(1)} ({totalRatings} reviews)
                                </span>
                            </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">${doctor.price}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">/consultation</span>
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm">{doctor.description}</p>

                    <div className="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FaMapMarkerAlt className="text-emerald-400 dark:text-emerald-500 mr-2" />
                        {doctor.location}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center">
                                <FaCalendarAlt className="text-emerald-500 dark:text-emerald-400 mr-2" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Next available: {doctor.nextAvailable}</span>
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
}

function HomeWithLocation() {
    const navigate = useNavigate();
    const { country, city, street } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationDetails, setLocationDetails] = useState(null);
    const [sortOption, setSortOption] = useState('rating');
    const [filters, setFilters] = useState({
        minRating: 0,
        maxPrice: 200,
        specialties: [],
        availability: []
    });

    const allSpecialties = [...new Set(mockDoctors.map(doctor => doctor.specialty))];

    const sortedDoctors = [...doctors].sort((a, b) => {
        const avgRatingA = a.ratings.reduce((sum, rating) => sum + rating, 0) / a.ratings.length;
        const avgRatingB = b.ratings.reduce((sum, rating) => sum + rating, 0) / b.ratings.length;

        switch (sortOption) {
            case 'rating': return avgRatingB - avgRatingA;
            case 'price': return a.price - b.price;
            case 'availability': return new Date(a.nextAvailable) - new Date(b.nextAvailable);
            default: return 0;
        }
    });

    const filteredDoctors = sortedDoctors.filter(doctor => {
        const avgRating = doctor.ratings.reduce((sum, rating) => sum + rating, 0) / doctor.ratings.length;
        return (
            avgRating >= filters.minRating &&
            doctor.price <= filters.maxPrice &&
            (filters.specialties.length === 0 || filters.specialties.includes(doctor.specialty))
        );
    });

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setDoctors(mockDoctors);

            const locationData = localStorage.getItem('userLocation');
            if (!locationData) throw new Error('No location selected');

            const location = JSON.parse(locationData);
            setLocationDetails(location);

            if (location.countryCode !== country ||
                location.city?.toLowerCase() !== city?.toLowerCase()) {
                throw new Error('Invalid location URL');
            }

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            setTimeout(() => navigate('/'), 2000);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [navigate, country, city, street]);

    const handleFilterChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'specialties') {
            setFilters(prev => ({
                ...prev,
                specialties: checked
                    ? [...prev.specialties, value]
                    : prev.specialties.filter(spec => spec !== value)
            }));
        } else {
            setFilters(prev => ({ ...prev, [name]: Number(value) }));
        }
    };

    const resetFilters = () => {
        setFilters({
            minRating: 0,
            maxPrice: 200,
            specialties: [],
            availability: []
        });
    };

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

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md">
                    <p className="text-red-600 dark:text-red-400 font-medium mb-2">{error}</p>
                    <p className="text-gray-600 dark:text-gray-400">Redirecting to home page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="flex-grow py-6 pt-24">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Doctors in {city}</h1>
                        {street && <p className="text-gray-600 dark:text-gray-400 mt-1">Near {street}</p>}
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                                        <select
                                            name="minRating"
                                            value={filters.minRating}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="0">Any rating</option>
                                            <option value="3">3+ stars</option>
                                            <option value="4">4+ stars</option>
                                            <option value="4.5">4.5+ stars</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Price</label>
                                        <select
                                            name="maxPrice"
                                            value={filters.maxPrice}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="50">$50</option>
                                            <option value="100">$100</option>
                                            <option value="150">$150</option>
                                            <option value="200">$200</option>
                                            <option value="300">$300</option>
                                        </select>
                                    </div>

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
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-gray-600 dark:text-gray-400">
                                    {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} found
                                </p>
                                <div className="relative">
                                    <select
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
                                    >
                                        <option value="rating">Sort by Rating</option>
                                        <option value="price">Sort by Price</option>
                                        <option value="availability">Sort by Availability</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {filteredDoctors.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredDoctors.map((doctor) => (
                                        <DoctorCard key={doctor.id} doctor={doctor} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No doctors found</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters</p>
                                    <button
                                        onClick={resetFilters}
                                        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-sm"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default HomeWithLocation;