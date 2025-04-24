import { Routes, Route } from 'react-router-dom';

export default function LabRoutes() {
    return (
        <Routes>
            <Route path="dashboard" element={<div>Laboratory Dashboard</div>} />
            <Route path="tests" element={<div>Laboratory Tests</div>} />
            <Route path="results" element={<div>Laboratory Results</div>} />
        </Routes>
    );
}
