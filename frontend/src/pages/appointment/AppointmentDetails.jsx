import React, { useState } from 'react';
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

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  // Mock appointment data - replace with API call
  const appointmentData = {
    id: appointmentId,
    patient: {
      name: "Sarah Johnson",
      age: 42,
      gender: "Female",
      email: "sarah.johnson@example.com",
      phone: "(555) 123-4567",
      photo: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    details: {
      date: "2023-07-15T10:00:00",
      type: "Follow-up Consultation",
      status: "Completed",
      reason: "Cardiac follow-up and test results review",
      duration: "30 minutes"
    },
    medicalHistory: [
      "Hypertension (2018-present)",
      "Type 2 Diabetes (2020-present)",
      "Previous cardiac catheterization (2021)"
    ],
    labResults: [
      {
        id: 1,
        name: "Complete Blood Count",
        date: "2023-07-10",
        file: "/reports/cbc_july2023.pdf",
        type: "pdf"
      },
      {
        id: 2,
        name: "Electrocardiogram",
        date: "2023-07-12",
        file: "/reports/ecg_july2023.png",
        type: "image"
      },
      {
        id: 3,
        name: "Cholesterol Panel",
        date: "2023-07-12",
        file: "/reports/cholesterol_july2023.pdf",
        type: "pdf"
      }
    ],
    previousPrescriptions: [
      "Atorvastatin 20mg - Daily",
      "Metformin 500mg - Twice daily",
      "Lisinopril 10mg - Daily"
    ]
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Simulate upload progress
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
    console.log("Uploading file:", selectedFile);
    // Reset after upload
    setTimeout(() => {
      setSelectedFile(null);
      setUploadProgress(0);
    }, 1000);
  };

  const handleSaveNotes = () => {
    // Save notes to backend
    console.log("Saving notes:", notes);
  };

  const handleSavePrescription = () => {
    // Save prescription to backend
    console.log("Saving prescription:", prescription);
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

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

        {/* Patient summary card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 flex flex-col md:flex-row items-start md:items-center">
            <img 
              src={appointmentData.patient.photo} 
              alt={appointmentData.patient.name}
              className="w-16 h-16 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{appointmentData.patient.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                  <p>{appointmentData.patient.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                  <p>{appointmentData.patient.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="truncate">{appointmentData.patient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p>{appointmentData.patient.phone}</p>
                </div>
              </div>
            </div>
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
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'notes' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <FiMessageSquare className="inline mr-2" />
              Clinical Notes
            </button>
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
                    {formatDate(appointmentData.details.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                  <p className="flex items-center">
                    <FiClock className="mr-2 text-blue-500" />
                    {formatTime(appointmentData.details.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p>{appointmentData.details.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      appointmentData.details.status === 'Completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {appointmentData.details.status}
                    </span>
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reason for Visit</p>
                  <p>{appointmentData.details.reason}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Medical History</h3>
              <ul className="list-disc pl-5 mb-8 space-y-2">
                {appointmentData.medicalHistory.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mb-4">Current Prescriptions</h3>
              <ul className="list-disc pl-5 space-y-2">
                {appointmentData.previousPrescriptions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'lab' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Lab Results & Reports</h3>
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
                {appointmentData.labResults.map(result => (
                  <div key={result.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {result.type === 'pdf' ? (
                          <FiFile className="text-red-500 mr-3" />
                        ) : (
                          <FiImage className="text-blue-500 mr-3" />
                        )}
                        <div>
                          <h4 className="font-medium">{result.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded: {result.date}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a 
                          href={result.file} 
                          download
                          className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
                          title="Download"
                        >
                          <FiDownload />
                        </a>
                        <a 
                          href={result.file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
                          title="View"
                        >
                          <FiFileText />
                        </a>
                        <button className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400">
                          <FiPrinter />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
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