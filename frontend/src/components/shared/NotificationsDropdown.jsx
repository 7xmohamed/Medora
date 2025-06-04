/* eslint-disable no-unused-vars */
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationsContext';
import { motion } from 'framer-motion';

export default function NotificationsDropdown() {
    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    const handleNotificationClick = (notification) => {
        if (!notification.read_at) {
            markAsRead(notification.id);
        }

        // Navigate based on notification type
        switch (notification.type) {
            case 'contact_message':
                navigate('/admin/messages');
                break;
            case 'new_reservation':
                navigate(`/doctor/appointment/${notification.data.appointment_id}`);
                break;
            case 'reservation_canceled':
                navigate(`/doctor/appointment/${notification.data.reservation_id}`);
                break;
            default:
                break;
        }
    };

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <Menu.Item key={notification.id}>
                                        {({ active }) => (
                                            <button
                                                onClick={() => handleNotificationClick(notification)}
                                                className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors ${active ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                                                    } ${!notification.read_at ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                                                    }`}
                                            >
                                                {!notification.read_at ? (
                                                    <span className="h-2 w-2 mt-2 rounded-full bg-emerald-500" />
                                                ) : (
                                                    <CheckIcon className="h-4 w-4 mt-1 text-gray-400" />
                                                )}
                                                <div>
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                    No notifications
                                </p>
                            )}
                        </div>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
