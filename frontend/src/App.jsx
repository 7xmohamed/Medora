import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import NotFoundPage from './pages/NotFound';
import DoctorRoutes from './routes/DoctorRoutes';
import LabRoutes from './routes/LabRoutes';
import PatientRoutes from './routes/PatientRoutes';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route path="dashboard" element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } />

            {/* Role-specific routes */}
            <Route path="doctor/*" element={
              <PrivateRoute roles={['doctor']}>
                <DoctorRoutes />
              </PrivateRoute>
            } />

            <Route path="lab/*" element={
              <PrivateRoute roles={['laboratory']}>
                <LabRoutes />
              </PrivateRoute>
            } />

            <Route path="patient/*" element={
              <PrivateRoute roles={['patient']}>
                <PatientRoutes />
              </PrivateRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
