import React from 'react';
import { FiFileText, FiFile, FiMessageSquare } from 'react-icons/fi';

const AppointmentTabs = ({ activeTab, setActiveTab, role }) => (
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
);

export default AppointmentTabs;