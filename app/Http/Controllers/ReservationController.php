<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
// use App\Models\User; // Removed unused import
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Reservation;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth; // Removed unused import
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    // Get doctor availability
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
            $interval = $doctor->reservation_duration ?? 30;

            $slots = [];
            $current = $start->copy();
            while ($current->lte($end)) {
                $time = $current->format('H:i:s');
                if (!in_array($time, $bookedSlots)) {
                    $slots[] = $time;
                }
                $current->addMinutes($interval);
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
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
    
        $patient = Patient::where('user_id', $user->id)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient not found'], 404);
        }
    
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'reservation_date' => 'required|date|after_or_equal:today',
            'reservation_time' => 'required|date_format:H:i:s',
            'reason' => 'required|string|max:500',
            'price' => 'required|numeric|gt:0'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors()
            ], 400);
        }
    
        try {
            $doctor = Doctor::findOrFail($request->doctor_id);
            $date = Carbon::parse($request->reservation_date);
            $dayOfWeek = strtolower($date->englishDayOfWeek);
    
            $availability = $doctor->availabilities()
                ->where('day_of_week', $dayOfWeek)
                ->first();
    
            if (!$availability) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Doctor not available on selected day'
                ], 400);
            }
    
            $start = Carbon::parse($availability->start_time);
            $end = Carbon::parse($availability->end_time);
            $requestTime = Carbon::parse($request->reservation_time);
    
            if ($requestTime->lt($start) || $requestTime->gte($end)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Selected time is outside working hours'
                ], 400);
            }
    
            $existing = Reservation::where('doctor_id', $request->doctor_id)
                ->whereDate('reservation_date', $request->reservation_date)
                ->whereTime('reservation_time', $request->reservation_time)
                ->whereIn('reservation_status', ['confirmed', 'pending_payment'])
                ->exists();
    
            if ($existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This time slot is already taken'
                ], 400);
            }
    
            $reservation = new Reservation();
            $reservation->patient_id = $patient->id;
            $reservation->doctor_id = $request->doctor_id;
            $reservation->price = $request->price;
            $reservation->payment_status = 'paid';
            $reservation->reservation_status = 'confirmed';
            $reservation->reason = $request->reason;
            $reservation->reservation_date = $request->reservation_date;
            $reservation->reservation_time = $request->reservation_time;
            $reservation->save();
    
            return response()->json([
                'status' => 'success',
                'message' => 'Reservation created successfully',
                'data' => $reservation
            ], 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create reservation: ' . $e->getMessage()
            ], 500);
        }
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

        $patient = Patient::where('user_id', $user->id)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient not found'], 404);
        }

        $patientId = $patient->id;

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