/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  FiClock, FiCheckCircle,
  FiArrowLeft, FiAlertCircle, FiMapPin,
  FiLock, FiCopy, FiCreditCard
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

const ReservationPayment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [reservation, setReservation] = useState({
    doctor_id: doctorId,
    patient_id: 3,
    date: '',
    time: '',
    reason: '',
    paymentMethod: 'credit_card',
    price: null
  });
  const [DoctorReservations, setDoctorReservations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookedSlotsData, setBookedSlotsData] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const goToNextStep = () => {
    if (!reservation.date || !reservation.time || !reservation.reason) {
      setError('Please fill in all appointment details');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const goToPreviousStep = () => {
    setCurrentStep(1);
    setError('');
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className={`flex items-center ${currentStep === 1 ? 'text-blue-600' : 'text-gray-600'}`}>
          <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep === 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
            1
          </div>
          <span className="ml-2">Appointment</span>
        </div>
        <div className={`w-16 h-1 mx-4 ${currentStep === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        <div className={`flex items-center ${currentStep === 2 ? 'text-blue-600' : 'text-gray-600'}`}>
          <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep === 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
            2
          </div>
          <span className="ml-2">Payment</span>
        </div>
      </div>
    </div>
  );

  const handleChange = (field, value) => {
    if (field === 'time') {
      const [hours, minutes] = value.split(':');
      const formattedTime = `${hours}:${minutes}:00`;
      setReservation(prev => ({
        ...prev,
        time: formattedTime
      }));
      return;
    }
    setReservation(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'date' ? { time: '' } : {})
    }));
  };

  const isTimeSlotPast = (timeStr) => {
    const today = new Date();
    const selectedDate = new Date(reservation.date);

    // If date is in the future, slot is not past
    if (selectedDate.getDate() > today.getDate() ||
      selectedDate.getMonth() > today.getMonth() ||
      selectedDate.getFullYear() > today.getFullYear()) {
      return false;
    }

    // If same day, check if time has passed
    if (selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0);

      // Add 30 minutes buffer for booking
      const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 30);

      return slotTime < currentTime;
    }

    return true; // Past date
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await api.get(`/patient/doctorsbyid/${doctorId}`);
        setDoctor(response.data);

        const days = response.data.availabilities.map(avail => avail.day_of_week);
        setAvailableDays(days);
      } catch (err) {
        setError('Failed to load doctor information.');
      }
    };
    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    setReservation(prev => ({ ...prev, doctor_id: doctorId }));
  }, [doctorId]);

  const isDateAvailable = (date) => {
    if (!availableDays.length) return false;

    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    return availableDays.includes(dayName);
  };

  const disableDates = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;

    return !isDateAvailable(date);
  };

  useEffect(() => {
    if (!doctor || !reservation.date) return;

    const selectedDay = new Date(reservation.date).getDay();
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDay];

    // Find availability for the selected day
    const availability = doctor.availabilities.find(
      avail => avail.day_of_week.toLowerCase() === dayName.toLowerCase()
    );

    if (availability) {
      const slots = generateTimeSlots(availability.start_time, availability.end_time);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [reservation.date, doctor]);

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const start = new Date(`2000/01/01 ${startTime}`);
    const end = new Date(`2000/01/01 ${endTime}`);

    // Ensure we round to the nearest 30 minutes for the start time
    const roundedStart = new Date(start);
    roundedStart.setMinutes(Math.ceil(start.getMinutes() / 30) * 30);

    // End time should be 30 minutes before actual end
    const lastSlot = new Date(end);
    lastSlot.setMinutes(end.getMinutes() - 30);

    let current = roundedStart;
    while (current <= lastSlot) {
      // Format time as HH:mm
      const timeStr = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
      slots.push(timeStr);
      current = new Date(current.getTime() + 30 * 60000);
    }

    return slots;
  };

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!reservation.date) return;
      try {
        const response = await api.get(`/patient/reservations/booked-slots/${doctorId}`, {
          params: { date: reservation.date }
        });
        if (response.data.status === 'success') {
          const bookedSlotsData = response.data.data || [];
          setBookedSlotsData(bookedSlotsData);
          setBookedSlots(bookedSlotsData.map(slot => slot.time));
        }
      } catch (err) {
        console.error('Failed to fetch booked slots:', err);
        setError('Failed to check availability. Please try again.');
      }
    };
    fetchBookedSlots();
  }, [reservation.date, doctorId]);

  const validatePayment = (formData) => {
    if (reservation.paymentMethod === 'credit_card' || reservation.paymentMethod === 'debit_card') {
      const cardNumber = formData.get('cardNumber')?.replace(/\s/g, '');
      const expiryDate = formData.get('expiryDate');
      const cvc = formData.get('cvc');

      if (!cardNumber || !/^\d{13,16}$/.test(cardNumber)) {
        setError('Please enter a valid card number');
        return false;
      }

      if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        setError('Please enter a valid expiry date (MM/YY)');
        return false;
      }

      const isAmex = /^3[47]/.test(cardNumber);
      if (isAmex && (!cvc || !/^\d{4}$/.test(cvc))) {
        setError('Please enter a valid 4-digit CVC for American Express');
        return false;
      }
      if (!isAmex && (!cvc || !/^\d{3}$/.test(cvc))) {
        setError('Please enter a valid 3-digit CVC');
        return false;
      }
    }
    return true;
  };

  const handleReservationSuccess = (reservationTime) => {
    setBookedSlotsData(prev => [...prev, { time: reservationTime, status: 'pending' }]);
    setBookedSlots(prev => [...prev, reservationTime]);
    setPaymentSuccess(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      const [hours, minutes] = reservation.time.split(':').map(Number);
      if (minutes % 30 !== 0) {
        throw new Error('Please select a valid 30-minute time slot');
      }

      const reservationTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

      if (bookedSlots.includes(reservationTime)) {
        throw new Error('This time slot has just been booked. Please select another time.');
      }

      const reservationData = {
        doctor_id: doctorId,
        reservation_date: reservation.date,
        reservation_time: reservationTime,
        reason: reservation.reason,
        price: doctor.price
      };

      const response = await api.post('/patient/reservations', reservationData);

      if (response.data.status === 'success') {
        handleReservationSuccess(reservationTime);
      } else {
        throw new Error(response.data.message || 'Failed to create reservation');
      }
    } catch (err) {
      console.error('Reservation error:', err);
      let errorMessage = err.response?.data?.message || err.message || 'Failed to create reservation. Please try again.';

      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(doctor.location).then(() => {
      toast.success('Location copied to clipboard!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch(() => {
      toast.error('Failed to copy location');
    });
  };

  if (!doctor) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (doctor) {
    reservation.price = doctor.price;
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <FiCheckCircle className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Reservation Created!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your appointment with Dr. {doctor.name} is pending confirmation.
            It will be automatically confirmed 30 minutes before the scheduled time.
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
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              <FiClock className="mr-1.5 h-4 w-4" />
              Pending Confirmation
            </div>
          </div>
          <button
            onClick={() => navigate('/patient/profile')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
          >
            View My Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 md:p-8">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => currentStep === 1 ? navigate(-1) : goToPreviousStep()}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          {currentStep === 1 ? 'Back' : 'Back to Appointment Details'}
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div>
              <h2 className="text-xl font-bold">Dr. {doctor.user?.name || doctor.name}</h2>
              <p className="text-blue-600 dark:text-blue-400">{doctor.speciality}</p>
              <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                <FiMapPin className="mr-1 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{doctor.location}</span>
                <button
                  onClick={handleCopyLocation}
                  className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Copy full address"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <StepIndicator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {currentStep === 1 ? (
            <div className="lg:col-span-2">
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
                          {availableSlots.map((slot) => {
                            const timeWithSeconds = `${slot}:00`;
                            const isBooked = bookedSlots.includes(timeWithSeconds);
                            const bookedSlotData = bookedSlotsData.find(bs => bs.time === timeWithSeconds);

                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => !isBooked && handleChange('time', slot)}
                                disabled={isBooked}
                                className={`
                                        relative flex flex-col items-center justify-center
                                        py-3 px-4 rounded-lg border text-sm
                                        transition-all duration-200
                                        ${isBooked
                                    ? 'cursor-not-allowed border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800'
                                    : reservation.time === timeWithSeconds
                                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700'
                                  }
                                    `}
                              >
                                <div className="relative z-10 flex flex-col items-center">
                                  <span className={`mb-1 ${isBooked ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                    {formatTime(slot)}
                                  </span>

                                  {isBooked && (
                                    <div className="flex items-center space-x-1">
                                      <FiLock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                      <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                        {bookedSlotData?.status === 'confirmed' ? "Booked" : "Pending"}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {isBooked && (
                                  <div
                                    className={`
                                                absolute inset-0 rounded-lg
                                                bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-[1px]'
                                            `}
                                  ></div>
                                )}
                              </button>
                            );
                          })}
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
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={goToNextStep}
                    disabled={!reservation.date || !reservation.time || !reservation.reason}
                    className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium ${(!reservation.date || !reservation.time || !reservation.reason)
                      ? 'opacity-70 cursor-not-allowed'
                      : ''
                      }`}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold">Confirm Reservation</h3>
                </div>
                <div className="p-6">
                  {/* Reservation Summary */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="text-lg font-medium mb-4">Reservation Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Doctor:</span>
                        <span className="font-medium">Dr. {doctor.user?.name || doctor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Date:</span>
                        <span className="font-medium">{new Date(reservation.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Time:</span>
                        <span className="font-medium">{formatTime(reservation.time)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Consultation Fee:</span>
                        <span className="font-medium text-lg">${doctor.price}</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start">
                        <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-2" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        `Confirm & Pay $${doctor.price}`
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start">
            <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-2" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationPayment;