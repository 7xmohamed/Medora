import React, { useState, useEffect } from 'react';
import { FiUpload, FiFile, FiImage, FiX, FiDownload, FiFileText, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';

const ClinicalNotesTab = ({ reservationId, role }) => {
  const [activeTab, setActiveTab] = useState('doctorReport');
  const [doctorReportText, setDoctorReportText] = useState('');
  const [prescriptionText, setPrescriptionText] = useState('');
  const [files, setFiles] = useState({
    doctorReport: null,
    prescription: null,
    analysisRequest: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [reports, setReports] = useState({
    doctor_reports: [],
    prescriptions: [],
    analysis_requests: []
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get(`/reservationreports/${reservationId}`);
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    if (reservationId) fetchReports();
  }, [reservationId]);

  const handleFileChange = (fileType, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const removeFile = (fileType) => {
    setFiles(prev => ({ ...prev, [fileType]: null }));
  };

  const uploadFile = async (fileType) => {
    const file = files[fileType];
    if (!file) return;
    if (!reservationId) {
      alert('Reservation ID is missing or invalid.');
      setIsUploading(false);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('reservation_id', reservationId);

    if (fileType === 'doctorReport') {
      formData.append('report_text', doctorReportText);
    } else if (fileType === 'prescription') {
      formData.append('prescription_text', prescriptionText);
    }

    try {
      let endpoint = '';
      if (fileType === 'doctorReport') endpoint = '/doctor-report';
      else if (fileType === 'prescription') endpoint = '/prescription';
      else endpoint = '/analysis-request';

      await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });


      const reportsResponse = await api.get(`/reservationreports/${reservationId}`);
      setReports(reportsResponse.data);

      setFiles(prev => ({ ...prev, [fileType]: null }));
      if (fileType === 'doctorReport') setDoctorReportText('');
      if (fileType === 'prescription') setPrescriptionText('');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (fileType, fileId) => {
    try {
      let endpoint = '';
      if (fileType === 'doctorReport') endpoint = `/doctor-report/${fileId}`;
      else if (fileType === 'prescription') endpoint = `/prescription/${fileId}`;
      else if (fileType === 'analysisRequest') endpoint = `/analysis-request/${fileId}`;
      else return;

      await api.delete(endpoint);
      const reportsResponse = await api.get(`/reservationreports/${reservationId}`);
      setReports(reportsResponse.data);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return <FiImage className="text-blue-500" size={20} />;
    if (fileType.includes('pdf')) return <FiFileText className="text-red-500" size={20} />;
    return <FiFile className="text-gray-500" size={20} />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'doctorReport'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('doctorReport')}
        >
          Doctor Report
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'prescription'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('prescription')}
        >
          Prescription
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'analysisRequest'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('analysisRequest')}
        >
          Analysis Request
        </button>
      </div>

      {/* Doctor Report Tab */}
      {activeTab === 'doctorReport' && (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Text
            </label>
            <textarea
              value={doctorReportText}
              onChange={(e) => setDoctorReportText(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter doctor's report..."
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Report File
            </label>
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
              <FiUpload className="mr-2" />
              {files.doctorReport ? 'Change File' : 'Select File'}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange('doctorReport', e)}
                disabled={isUploading}
              />
            </label>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Supported formats: PDF, PNG, JPG (Max 5MB)
            </p>
            {files.doctorReport && (
              <div className="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(files.doctorReport.type)}
                    <span className="ml-2 truncate max-w-xs dark:text-white">
                      {files.doctorReport.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {(files.doctorReport.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile('doctorReport')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                {isUploading && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => uploadFile('doctorReport')}
                    disabled={isUploading}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      isUploading
                        ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Report'}
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Existing Reports */}
          {reports.doctor_reports.length > 0 && (
            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Previous Reports
              </h4>
              <div className="space-y-3">
                {reports.doctor_reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-700"
                  >
                    <div>
                      <p className="font-medium dark:text-white">
                        {report.report_text || 'Doctor Report'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <a
                        href={`http://localhost:8000/storage/${report.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors mr-2"
                      >
                        <FiFileText className="mr-1" /> View
                      </a>
                      <button
                        onClick={() => deleteFile('doctorReport', report.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prescription Tab */}
      {activeTab === 'prescription' && (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prescription Details
            </label>
            <textarea
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter prescription details..."
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Prescription File
            </label>
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
              <FiUpload className="mr-2" />
              {files.prescription ? 'Change File' : 'Select File'}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange('prescription', e)}
                disabled={isUploading}
              />
            </label>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Supported formats: PDF, PNG, JPG (Max 5MB)
            </p>
            {files.prescription && (
              <div className="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(files.prescription.type)}
                    <span className="ml-2 truncate max-w-xs dark:text-white">
                      {files.prescription.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {(files.prescription.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile('prescription')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                {isUploading && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => uploadFile('prescription')}
                    disabled={isUploading}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      isUploading
                        ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Prescription'}
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Existing Prescriptions */}
          {reports.prescriptions.length > 0 && (
            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Previous Prescriptions
              </h4>
              <div className="space-y-3">
                {reports.prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-700"
                  >
                    <div>
                      <p className="font-medium dark:text-white">
                        {prescription.prescription_text || 'Prescription'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(prescription.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <a
                        href={`http://localhost:8000/storage/${prescription.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors mr-2"
                      >
                        <FiFileText className="mr-1" /> View
                      </a>
                      <button
                        onClick={() => deleteFile('prescription', prescription.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analysis Request Tab */}
      {activeTab === 'analysisRequest' && (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Analysis Request
            </label>
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
              <FiUpload className="mr-2" />
              {files.analysisRequest ? 'Change File' : 'Select File'}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange('analysisRequest', e)}
                disabled={isUploading}
              />
            </label>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Supported formats: PDF, PNG, JPG (Max 5MB)
            </p>
            {files.analysisRequest && (
              <div className="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(files.analysisRequest.type)}
                    <span className="ml-2 truncate max-w-xs dark:text-white">
                      {files.analysisRequest.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {(files.analysisRequest.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile('analysisRequest')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                {isUploading && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => uploadFile('analysisRequest')}
                    disabled={isUploading}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      isUploading
                        ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Analysis'}
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Existing Analysis Requests */}
          {reports.analysis_requests.length > 0 && (
            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Previous Analysis Requests
              </h4>
              <div className="space-y-3">
                {reports.analysis_requests.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-700"
                  >
                    <div>
                      <p className="font-medium dark:text-white">
                        Analysis Request
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <a
                        href={`http://localhost:8000/storage/${analysis.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors mr-2"
                      >
                        <FiFileText className="mr-1" /> View
                      </a>
                      <button
                        onClick={() => deleteFile('analysisRequest', analysis.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClinicalNotesTab;