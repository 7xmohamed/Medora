<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
                ->whereIn('reservation_status', ['confirmed', 'pending_payment'])
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
                    function ($attribute, $value, $fail) {
                        $time = Carbon::parse($value);
                        if ($time->minute % 30 !== 0) {
                            $fail('Reservation time must be in 30-minute intervals.');
                        }
                    },
                ],
                'reason' => 'required|string|max:500',
                'price' => 'required|numeric|gt:0'
            ]);
        
            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if patient already has a reservation at the same time
            $existingPatientReservation = Reservation::where('patient_id', $patient->id)
                ->whereDate('reservation_date', $request->reservation_date)
                ->whereTime('reservation_time', $request->reservation_time)
                ->whereIn('reservation_status', ['confirmed', 'pending_payment'])
                ->first();

            if ($existingPatientReservation) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You already have a reservation at this time'
                ], 409);
            }

            $doctor = Doctor::findOrFail($request->doctor_id);
            $date = Carbon::parse($request->reservation_date);
            $dayOfWeek = $date->format('l');

            // Checking doctor availability
            $availability = $doctor->availabilities()
                ->where('day_of_week', $dayOfWeek)
                ->first();

            if (!$availability) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Doctor is not available on {$dayOfWeek}s"
                ], 400);
            }

            // time slot validation
            $requestTime = Carbon::parse($request->reservation_time);
            $startTime = Carbon::parse($availability->start_time);
            $endTime = Carbon::parse($availability->end_time);

            if ($requestTime->lt($startTime) || $requestTime->gte($endTime)) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Doctor's working hours are between {$startTime->format('H:i')} and {$endTime->format('H:i')}"
                ], 400);
            }

            // Check for existing reservations
            $existingReservation = Reservation::where('doctor_id', $request->doctor_id)
                ->whereDate('reservation_date', $request->reservation_date)
                ->whereTime('reservation_time', $request->reservation_time)
                ->whereIn('reservation_status', ['confirmed', 'pending_payment'])
                ->first();

            if ($existingReservation) {

                $nextSlot = $this->findNextAvailableSlot($doctor, $date, $requestTime);
                
                return response()->json([
                    'status' => 'error',
                    'message' => 'This time slot is already taken',
                    'next_available' => $nextSlot ? [
                        'date' => $nextSlot->format('Y-m-d'),
                        'time' => $nextSlot->format('H:i:s')
                    ] : null
                ], 409);
            }

            // Create reservation
            $reservation = new Reservation();
            $reservation->patient_id = $patient->id;
            $reservation->doctor_id = $request->doctor_id;
            $reservation->price = $request->price;
            $reservation->payment_status = 'paid';
            $reservation->reservation_status = 'confirmed';
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
                'message' => 'An error occurred while creating the reservation'
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
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $patientId = $user->patient->id;

        $reservations = Reservation::where('patient_id', $patientId)->get();
        if ($reservations->isEmpty()) {
            return response()->json(['message' => 'No reservations found'], 404);
        }

        $data = $reservations->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                'doctor_name' => $reservation->doctor->user->name,
                'specialization' => $reservation->doctor->speciality,
                'date_time' => $reservation->reservation_date . 'T' . $reservation->reservation_time,
                'status' => $reservation->reservation_status,
                'location' => $reservation->doctor->location,
            ];
        })->values()->toArray();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
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
    
}