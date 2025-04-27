import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import NotFoundPage from './pages/NotFound';
import DoctorRoutes from './routes/DoctorRoutes';
import PatientRoutes from './routes/PatientRoutes';
import HomeWithLocation from './pages/HomeWithLocation';
import AboutUs from './pages/medora/AboutUs';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path='about' element={<AboutUs />} />

            {/* Location-based routes */}
            <Route path=":lang">
              <Route path=":country">
                <Route path=":city" element={<HomeWithLocation />} />
                <Route path=":city/:street" element={<HomeWithLocation />} />
              </Route>
            </Route>

            {/* Protected routes */}
            <Route
              path="dashboard/*"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            {/* Role-specific routes */}
            <Route
              path="doctor/*"
              element={
                <PrivateRoute roles={['doctor']}>
                  <DoctorRoutes />
                </PrivateRoute>
              }
            />

            <Route
              path="patient/*"
              element={
                <PrivateRoute roles={['patient']}>
                  <PatientRoutes />
                </PrivateRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
