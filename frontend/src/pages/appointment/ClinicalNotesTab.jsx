import React, { useState, useEffect, Fragment } from 'react';
import { FiUpload, FiFile, FiImage, FiX, FiDownload, FiFileText, FiTrash2 } from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';
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
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, fileType: null, fileId: null });

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
      if (fileType === 'doctorReport') endpoint = 'doctor/doctor-report';
      else if (fileType === 'prescription') endpoint = 'doctor/prescription';
      else endpoint = 'doctor/analysis-request';

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
      if (fileType === 'doctorReport') endpoint = `doctor/doctor-report/${fileId}`;
      else if (fileType === 'prescription') endpoint = `doctor/prescription/${fileId}`;
      else if (fileType === 'analysisRequest') endpoint = `doctor/analysis-request/${fileId}`;
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
          {/* Only show upload section if not patient */}
          {role !== 'patient' && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report title
                </label>
                <textarea
                  value={doctorReportText}
                  onChange={(e) => setDoctorReportText(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter doctor's title..."
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Report File
                </label>
                <label
                  className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    doctorReportText.trim() === ''
                      ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <FiUpload className="mr-2" />
                  {files.doctorReport ? 'Change File' : 'Select File'}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileChange('doctorReport', e)}
                    disabled={isUploading || doctorReportText.trim() === ''}
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
            </>
          )}
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
                      {/* Only show delete for non-patient */}
                      {role !== 'patient' && (
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, fileType: 'doctorReport', fileId: report.id })}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      )}
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
          {/* Only show upload section if not patient */}
          {role !== 'patient' && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prescription title
                </label>
                <textarea
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter prescription title..."
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Prescription File
                </label>
                <label
                  className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    prescriptionText.trim() === ''
                      ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <FiUpload className="mr-2" />
                  {files.prescription ? 'Change File' : 'Select File'}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileChange('prescription', e)}
                    disabled={isUploading || prescriptionText.trim() === ''}
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
            </>
          )}
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
                      {/* Only show delete for non-patient */}
                      {role !== 'patient' && (
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, fileType: 'prescription', fileId: prescription.id })}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      )}
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
          {/* Only show upload section if not patient */}
          {role !== 'patient' && (
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
          )}
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
                      {/* Only show delete for non-patient */}
                      {role !== 'patient' && (
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, fileType: 'analysisRequest', fileId: analysis.id })}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Transition appear show={deleteModal.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setDeleteModal({ isOpen: false, fileType: null, fileId: null })}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Delete File
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this file? This action cannot be undone.
                  </p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg"
                    onClick={() => setDeleteModal({ isOpen: false, fileType: null, fileId: null })}
                  >
                    Keep File
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                    onClick={async () => {
                      if (deleteModal.fileType && deleteModal.fileId) {
                        await deleteFile(deleteModal.fileType, deleteModal.fileId);
                      }
                      setDeleteModal({ isOpen: false, fileType: null, fileId: null });
                    }}
                  >
                    Yes, Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ClinicalNotesTab;