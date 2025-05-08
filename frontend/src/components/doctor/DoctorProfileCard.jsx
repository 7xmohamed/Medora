/* eslint-disable no-unused-vars */

import { motion } from 'framer-motion';
import { UserCircleIcon, BriefcaseIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function DoctorProfileCard({ doctor }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden"
        >
            <div className="p-6">
                <div className="flex items-center">
                    {doctor.profile_picture ? (
                        <img
                            src={doctor.profile_picture}
                            alt={doctor.name}
                            className="h-16 w-16 rounded-full object-cover"
                        />
                    ) : (
                        <UserCircleIcon className="h-16 w-16 text-gray-400" />
                    )}
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Dr. {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {doctor.speciality}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {doctor.experience} Years
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Patients</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {doctor.total_patients_served}+
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
