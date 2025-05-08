/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import api from '../../services/api';

export default function AllAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/doctor/appointments');
            setAppointments(response.data.appointments);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <Link to="/doctor/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">All Status</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAppointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{appointment.patient_name}</div>
                                                <div className="text-sm text-gray-500">{appointment.patient_email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-gray-900">{appointment.date}</div>
                                                <div className="text-sm text-gray-500">{appointment.time}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">{appointment.type}</td>
                                        <td className="px-6 py-4 text-gray-900">{appointment.price} dh</td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/appointment/${appointment.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredAppointments.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No appointments found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function getStatusColor(status) {
    switch (status?.toLowerCase()) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}
