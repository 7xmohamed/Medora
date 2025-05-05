import React, { useState, useEffect } from 'react';
import {
  FiCalendar, FiClock, FiUser, FiCreditCard, FiCheckCircle,
  FiArrowLeft, FiAlertCircle, FiMapPin, FiPhone, FiDollarSign
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const ReservationPayment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [reservation, setReservation] = useState({
    doctor_id: doctorId,
    patient_id: 3,
    date: '',
    time: '',
    reason: '',
    paymentMethod: 'credit_card',
    price:null
  });
  const [DoctorReservations, setDoctorReservations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');


  // Handle input changes
  const handleChange = (field, value) => {
    if (field === 'time' && value.length === 5) {
      value += ':00';   
    }
    setReservation(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'date' ? { time: '' } : {})
    }));
  };

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await api.get(`/patient/doctorsbyid/${doctorId}`);
        setDoctor(response.data);
      } catch (err) {
        setError('Failed to load doctor information.');
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // Update doctor_id if doctorId changes
  useEffect(() => {
    setReservation(prev => ({ ...prev, doctor_id: doctorId }));
  }, [doctorId]);

  // Generate available slots
  useEffect(() => {
    if (!doctor || !reservation.date) return;

    const selectedDay = new Date(reservation.date).getDay();
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDay];

    const slots = doctor.availabilities
      .filter(avail => avail.day_of_week === dayName)
      .flatMap(avail => {
        const slotDuration = 30;
        const times = [];
        let [sh, sm] = avail.start_time.split(':').map(Number);
        let [eh, em] = avail.end_time.split(':').map(Number);

        while (sh < eh || (sh === eh && sm < em)) {
          const timeStr = `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`;
          times.push(timeStr);
          sm += slotDuration;
          if (sm >= 60) {
            sh += 1;
            sm = sm % 60;
          }
        }

        return times;
      });

    setAvailableSlots(slots);
  }, [reservation.date, doctor]);

  // Submit reservation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);
    try {
      // Always use the latest doctor price
      const formData = new FormData();
      formData.append('doctor_id', doctorId);
      formData.append('patient_id', reservation.patient_id);
      formData.append('reservation_date', reservation.date);
      formData.append('reservation_time', reservation.time.length === 5 ? reservation.time + ':00' : reservation.time);
      formData.append('reason', reservation.reason);
      formData.append('price', doctor.price);

      await api.post('patient/reservations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPaymentSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Reservation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!doctor) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if(doctor){
    reservation.price = doctor.price;
  }
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <FiCheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Appointment Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your appointment with Dr. {doctor.name} has been successfully booked.
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
            <p className="font-medium">
              {formatTime(reservation.time)} on {new Date(reservation.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{reservation.reason}</p>
          </div>
          <button
            onClick={() => navigate('/my-appointments')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            View My Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to doctor profile
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 flex items-start">
            <img
              src={doctor.profile_picture || 'https://img.icons8.com/ios-filled/512/user-male-circle.png'}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover mr-6"
            />
            <div>
              <h2 className="text-xl font-bold">Dr. {doctor.name}</h2>
              <p className="text-blue-600 dark:text-blue-400">{doctor.speciality}</p>
              <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                <FiMapPin className="mr-1" />
                {doctor.location}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Appointment Details</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={reservation.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5"
                  required
                />
              </div>

              {reservation.date && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available Time Slots
                  </label>
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleChange('time', slot)}
                          className={`py-2 px-3 rounded-lg border text-sm ${
                            reservation.time === `${slot}:00`
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {formatTime(slot)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No available slots for this date</p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  value={reservation.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5"
                  rows="3"
                  placeholder="Briefly describe the reason for your visit"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Payment Information</h3>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 dark:text-gray-300">Consultation Fee</span>
                <span className="text-xl font-bold">${doctor.price}</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={reservation.paymentMethod}
                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                {/* Fake payment form for card methods */}
                {(reservation.paymentMethod === 'credit_card' || reservation.paymentMethod === 'debit_card') && (
                  <div className="mb-4">
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="1234 5678 9012 3456"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5"
                        autoComplete="off"
                        inputMode="numeric"
                        pattern="[0-9\s]{13,19}"
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="MM/YY"
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5"
                          autoComplete="off"
                          inputMode="numeric"
                          pattern="\d{2}/\d{2}"
                          disabled={isProcessing}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="123"
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5"
                          autoComplete="off"
                          inputMode="numeric"
                          pattern="\d{3,4}"
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {/* End fake payment form */}

                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    This is a demo. Payment will be simulated.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start">
                    <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-2" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!reservation.date || !reservation.time || !reservation.reason || isProcessing}
                  className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium ${
                    (!reservation.date || !reservation.time || !reservation.reason || isProcessing)
                      ? 'opacity-70 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Pay $${doctor.price} & Confirm Appointment`
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPayment;
