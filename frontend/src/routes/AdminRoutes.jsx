import { Routes, Route } from 'react-router-dom';
import DoctorsList from '../pages/admin/components/DoctorsList';
import AdminDashboard from '../pages/admin/AdminDashboard';

function AdminRoutes() {
    return (
        <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="doctors" element={<DoctorsList />} />
            <Route path="messages" element={<ContactMessagesSection />} />
        </Routes>
    );
}

export default AdminRoutes;