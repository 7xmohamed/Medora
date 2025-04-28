import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { mockDoctors, calculateRating } from '../data/mockData';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

function DoctorCard({ doctor, index }) {
    const { average: avgRating, total: totalRatings } = calculateRating(doctor.ratings);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors"
        >
            <div className="flex gap-4">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                    <h3 className="text-xl font-bold">{doctor.name}</h3>
                    <p className="text-cyan-400">{doctor.specialty}</p>
                    <p className="text-gray-400 text-sm mt-2">{doctor.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(avgRating) ? 'text-yellow-400' : 'text-gray-600'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-gray-400 text-sm">({totalRatings})</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function HomeWithLocation() {
    const navigate = useNavigate();
    const { country, city, street } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationDetails, setLocationDetails] = useState(null);

    useEffect(() => {
        try {
            const locationData = localStorage.getItem('userLocation');
            if (!locationData) {
                throw new Error('No location selected');
            }

            const location = JSON.parse(locationData);
            setLocationDetails(location);

            // Validate URL params match stored location
            if (location.countryCode !== country ||
                location.city?.toLowerCase() !== city) {
                throw new Error('Invalid location URL');
            }

            // Simulate API call with timeout
            setTimeout(() => {
                setDoctors(mockDoctors);
                setLoading(false);
            }, 1000);

        } catch (err) {
            setError(err.message);
            setLoading(false);
            setTimeout(() => navigate('/'), 2000);
        }
    }, [navigate, country, city, street]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin mr-3 h-8 w-8 border-t-2 border-b-2 border-cyan-400 rounded-full"></div>
                <span>Loading doctors...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <p className="text-gray-400">Redirecting to home page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <Navbar />
            <main className="flex-grow py-8 pt-20 pb-24">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Doctors in {city}</h1>
                        {street && <p className="text-gray-400 mt-2">Near {street}</p>}
                        {locationDetails && (
                            <p className="text-gray-400 mt-2">
                                Coordinates: ({locationDetails.lat.toFixed(4)}, {locationDetails.lng.toFixed(4)})
                            </p>
                        )}
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        {doctors.map((doctor, index) => (
                            <DoctorCard key={doctor.id} doctor={doctor} index={index} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default HomeWithLocation;