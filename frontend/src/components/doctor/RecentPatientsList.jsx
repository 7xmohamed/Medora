/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { UserIcon } from '@heroicons/react/24/outline';

export default function RecentPatientsList({ patients }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden"
        >
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Patients</h3>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {patients.length > 0 ? (
                    patients.map((patient) => (
                        <div key={patient.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <UserIcon className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {patient.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Last visit: {patient.last_visit}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Total visits: {patient.total_visits}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                                    {patient.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No recent patients
                    </div>
                )}
            </div>
        </motion.div>
    );
}
