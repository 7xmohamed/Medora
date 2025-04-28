import { Routes, Route } from 'react-router-dom';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';

export default function DoctorRoutes() {
    return (
        <Routes>
            <Route path="dashboard" element={<DoctorDashboard />} />
        </Routes>
    );
}
