import { Routes, Route } from 'react-router-dom';

export default function PatientRoutes() {
    return (
        <Routes>
            <Route path="dashboard" element={<div>Patient Dashboard</div>} />
            <Route path="tests" element={<div>My Tests</div>} />
            <Route path="results" element={<div>My Results</div>} />
        </Routes>
    );
}
