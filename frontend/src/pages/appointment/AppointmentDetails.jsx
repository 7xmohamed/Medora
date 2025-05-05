import React, { use, useEffect, useState } from 'react';
import { 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiFileText, 
  FiUpload, 
  FiDownload,
  FiPrinter,
  FiMessageSquare,
  FiArrowLeft,
  FiFile,
  FiImage
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/role');
        if (response.status === 200) {
          const role = response.data.role;
          setRole(role);
        } else {
          console.error("Error fetching user role:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchUserData();
  }, []);


  useEffect(() => {
    const fetchAppointmentData = async () => {
      setLoading(true);
      try {
        let response;
        if(role === 'doctor') {
          response = await api.get(`/doctor/getAppointments/${appointmentId}`);
        }else if(role === 'patient') {
          response = await api.get(`patient/getAppointments/${appointmentId}`);
        }
        if (response && response.status === 200) {
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
    if (role) {
      fetchAppointmentData();
    }
  }, [appointmentId, role]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  const handleUpload = () => {
    // Here you would typically upload to your backend
    setTimeout(() => {
      setSelectedFile(null);
      setUploadProgress(0);
    }, 1000);
  };

  const handleSaveNotes = () => {
    // Save notes to backend
    // ...existing code...
  };

  const handleSavePrescription = () => {
    // Save prescription to backend
    // ...existing code...
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
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

  // Helper for doctor info
  const DoctorInfo = ({ data }) => (
    <div className="flex-1">
      <h2 className="text-xl font-bold">{data.doctor_name}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Specialization</p>
          <p>{data.specialization || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
          <p className="truncate">{data.doctor_email || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
          <p>{data.doctor_phone || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
          <p>{data.location || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

  // Helper for patient info
  const PatientInfo = ({ data }) => (
    <div className="flex-1">
      <h2 className="text-xl font-bold">{data.patient_name}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">date of birth</p>
          <p>{data.patient_age ? data.patient_age : 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
          <p>{data.patient_gender || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
          <p className="truncate">{data.patient_email || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
          <p>{data.patient_phone || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">Appointment Details</h1>
        </div>

        {/* Summary card: show doctor or patient info based on role */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 flex flex-col md:flex-row items-start md:items-center">
            <img 
              src={
                role === 'doctor'
                  ? "https://randomuser.me/api/portraits/lego/1.jpg"
                  : "https://randomuser.me/api/portraits/lego/2.jpg"
              }
              alt={role === 'doctor'
                ? appointmentData.patient_name
                : appointmentData.doctor_name}
              className="w-16 h-16 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
            />
            {role === 'doctor'
              ? <PatientInfo data={appointmentData} />
              : <DoctorInfo data={appointmentData} />
            }
          </div>
        </div>

        {/* Main content tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'details' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <FiFileText className="inline mr-2" />
              Appointment Details
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'lab' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <FiFile className="inline mr-2" />
              Lab Results
            </button>
            {/* Only show Clinical Notes tab if NOT patient */}
            {role !== 'patient' && (
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'notes' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                <FiMessageSquare className="inline mr-2" />
                Clinical Notes
              </button>
            )}
          </nav>
        </div>

        {/* Tab content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {activeTab === 'details' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Appointment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                  <p className="flex items-center">
                    <FiCalendar className="mr-2 text-blue-500" />
                    {formatDate(appointmentData.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                  <p className="flex items-center">
                    <FiClock className="mr-2 text-blue-500" />
                    {appointmentData.time ? appointmentData.time.slice(0,5) : ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p>{appointmentData.specialization || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      appointmentData.status === 'completed' || appointmentData.status === 'Completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {appointmentData.status}
                    </span>
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reason for Visit</p>
                  <p>{appointmentData.reason || 'N/A'}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Medical History</h3>
              <ul className="list-disc pl-5 mb-8 space-y-2">
                {(appointmentData.medical_history && Array.isArray(appointmentData.medical_history) && appointmentData.medical_history.length > 0)
                  ? appointmentData.medical_history.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  : <li>No medical history found.</li>
                }
              </ul>

              {/* You can add prescriptions here if available */}
            </div>
          )}

          {activeTab === 'lab' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Lab Results & Reports</h3>
                {/* Only show upload button if NOT patient */}
                {role !== 'patient' && (
                  <div>
                    <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer">
                      <FiUpload className="mr-2" />
                      Upload Report
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* File upload preview */}
              {selectedFile && (
                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {selectedFile.type.includes('image') ? (
                        <FiImage className="text-blue-500 mr-2" />
                      ) : (
                        <FiFile className="text-blue-500 mr-2" />
                      )}
                      <span>{selectedFile.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{Math.round(selectedFile.size / 1024)} KB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-end mt-3">
                    {uploadProgress >= 100 ? (
                      <span className="text-green-500 text-sm">Upload complete!</span>
                    ) : (
                      <button 
                        onClick={handleUpload}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Lab results list */}
              <div className="space-y-4">
                {/* Placeholder: No lab results from backend */}
                <div className="text-gray-500 dark:text-gray-400">No lab results available.</div>
              </div>
            </div>
          )}

          {/* Only render Clinical Notes tab content if NOT patient */}
          {activeTab === 'notes' && role !== 'patient' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Clinical Notes</h3>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Examination Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                  placeholder="Enter your clinical notes from this appointment..."
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Save Notes
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">New Prescription</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prescription Details
                </label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                  placeholder="Enter prescription details..."
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSavePrescription}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Save Prescription
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;