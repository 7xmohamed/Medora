import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';

const AppointmentHeader = ({ navigate }) => (
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
);

export default AppointmentHeader;