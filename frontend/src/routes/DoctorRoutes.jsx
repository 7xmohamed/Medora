import { Routes, Route } from 'react-router-dom';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorProfile from '../pages/doctor/DoctorProfile';

export default function DoctorRoutes() {
    return (
        <Routes>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="profile" element={<DoctorProfile />} />
        </Routes>
    );
}
