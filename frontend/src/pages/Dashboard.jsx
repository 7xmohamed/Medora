import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
            <p className="text-gray-600">Role: {user?.role}</p>
        </div>
    );
}
