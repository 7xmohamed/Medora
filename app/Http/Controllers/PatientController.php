<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

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
            'profile_picture' => $user->profile_picture ? asset('storage/' . $user->profile_picture) : null,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$request->user()->id,
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $data = $request->only(['name', 'email', 'address', 'phone']);

        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if exists
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            
            // Store new profile picture
            $path = $request->file('profile_picture')->store('profile-pictures', 'public');
            $data['profile_picture'] = $path;
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'address' => $user->address,
                'phone' => $user->phone,
                'profile_picture' => $user->profile_picture ? asset('storage/' . $user->profile_picture) : null,
            ]
        ]);
    }

    public function analytics(Request $request)
    {
        $user = $request->user();
        $reservations = Reservation::where('patient_id', $user->patient->id)->get();
        if ($reservations->isEmpty()) {
            return response()->json([
                'message' => 'No reservations found for this user.'
            ], 404);
        }
        $lastVisit = $reservations->sortByDesc('reservation_date')->first();
        $lastVisitDate = $lastVisit ? $lastVisit->reservation_date : null;

        $data = [
            'totalAppointments' => $reservations->count(),
            'upcomingAppointments' => $reservations->where('reservation_date', '>', now())->count(),
            'canceledAppointments' => $reservations->where('reservation_status','canceled')->count(),
            'lastCheckup' => $lastVisitDate,
            'healthScore' => $user->patient->health_score,
            'favoriteSpecialization'=>'Cardiology',
        ];

        return response()->json($data);
    }
}