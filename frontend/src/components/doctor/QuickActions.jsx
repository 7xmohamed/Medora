/* eslint-disable no-unused-vars */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    DocumentTextIcon,
    CalendarIcon,
    UserGroupIcon,
    CogIcon,
} from '@heroicons/react/24/outline';

export default function QuickActions() {
    const actions = [
        {
            name: 'Write Prescription',
            icon: DocumentTextIcon,
            description: 'Create a new prescription',
            href: '/doctor/prescriptions/new',
            color: 'blue'
        },
        {
            name: 'Schedule Appointment',
            icon: CalendarIcon,
            description: 'Set up a new appointment',
            href: '/doctor/appointments/schedule',
            color: 'emerald'
        },
        {
            name: 'Patient Records',
            icon: UserGroupIcon,
            description: 'View patient histories',
            href: '/doctor/patients',
            color: 'indigo'
        },
        {
            name: 'Settings',
            icon: CogIcon,
            description: 'Manage your profile',
            href: '/doctor/profile',
            color: 'gray'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden"
        >
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
                {actions.map((action) => (
                    <Link
                        key={action.name}
                        to={action.href}
                        className={`p-4 rounded-lg border border-${action.color}-100 dark:border-${action.color}-900/30 
              hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/10 
              group transition-colors duration-200`}
                    >
                        <action.icon
                            className={`h-6 w-6 text-${action.color}-500 dark:text-${action.color}-400 
                group-hover:text-${action.color}-600 dark:group-hover:text-${action.color}-300 
                transition-colors duration-200`}
                        />
                        <h4 className="mt-2 font-medium text-gray-900 dark:text-white">{action.name}</h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}
