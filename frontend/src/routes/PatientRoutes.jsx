import { Routes, Route } from 'react-router-dom';
import PatientProfileView from '../pages/patient/PatientProfileView';

export default function PatientRoutes() {
    return (
        <Routes>
            <Route path='profile' element={<PatientProfileView />} />
        </Routes>
    );
}
