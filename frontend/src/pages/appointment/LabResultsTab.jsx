import React, { useEffect, useState, Fragment } from 'react';
import { FiUpload, FiFile, FiImage, FiDownload, FiTrash2 } from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';
import api from '../../services/api';

const LabResultsTab = ({ role, appointmentId }) => {
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, fileId: null });

  const fetchLabResults = async () => {
    setLoading(true);
    try {
      const response = await api.post('/list-lab-results', { appointment_id: appointmentId });
      if (response.status === 200) {
        setLabResults(response.data);
      }
    } catch (error) {
      console.error('Error fetching lab results:', error);
      setLabResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) fetchLabResults();
    // eslint-disable-next-line
  }, [appointmentId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('appointment_id', appointmentId);

    try {
      setIsUploading(true);
      const response = await api.post('patient/upload-lab-result', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        }
      });

      if (response.status === 200 || response.status === 201) {
        fetchLabResults();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
      }, 2000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`patient/delete-lab-result/${id}`);
      fetchLabResults();
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Lab Results & Reports</h3>
        {role !== 'doctor' && (
          <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer">
            <FiUpload className="mr-2" />
            Upload Report
            <input
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>

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
              <span className="text-blue-600 text-sm">Uploading...</span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        ) : labResults.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">No lab results available.</div>
        ) : (
          labResults.map((file) => ( 
            <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center">
                {file.file_path.toLowerCase().endsWith('.pdf') ? (
                  <FiFile className="text-blue-500 mr-2" />
                ) : (
                  <FiImage className="text-blue-500 mr-2" />
                )}
                <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="underline">
                  lab analytic 
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={file.file_url}
                  download={file.file_path.split('/').pop()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiDownload className="text-green-600 cursor-pointer" title="Download" />
                </a>
                {role !== 'doctor' && (
                  <button onClick={() => setDeleteModal({ isOpen: true, fileId: file.id })}>
                    <FiTrash2 className="text-red-600 cursor-pointer" title="Delete" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Delete Confirmation Modal */}
      <Transition appear show={deleteModal.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setDeleteModal({ isOpen: false, fileId: null })}>
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
                    onClick={() => setDeleteModal({ isOpen: false, fileId: null })}
                  >
                    Keep File
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                    onClick={async () => {
                      if (deleteModal.fileId) {
                        await handleDelete(deleteModal.fileId);
                      }
                      setDeleteModal({ isOpen: false, fileId: null });
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

export default LabResultsTab;
