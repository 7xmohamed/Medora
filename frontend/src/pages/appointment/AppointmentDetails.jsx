import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import AppointmentHeader from './AppointmentHeader';
import UserInfoSection from './UserInfoSection';
import AppointmentTabs from './AppointmentTabs';
import DetailsTab from './DetailsTab';
import LabResultsTab from './LabResultsTab';
import ClinicalNotesTab from './ClinicalNotesTab';
import LoadingSpinner from './LoadingSpinner';

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState(null);
  const [role, setRole] = useState(null);
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

  if (loading || roleLoading) {
    return <LoadingSpinner />;
  }

  if (!appointmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="text-lg text-gray-700 dark:text-gray-200">Appointment not found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AppointmentHeader navigate={navigate} />
        
        <UserInfoSection 
          role={role} 
          appointmentData={appointmentData} 
        />
        
        <AppointmentTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          role={role} 
        />
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {activeTab === 'details' && (
            <DetailsTab appointmentData={appointmentData} />
          )}

          {activeTab === 'lab' && (
            <LabResultsTab 
              role={role}
              appointmentId={appointmentId}
            />
          )}

          {activeTab === 'notes' && (
            <ClinicalNotesTab role={role} reservationId={appointmentData.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;