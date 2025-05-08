/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiFileText,
  FiUpload,
  FiMessageSquare,
  FiArrowLeft,
  FiFile,
  FiImage,
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiActivity,
  FiMapPin
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const DetailCard = ({ title, icon: Icon, children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden ${className}`}>
    <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-white" />
        <h2 className="text-lg font-medium text-white">{title}</h2>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center py-3 px-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
    <div className="flex-shrink-0">
      <Icon className="h-5 w-5 text-emerald-500" />
    </div>
    <div className="ml-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-gray-900 dark:text-white font-medium">{value || 'N/A'}</p>
    </div>
  </div>
);

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-all
      ${isActive
        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </button>
);

const LoadingCard = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
    <div className="h-14 bg-gray-200 dark:bg-gray-700" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState(null);
  const [role, setRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/role');
        if (response.status === 200) {
          setRole(response.data.role);
        } else {
          console.error("Error fetching user role:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setRoleLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const fetchAppointmentData = async () => {
    setLoading(true);
    try {
      let response;
      if (role === 'doctor') {
        response = await api.get(`/doctor/getAppointments/${appointmentId}`);
      } else if (role === 'patient') {
        response = await api.get(`/patient/getAppointments/${appointmentId}`);
      }
      if (response?.status === 200) {
        setAppointmentData(response.data.data);
      } else {
        setAppointmentData(null);
      }
    } catch (error) {
      setAppointmentData(null);
      console.error("Error fetching appointment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role) {
      fetchAppointmentData();
    }
  }, [appointmentId, role]);

  useEffect(() => {
    return () => {
      setAppointmentData(null);
      setLoading(true);
    };
  }, []);

  if (!appointmentId) {
    return navigate('/patient/profile');
  }

  const formatDate = (dateTime) => {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5
      ${status === 'completed' || status === 'Completed'
        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      }`}
    >
      {status === 'completed' || status === 'Completed' ? (
        <FiCheckCircle className="w-4 h-4" />
      ) : (
        <FiClock className="w-4 h-4" />
      )}
      {status}
    </span>
  );

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 mb-8 bg-white dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <LoadingCard />
              <LoadingCard />
            </div>
            <div className="lg:col-span-2">
              <LoadingCard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="text-lg text-gray-700 dark:text-gray-200">Appointment not found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Appointment Details
                </h1>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  #{appointmentId}
                </p>
              </div>
            </div>
            <StatusBadge status={appointmentData.status} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <DetailCard
              title={role === 'doctor' ? 'Patient Information' : 'Doctor Information'}
              icon={FiUser}
            >
              <div className="space-y-3">
                <InfoRow
                  label="Name"
                  value={role === 'doctor' ? appointmentData.patient_name : appointmentData.doctor_name}
                  icon={FiUser}
                />
                <InfoRow
                  label="Email"
                  value={role === 'doctor' ? appointmentData.patient_email : appointmentData.doctor_email}
                  icon={FiMail}
                />
                <InfoRow
                  label="Phone"
                  value={role === 'doctor' ? appointmentData.patient_phone : appointmentData.doctor_phone}
                  icon={FiPhone}
                />
                {role === 'doctor' ? (
                  <>
                    <InfoRow label="Gender" value={appointmentData.patient_gender} icon={FiUser} />
                    <InfoRow label="Date of Birth" value={appointmentData.patient_age} icon={FiCalendar} />
                  </>
                ) : (
                  <>
                    <InfoRow label="Specialization" value={appointmentData.specialization} icon={FiActivity} />
                    <InfoRow label="Location" value={appointmentData.location} icon={FiMapPin} />
                  </>
                )}
              </div>
            </DetailCard>

            <DetailCard title="Schedule Details" icon={FiCalendar}>
              <div className="space-y-3">
                <InfoRow
                  label="Date"
                  value={formatDate(appointmentData.date)}
                  icon={FiCalendar}
                />
                <InfoRow
                  label="Time"
                  value={appointmentData.time.slice(0, 5)}
                  icon={FiClock}
                />
                {appointmentData.price && (
                  <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-700 dark:text-emerald-300">Consultation Fee</span>
                      <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                        ${appointmentData.price}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </DetailCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <nav className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <TabButton
                    icon={FiFileText}
                    label="Medical History"
                    isActive={activeTab === 'details'}
                    onClick={() => setActiveTab('details')}
                  />
                  <TabButton
                    icon={FiFile}
                    label="Lab Results"
                    isActive={activeTab === 'lab'}
                    onClick={() => setActiveTab('lab')}
                  />
                  {role !== 'patient' && (
                    <TabButton
                      icon={FiMessageSquare}
                      label="Clinical Notes"
                      isActive={activeTab === 'notes'}
                      onClick={() => setActiveTab('notes')}
                    />
                  )}
                </div>
              </nav>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Reason for Visit
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        {appointmentData.reason || 'No reason provided'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Medical History
                      </h3>
                      <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                        {appointmentData.medical_history?.length > 0
                          ? appointmentData.medical_history.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                          : <li>No medical history available</li>
                        }
                      </ul>
                    </div>
                  </div>
                )}

                {/* ... existing tab content ... */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentDetails;