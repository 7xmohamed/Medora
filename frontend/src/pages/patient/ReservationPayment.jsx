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
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardHolderName: ''
  });
  const [cardType, setCardType] = useState(null);
  const [DoctorReservations, setDoctorReservations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookedSlotsData, setBookedSlotsData] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [allBookedSlotsByDate, setAllBookedSlotsByDate] = useState({});

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

  const handlePaymentDetailsChange = (field, value) => {
    if (field === 'cardNumber') {
      // Detect card type based on first digits
      const cleanedValue = value.replace(/\s+/g, '');
      
      // Visa: starts with 4
      if (/^4/.test(cleanedValue)) {
        setCardType('visa');
      } 
      // Mastercard: starts with 51-55 or 2221-2720
      else if (/^5[1-5]/.test(cleanedValue) || /^2[2-7]/.test(cleanedValue)) {
        setCardType('mastercard');
      } 
      // American Express: starts with 34 or 37
      else if (/^3[47]/.test(cleanedValue)) {
        setCardType('amex');
      } 
      else {
        setCardType(null);
      }
      
      // Format card number with spaces every 4 digits
      if (cleanedValue.length > 0) {
        const formatted = cleanedValue.match(/.{1,4}/g)?.join(' ') || cleanedValue;
        value = formatted;
      }
    } else if (field === 'expiryDate') {
      // Format expiry date as MM/YY
      const cleanedValue = value.replace(/\D/g, '');
      if (cleanedValue.length >= 3) {
        value = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`;
      } else {
        value = cleanedValue;
      }
    } else if (field === 'cvc') {
      // Limit CVC length based on card type
      const maxLength = cardType === 'amex' ? 4 : 3;
      value = value.replace(/\D/g, '').slice(0, maxLength);
    }
    
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isTimeSlotPast = (timeStr) => {
    const today = new Date();
    const selectedDate = new Date(reservation.date);

    if (selectedDate.getDate() > today.getDate() ||
      selectedDate.getMonth() > today.getMonth() ||
      selectedDate.getFullYear() > today.getFullYear()) {
      return false;
    }

    if (selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0);

      const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 30);

      return slotTime < currentTime;
    }

    return true;
  };

  const isTimeSlotUnavailable = (slot) => {
    const timeWithSeconds = `${slot}:00`;
    return bookedSlots.includes(timeWithSeconds) || isTimeSlotPast(slot);
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

    // Récupérer toutes les disponibilités pour ce jour
    const availabilities = doctor.availabilities.filter(
      avail => avail.day_of_week.toLowerCase() === dayName.toLowerCase()
    );

    // Générer et fusionner tous les créneaux horaires pour ce jour
    let slots = [];
    availabilities.forEach(availability => {
      slots = slots.concat(generateTimeSlots(availability.start_time, availability.end_time));
    });

    // Supprimer les doublons et trier les créneaux
    slots = Array.from(new Set(slots)).sort();

    setAvailableSlots(slots);
  }, [reservation.date, doctor]);

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const start = new Date(`2000/01/01 ${startTime}`);
    const end = new Date(`2000/01/01 ${endTime}`);

    const roundedStart = new Date(start);
    roundedStart.setMinutes(Math.ceil(start.getMinutes() / 30) * 30);

    const lastSlot = new Date(end);
    lastSlot.setMinutes(end.getMinutes() - 30);

    let current = roundedStart;
    while (current <= lastSlot) {
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

  // Fetch all booked slots for all dates (for disabling in the slots view)
  useEffect(() => {
    const fetchAllBookedSlots = async () => {
      try {
        const response = await api.get(`/patient/slots/${doctorId}`);
        if (response.data.status === 'success') {
          setAllBookedSlotsByDate(response.data.data || {});
        }
      } catch (err) {
        console.error('Failed to fetch all booked slots:', err);
        setError('Failed to check availability. Please try again.');
      }
    };
    fetchAllBookedSlots();
  }, []);

  const validatePayment = () => {
    if (reservation.paymentMethod === 'credit_card' || reservation.paymentMethod === 'debit_card') {
      const cardNumber = paymentDetails.cardNumber.replace(/\s/g, '');
      const expiryDate = paymentDetails.expiryDate;
      const cvc = paymentDetails.cvc;
      const cardHolderName = paymentDetails.cardHolderName;

      if (!cardNumber || !/^\d{13,16}$/.test(cardNumber)) {
        setError('Please enter a valid card number');
        return false;
      }

      if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        setError('Please enter a valid expiry date (MM/YY)');
        return false;
      }

      const [month, year] = expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        setError('Card has expired');
        return false;
      }

      const isAmex = cardType === 'amex';
      if (isAmex && (!cvc || !/^\d{4}$/.test(cvc))) {
        setError('Please enter a valid 4-digit CVC for American Express');
        return false;
      }
      if (!isAmex && (!cvc || !/^\d{3}$/.test(cvc))) {
        setError('Please enter a valid 3-digit CVC');
        return false;
      }

      if (!cardHolderName || cardHolderName.trim().length < 3) {
        setError('Please enter the cardholder name');
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
    
    if (!validatePayment()) {
      return;
    }

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
        price: doctor.price,
        payment_method: reservation.paymentMethod,
        payment_details: {
          last_four: paymentDetails.cardNumber.slice(-4),
          card_type: cardType
        }
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
                            const allBookedSlots = allBookedSlotsByDate[reservation.date] || [];
                            const isBooked = allBookedSlots.some(bs => bs.time === slot); // NOTE: remove ":00" if your DB uses "HH:mm"
                            const isPast = isTimeSlotPast(slot);
                            const isUnavailable = isPast || isBooked;
                          
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => {
                                  if (isUnavailable) return;
                                  setReservation(prev => ({
                                    ...prev,
                                    time: timeWithSeconds
                                  }));
                                }}
                                disabled={isUnavailable}
                                className={`
                                  relative flex flex-col items-center justify-center
                                  py-3 px-4 rounded-lg border text-sm
                                  transition-all duration-200
                                  ${isUnavailable
                                    ? 'cursor-not-allowed border-gray-300 bg-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                                    : reservation.time === timeWithSeconds
                                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700'
                                  }
                                `}
                              >
                                <div className="relative z-10 flex flex-col items-center">
                                  <span className={`mb-1 ${isUnavailable ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                    {formatTime(slot)}
                                  </span>
                                  {isUnavailable && (
                                    <div className="flex items-center space-x-1">
                                      <FiLock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                      <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                        {isPast ? 'Closed' : 'Booked'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {isUnavailable && (
                                  <div
                                    className="absolute inset-0 rounded-lg bg-gray-200/90 dark:bg-gray-800/90 backdrop-blur-[1px]"
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
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="flex items-center px-3 py-1 ml-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                    >
                      <FiArrowLeft className="mr-1" />
                    </button>
                    <h3 className="text-lg font-semibold mr-2">Payment</h3>
                  </div>
                </div>
                {/* Begin form for payment step */}
                <form onSubmit={handleSubmit}>
                  <div className="p-6">
                    {/* ...existing payment method and details form... */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={reservation.paymentMethod}
                        onChange={e => setReservation(prev => ({ ...prev, paymentMethod: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5"
                      >
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                      </select>
                    </div>
                    {reservation.paymentMethod === 'credit_card' || reservation.paymentMethod === 'debit_card' ? (
                      <div className="mb-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                        {/* ...existing card fields... */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={paymentDetails.cardNumber}
                              onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
                              placeholder="1234 5678 9012 3456"
                              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5 pl-12"
                              maxLength={19}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              {cardType === 'visa' && (
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 w-6" />
                              )}
                              {cardType === 'mastercard' && (
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 w-6" />
                              )}
                              {cardType === 'amex' && (
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="American Express" className="h-6 w-6" />
                              )}
                              {!cardType && (
                                <FiCreditCard className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={paymentDetails.expiryDate}
                              onChange={(e) => handlePaymentDetailsChange('expiryDate', e.target.value)}
                              placeholder="MM/YY"
                              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              CVC
                            </label>
                            <input
                              type="text"
                              value={paymentDetails.cvc}
                              onChange={(e) => handlePaymentDetailsChange('cvc', e.target.value)}
                              placeholder={cardType === 'amex' ? '4 digits' : '3 digits'}
                              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5"
                              maxLength={cardType === 'amex' ? 4 : 3}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={paymentDetails.cardHolderName}
                            onChange={(e) => handlePaymentDetailsChange('cardHolderName', e.target.value)}
                            placeholder="Name on card"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5"
                          />
                        </div>
                      </div>
                    ) : null}

                    {error && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start">
                        <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-2" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <button
                        type="submit"
                        disabled={
                          isProcessing ||
                          !paymentDetails.cardNumber ||
                          !paymentDetails.expiryDate ||
                          !paymentDetails.cvc ||
                          !paymentDetails.cardHolderName
                        }
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
                          `Confirm & Pay Dh${doctor.price}`
                        )}
                      </button>
                    </div>
                  </div>
                </form>
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