import React from 'react';
import { CalendarIcon, ChartBarIcon, UserGroupIcon, InboxIcon, CogIcon, BellIcon } from '@heroicons/react/24/outline';

export default function DoctorDashboard() {
    const stats = [
        { name: 'Today Appointments', value: '12', icon: CalendarIcon },
        { name: 'Patients Seen', value: '84', icon: UserGroupIcon },
        { name: 'Prescriptions', value: '23', icon: InboxIcon },
        { name: 'Satisfaction Rate', value: '92%', icon: ChartBarIcon },
    ];

    const upcomingAppointments = [
        { id: 1, name: 'Sarah Johnson', time: '09:30 AM', reason: 'Follow-up' },
        { id: 2, name: 'Michael Chen', time: '11:15 AM', reason: 'Annual Checkup' },
        { id: 3, name: 'Emma Wilson', time: '02:00 PM', reason: 'Vaccination' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <BellIcon className="h-6 w-6 text-gray-500" />
                        <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full" src="https://placehold.co/100" alt="Doctor" />
                            <span className="ml-2 text-sm font-medium">Dr. Smith</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <stat.icon className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Appointments */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Appointments</h3>
                    </div>
                    <div className="bg-white overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {upcomingAppointments.map((appointment) => (
                                <li key={appointment.id}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-blue-600 truncate">{appointment.name}</div>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {appointment.time}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <div className="mr-6 flex items-center text-sm text-gray-500">
                                                    {appointment.reason}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                New Prescription
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                View Patient Records
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}