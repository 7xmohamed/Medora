import { Routes, Route } from 'react-router-dom';

export default function DoctorRoutes() {
    return (
        <Routes>
            <Route path="dashboard" element={<div>Doctor Dashboard</div>} />
            <Route path="orders" element={<div>Doctor Orders</div>} />
            <Route path="patients" element={<div>Doctor Patients</div>} />
        </Routes>
    );
}
