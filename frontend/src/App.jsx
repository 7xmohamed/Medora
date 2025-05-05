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
import { DarkModeProvider } from './contexts/DarkModeContext';
import ForgotPassword from './pages/ForgetPassword';
import ScrollToTop from './components/ScrollToTop';
import AdminRoutes from './routes/AdminRoutes';
import ReservationPayment from './pages/patient/ReservationPayment';
import AppointmentDetails from './pages/appointment/AppointmentDetails';
import Faqs from './pages/medora/Faqs';
import PrivacyPolicy from './pages/medora/PrivacyPolicy';
import Terms from './pages/medora/Terms';
import HealthTips from './pages/medora/HealthTips';
import DoctorPublicProfile from './pages/doctor/DoctorPublicProfile';

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin Dashboard Route */}
            <Route
              path="admin/*"
              element={
                <PrivateRoute adminOnly>
                  <AdminRoutes />
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
              <Route path='FAQs' element={<Faqs />} />
              <Route path='PrivacyPolicy' element={<PrivacyPolicy />} />
              <Route path='Terms' element={<Terms />} />
              <Route path='HealthTips' element={<HealthTips />} />
              <Route path="forget-password" element={<ForgotPassword />} />
              <Route path="/doctor/public/:id" element={<DoctorPublicProfile />} />

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
              <Route path="patient/reservation/:doctorId" element={<ReservationPayment />} />
              <Route path="doctor/appointment/:appointmentId" element={<AppointmentDetails />} />
              <Route path="patient/appointment/:appointmentId" element={<AppointmentDetails />} />
            </Route>

            {/* Location-based routes (outside Layout to avoid conflicts) */}
            <Route path=":lang/:country/:city" element={<HomeWithLocation />} />

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