<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    public function getProfile(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'address' => $user->address,
            'phone' => $user->phone,
        ]);
    }

    public function updateProfile(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,'.$request->user()->id,
                'address' => 'required|string|max:255',
                'phone' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $validator->errors()->first()
                ], 422);
            }

            $user = $request->user();
            $data = $request->only(['name', 'email', 'address', 'phone']);
            $user->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'data' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'address' => $user->address,
                    'phone' => $user->phone,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Profile update failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update profile'
            ], 500);
        }
    }

    public function analytics(Request $request)
    {
        try {
            $user = $request->user();
            $reservations = Reservation::where('patient_id', $user->patient->id)
                ->orderBy('reservation_date', 'desc')
                ->orderBy('reservation_time', 'desc')
                ->get();

            $data = [
                'totalAppointments' => $reservations->count(),
                'upcomingAppointments' => $reservations->where('reservation_date', '>', now())->count(),
                'canceledAppointments' => $reservations->where('reservation_status', 'canceled')->count(),
                'lastCheckup' => $reservations->first()?->reservation_date,
                'healthScore' => $user->patient->health_score ?? 100,
                'favoriteSpecialization' => 'General'
            ];

            return response()->json($data);
        } catch (\Exception $e) {
            \Log::error('Analytics error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error fetching analytics'], 500);
        }
    }
}