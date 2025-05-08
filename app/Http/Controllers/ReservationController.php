<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Reservation;
use App\Models\PaymentRefund;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    // doctor availability
    public function getAvailability($doctorId, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 400);
        }

        try {
            $doctor = Doctor::findOrFail($doctorId);
            $date = Carbon::parse($request->date);
            $dayOfWeek = strtolower($date->englishDayOfWeek);

            $availability = $doctor->availabilities()
                ->where('day_of_week', $dayOfWeek)
                ->first();

            if (!$availability) {
                return response()->json([
                    'status' => 'success',
                    'data' => []
                ]);
            }

            $bookedSlots = Reservation::where('doctor_id', $doctorId)
                ->whereDate('reservation_date', $date)
                ->whereIn('reservation_status', ['pending', 'confirmed']) // Update status check
                ->pluck('reservation_time')
                ->toArray();

            $start = Carbon::parse($availability->start_time);
            $end = Carbon::parse($availability->end_time);
            
            $lastPossibleSlot = $end->copy()->subMinutes(30);
            
            $slots = [];
            $current = $start->copy();
            
            if ($current->minute % 30 !== 0) {
                $current->minute(ceil($current->minute / 30) * 30);
            }

            while ($current->lte($lastPossibleSlot)) {
                $time = $current->format('H:i:s');
                if (!in_array($time, $bookedSlots)) {
                    $slots[] = $time;
                }
                $current->addMinutes(30);
            }

            return response()->json([
                'status' => 'success',
                'data' => $slots
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch availability'
            ], 500);
        }
    }

    public function createReservation(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || $user->role !== 'patient') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only patients can make reservations'
                ], 403);
            }

            $patient = Patient::where('user_id', $user->id)->first();
            if (!$patient) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Patient profile not found'
                ], 404);
            }
        
            $validator = Validator::make($request->all(), [
                'doctor_id' => 'required|exists:doctors,id',
                'reservation_date' => 'required|date|after_or_equal:today',
                'reservation_time' => [
                    'required',
                    'date_format:H:i:s',
                ],
                'reason' => 'required|string|max:500',
                'price' => 'required|numeric|gt:0'
            ]);
        
            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $validator->errors()->first()
                ], 422);
            }

            // Validate time format and 30-minute intervals
            $time = Carbon::parse($request->reservation_time);
            $minutes = (int)$time->format('i');
            
            if ($minutes % 30 !== 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Please select a valid time slot (every 30 minutes)'
                ], 422);
            }

            // Convert times for comparison
            $requestDateTime = Carbon::parse($request->reservation_date . ' ' . $request->reservation_time);
            $dayOfWeek = strtolower($requestDateTime->format('l'));

            // Get doctor availability
            $doctor = Doctor::findOrFail($request->doctor_id);
            $availability = $doctor->availabilities()
                ->where('day_of_week', $dayOfWeek)
                ->first();

            if (!$availability) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Doctor is not available on {$dayOfWeek}s"
                ], 400);
            }

            // Compare time within working hours
            $startTime = Carbon::parse($request->reservation_date . ' ' . $availability->start_time);
            $endTime = Carbon::parse($request->reservation_date . ' ' . $availability->end_time);

            if ($requestDateTime < $startTime || $requestDateTime >= $endTime) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Doctor's working hours are between {$startTime->format('H:i')} and {$endTime->format('H:i')}"
                ], 400);
            }

            // Check for existing reservations at the same time
            $existingReservation = Reservation::where('doctor_id', $request->doctor_id)
                ->whereDate('reservation_date', $request->reservation_date)
                ->whereTime('reservation_time', $request->reservation_time)
                ->whereIn('reservation_status', ['pending', 'confirmed'])
                ->first();

            if ($existingReservation) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This time slot has already been booked'
                ], 409);
            }

            // Check if patient already has a reservation at the same time
            $existingPatientReservation = Reservation::where('patient_id', $patient->id)
                ->whereDate('reservation_date', $request->reservation_date)
                ->whereTime('reservation_time', $request->reservation_time)
                ->whereIn('reservation_status', ['pending', 'confirmed'])
                ->first();

            if ($existingPatientReservation) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You already have a reservation at this time'
                ], 409);
            }

            // Create reservation with proper time format
            $reservation = new Reservation();
            $reservation->patient_id = $patient->id;
            $reservation->doctor_id = $request->doctor_id;
            $reservation->price = $request->price;
            $reservation->payment_status = 'paid';
            $reservation->reservation_status = 'pending'; // Changed from 'confirmed' to 'pending'
            $reservation->reason = $request->reason;
            $reservation->reservation_date = $request->reservation_date;
            $reservation->reservation_time = $request->reservation_time;

            if (!$reservation->save()) {
                throw new \Exception('Failed to save reservation');
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Reservation created successfully',
                'data' => $reservation
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Reservation creation failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create reservation. Please try again later.'
            ], 500);
        }
    }

    private function findNextAvailableSlot(Doctor $doctor, Carbon $date, Carbon $time)
    {
        $maxAttempts = 5;
        $attempts = 0;
        $currentDate = $date->copy();

        while ($attempts < $maxAttempts) {
            $dayOfWeek = $currentDate->format('l');
            $availability = $doctor->availabilities()
                ->where('day_of_week', $dayOfWeek)
                ->first();

            if ($availability) {
                $startTime = Carbon::parse($availability->start_time);
                $endTime = Carbon::parse($availability->end_time);
                $currentTime = $attempts === 0 ? $time->copy()->addMinutes(30) : $startTime;

                while ($currentTime->lt($endTime)) {
                    $existingReservation = Reservation::where('doctor_id', $doctor->id)
                        ->whereDate('reservation_date', $currentDate)
                        ->whereTime('reservation_time', $currentTime->format('H:i:s'))
                        ->whereIn('reservation_status', ['confirmed', 'pending_payment'])
                        ->doesntExist();

                    if ($existingReservation) {
                        return $currentDate->setTime($currentTime->hour, $currentTime->minute);
                    }

                    $currentTime->addMinutes(30);
                }
            }

            $currentDate->addDay();
            $attempts++;
        }

        return null;
    }

    public function getDoctorReservations($doctorId)
    {
        $reservations = Reservation::where('doctor_id', $doctorId)->get();
        if ($reservations->isEmpty()) {
            return response()->json(['message' => 'No reservations found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $reservations
        ]);
    }

    public function getPatientReservations(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user || !$user->patient) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Patient profile not found'
                ], 404);
            }

            $reservations = Reservation::where('patient_id', $user->patient->id)
                ->with(['doctor.user']) // Eager load relationships
                ->orderBy('reservation_date', 'desc')
                ->orderBy('reservation_time', 'desc')
                ->get();
                
            return response()->json([
                'status' => 'success',
                'data' => $reservations->map(function ($reservation) {
                    try {
                        $dateTime = Carbon::parse($reservation->reservation_date . ' ' . $reservation->reservation_time);
                        
                        return [
                            'id' => $reservation->id,
                            'doctor_name' => $reservation->doctor->user->name ?? 'Unknown Doctor',
                            'specialization' => $reservation->doctor->speciality ?? 'Unknown',
                            'date_time' => $dateTime->format('Y-m-d\TH:i:s'),
                            'status' => $reservation->reservation_status,
                            'location' => $reservation->doctor->location ?? 'Unknown Location',
                        ];
                    } catch (\Exception $e) {
                        \Log::error('Error formatting reservation:', [
                            'reservation_id' => $reservation->id,
                            'error' => $e->getMessage()
                        ]);
                        
                        // Return a safely formatted version if date parsing fails
                        return [
                            'id' => $reservation->id,
                            'doctor_name' => $reservation->doctor->user->name ?? 'Unknown Doctor',
                            'specialization' => $reservation->doctor->speciality ?? 'Unknown',
                            'date_time' => Carbon::now()->format('Y-m-d\TH:i:s'),
                            'status' => $reservation->reservation_status,
                            'location' => $reservation->doctor->location ?? 'Unknown Location',
                        ];
                    }
                })
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching patient reservations:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch reservations',
                'debug_message' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function getReservationById($id)
    {
        $reservation = Reservation::find($id);
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $reservation
        ]);
    }
    
    public function cancelReservation($reservationId)
    {
        DB::beginTransaction();
        try {
            $reservation = Reservation::with(['doctor', 'patient'])->find($reservationId);

            if (!$reservation) {
                DB::rollBack();
                return response()->json([
                    'status' => 'error',
                    'message' => 'Reservation not found'
                ], 404);
            }

            if (!$reservation->doctor || !$reservation->patient) {
                DB::rollBack();
                \Log::error('Cancel reservation failed: doctor or patient missing', [
                    'reservation_id' => $reservationId,
                    'doctor' => $reservation->doctor,
                    'patient' => $reservation->patient,
                ]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Doctor or patient information missing for this reservation'
                ], 500);
            }

            $doctor = $reservation->doctor;
            $currentRevenue = $doctor->total_revenue ?? 0;
            $currentMonthlyRevenue = $doctor->monthly_revenue ?? 0;

            $isCurrentMonth = Carbon::parse($reservation->created_at)->month === now()->month;

            $reservation->update([
                'reservation_status' => 'canceled',
                'updated_at' => now()
            ]);

            if ($reservation->payment_status === 'paid') {
                PaymentRefund::create([
                    'reservation_id' => $reservation->id,
                    'patient_id' => auth()->id(),
                    'doctor_id' => $doctor->id,
                    'amount' => $reservation->price,
                    'status' => 'processed',
                    'refund_date' => now()
                ]);
            }

            $doctor->refresh();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Reservation canceled successfully',
                'data' => [
                    'reservation_id' => $reservationId,
                    'previous_total_revenue' => $currentRevenue,
                    'new_total_revenue' => $doctor->total_revenue,
                    'previous_monthly_revenue' => $currentMonthlyRevenue,
                    'new_monthly_revenue' => $doctor->monthly_revenue,
                    'refunded_amount' => $reservation->price
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Cancellation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to cancel reservation',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function getBookedSlots($doctorId, Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'date' => 'required|date'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $validator->errors()->first()
                ], 400);
            }

            // Get only reserved slots (pending or confirmed)
            $bookedSlots = Reservation::where('doctor_id', $doctorId)
                ->whereDate('reservation_date', $request->date)
                ->whereIn('reservation_status', ['pending', 'confirmed'])
                ->get(['reservation_time', 'reservation_status'])
                ->map(function($reservation) {
                    return [
                        'time' => $reservation->reservation_time,
                        'status' => $reservation->reservation_status
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data' => $bookedSlots
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch booked slots'
            ], 500);
        }
    }
}