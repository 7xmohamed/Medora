import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import NotFoundPage from './pages/NotFound';
import DoctorRoutes from './routes/DoctorRoutes';
import PatientRoutes from './routes/PatientRoutes';
import HomeWithLocation from './pages/HomeWithLocation';
import AboutUs from './pages/medora/AboutUs';
import ContactUs from './pages/medora/ContactUs';
import AdminDashboard from './pages/admin/AdminDashboard';
import { DarkModeProvider } from './contexts/DarkModeContext';
import ForgotPassword from './pages/ForgetPassword';

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Dashboard Route - Outside Layout */}
            <Route
              path="dashboard/*"
              element={
                <PrivateRoute adminOnly>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Routes with Layout */}
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="forget-password" element={<ForgotPassword />} />

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
            </Route>

            {/* Location-based routes (outside Layout to avoid conflicts) */}
            <Route path=":lang/:country/:city" element={<HomeWithLocation />} />
            <Route path=":lang/:country/:city/:street" element={<HomeWithLocation />} />

            {/* Explicit 404 route */}
            <Route path="/404" element={<NotFoundPage />} />

            {/* Catch-all for unmatched routes */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </DarkModeProvider>

    </AuthProvider>
  );
}

export default App;