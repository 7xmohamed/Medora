import { Routes, Route, Navigate } from 'react-router-dom';

export default function PatientRoutes() {
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
}
