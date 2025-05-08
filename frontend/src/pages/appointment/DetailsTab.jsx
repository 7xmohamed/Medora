import React from 'react';
import { FiCalendar, FiClock } from 'react-icons/fi';

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

const DetailsTab = ({ appointmentData }) => (
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
          {appointmentData.time ? appointmentData.time.slice(0, 5) : ''}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
        <p>{appointmentData.specialization || 'N/A'}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
        <p>
          <span className={`px-2 py-1 rounded-full text-xs ${appointmentData.status === 'completed' || appointmentData.status === 'Completed'
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
  </div>
);

export default DetailsTab;