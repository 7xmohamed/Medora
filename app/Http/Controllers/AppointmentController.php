<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function getAppointments(Request $request , $appointmentId)
    {
        $user = $request->user();
        $reservation = Reservation::find($appointmentId);
        if (!$reservation) {
            return response()->json([
                'status' => 'error',
                'message' => 'Appointment not found'
            ], 404);
        }
        $data = [
            'id' => $reservation->id,
            'doctor_name' => $reservation->doctor->user->name,
            'role'=>$user->role,
            'patient_name' => $reservation->patient->user->name,
            'patient_email' => $reservation->patient->user->email,
            'patient_phone' => $reservation->patient->user->phone,
            'doctor_phone' => $reservation->doctor->user->phone,
            'doctor_email' => $reservation->doctor->user->email,
            'patient_gender' => $reservation->patient->gender,
            'patient_age' => $reservation->patient->date_of_birth,
            'specialization' => $reservation->doctor->speciality,
            'date' => $reservation->reservation_date ,
            'time' => $reservation->reservation_time,
            'price' => $reservation->price,
            'payment_status' => $reservation->payment_status,
            'reason' => $reservation->reason,
            'medical_history'=> $reservation->patient->medical_history,
            'status' => $reservation->reservation_status,
            'location' => $reservation->doctor->location,
        ];
        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function role(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'status' => 'success',
            'role' => $user->role
        ]);
    }
}
