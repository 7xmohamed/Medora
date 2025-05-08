import React from 'react';

const UserInfoSection = ({ role, appointmentData }) => {
  const UserAvatar = ({ image, name, isPatient }) => {
    const avatarClass = isPatient 
      ? 'border-blue-200 dark:border-blue-700 bg-blue-100 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400'
      : 'border-emerald-200 dark:border-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400';

    return (
      <div className="flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            className={`w-20 h-20 rounded-full border-4 object-cover shadow ${avatarClass}`}
          />
        ) : (
          <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow ${avatarClass}`}>
            {isPatient ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
              </svg>
            ) : (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="w-10 h-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zM104 424c0 13.3 10.7 24 24 24s24-10.7 24-24-10.7-24-24-24-24 10.7-24 24zm216-135.4v49c36.5 7.4 64 39.8 64 78.4v41.7c0 7.6-5.4 14.2-12.9 15.7l-32.2 6.4c-4.3.9-8.5-1.9-9.4-6.3l-3.1-15.7c-.9-4.3 1.9-8.6 6.3-9.4l19.3-3.9V416c0-62.8-96-65.1-96 1.9v26.7l19.3 3.9c4.3.9 7.1 5.1 6.3 9.4l-3.1 15.7c-.9 4.3-5.1 7.1-9.4 6.3l-31.2-4.2c-7.9-1.1-13.8-7.8-13.8-15.9V416c0-38.6 27.5-70.9 64-78.4v-45.2c-2.2.7-4.4 1.1-6.6 1.9-18 6.3-37.3 9.8-57.4 9.8s-39.4-3.5-57.4-9.8c-7.4-2.6-14.9-4.2-22.6-5.2v81.6c23.1 6.9 40 28.1 40 53.4 0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.3 16.9-46.5 40-53.4v-80.4C48.5 301 0 355.8 0 422.4v44.8C0 491.9 20.1 512 44.8 512h358.4c24.7 0 44.8-20.1 44.8-44.8v-44.8c0-72-56.8-130.3-128-133.8z"></path>
              </svg>
            )}
          </div>
        )}
      </div>
    );
  };

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
          <p
            className="truncate max-w-[140px] cursor-pointer"
            title={data.location || 'N/A'}
          >
            {data.location && data.location.length > 20
              ? data.location.slice(0, 20) + '...'
              : data.location || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
      <div className="p-6 flex flex-col md:flex-row items-start md:items-center">
        <div className="mb-4 md:mb-0 md:mr-8">
          <UserAvatar 
            image={role === 'patient' ? appointmentData.doctor_image : appointmentData.patient_image}
            name={role === 'patient' ? appointmentData.doctor_name : appointmentData.patient_name}
            isPatient={role === 'doctor'}
          />
        </div>
        {role === 'doctor' 
          ? <PatientInfo data={appointmentData} />
          : <DoctorInfo data={appointmentData} />
        }
      </div>
    </div>
  );
};

export default UserInfoSection;