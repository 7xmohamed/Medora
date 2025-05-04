import { Outlet, NavLink } from 'react-router-dom';
import {
    ChartPieIcon,
    UsersIcon,
    UserGroupIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../../components/Layout/Navbar';

const navigation = [
    { name: 'Overview', href: '/admin/dashboard', icon: ChartPieIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Doctors', href: '/admin/doctors', icon: UserGroupIcon },
    { name: 'Messages', href: '/admin/messages', icon: EnvelopeIcon },
];

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <nav className="p-4 space-y-2">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`
                                }
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <main className="flex-1 ml-64 p-8 mt-16">
                    {children}
                </main>
            </div>
        </div>
    );
}