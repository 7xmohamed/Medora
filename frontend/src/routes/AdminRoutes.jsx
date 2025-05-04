import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../pages/admin/AdminLayout';
import OverView from '../pages/admin/pages/OverView';  // Fixed casing to match actual file
import Users from '../pages/admin/pages/Users';
import Doctors from '../pages/admin/pages/Doctors';
import ContactMessagesSection from '../pages/admin/sections/ContactMessagesSection';

function AdminRoutes() {
    return (
        <AdminLayout>
            <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<OverView />} />
                <Route path="users" element={<Users />} />
                <Route path="doctors" element={<Doctors />} />
                <Route path="messages" element={<ContactMessagesSection />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </AdminLayout>
    );
}

export default AdminRoutes;