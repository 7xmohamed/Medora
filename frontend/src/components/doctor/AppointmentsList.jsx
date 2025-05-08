/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    UserIcon,
    CalendarIcon,
    ClockIcon,
    ArrowRightIcon,
    MapPinIcon,
    CheckCircleIcon,
    ClockIcon as PendingIcon
} from '@heroicons/react/24/outline';

const AppointmentsList = ({ appointments, showDate = true, isPast = false, compact = false }) => {
    const navigate = useNavigate();

    if (!appointments || appointments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-full p-4 mb-4">
                    <CalendarIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    No appointments found
                </p>
            </div>
        );
    }

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />;
            case 'pending':
                return <PendingIcon className="h-5 w-5 text-yellow-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-3">
            {appointments.map((appointment) => (
                <div
                    key={appointment.id}
                    onClick={() => navigate(`/${isPast ? 'doctor' : 'patient'}/Appointment/${appointment.id}`)}
                    className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-emerald-600" />
                    <div className="p-4 pl-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <UserIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {appointment.patient_name}
                                    </h3>
                                    <div className="mt-1 space-y-1">
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                            <MapPinIcon className="h-4 w-4" />
                                            <span className="truncate max-w-[200px]">
                                                {appointment.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            {showDate && (
                                                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <CalendarIcon className="h-4 w-4 mr-1.5" />
                                                    {new Date(appointment.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            )}
                                            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <ClockIcon className="h-4 w-4 mr-1.5" />
                                                {appointment.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                                    ${appointment.status === 'completed'
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}
                                >
                                    {getStatusIcon(appointment.status)}
                                    <span className="ml-1.5">{appointment.status}</span>
                                </span>
                                <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                                    <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AppointmentsList;
