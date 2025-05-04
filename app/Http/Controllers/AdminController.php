<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboardStats()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'total_doctors' => User::where('role', User::ROLE_DOCTOR)->count(),
                'total_patients' => User::where('role', User::ROLE_PATIENT)->count(),
                'pending_doctors' => Doctor::where('is_verified', 0)->count()
            ];
            
            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getContactMessages() 
    {
        try {
            $messages = ContactMessage::with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($message) {
                    return [
                        'id' => $message->id,
                        'name' => $message->name,
                        'email' => $message->email,
                        'subject' => $message->subject,
                        'message' => $message->message,
                        'user_id' => $message->user_id,
                        'created_at' => $message->created_at->toISOString(),
                    ];
                });
            
            return response()->json([
                'messages' => $messages
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteContactMessage($id) 
    {
        try {
            $message = ContactMessage::findOrFail($id);
            $message->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Message deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getAllDoctors()
    {
        try {
            $doctors = User::with(['doctor'])
                ->where('role', User::ROLE_DOCTOR)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'profile_picture' => $user->profile_picture 
                            ? (filter_var($user->profile_picture, FILTER_VALIDATE_URL) 
                                ? $user->profile_picture 
                                : asset('storage/' . $user->profile_picture))
                            : asset('images/no-photo.png'),
                        'is_verified' => $user->doctor->is_verified ?? 0,
                        'speciality' => $user->doctor->speciality ?? 'Not specified',
                        'created_at' => $user->created_at->toISOString(),
                    ];
                });
            
            return response()->json([
                'doctors' => $doctors
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function verifyDoctor($id, Request $request)
    {
        try {
            $request->validate([
                'action' => 'required|in:verify,reject'
            ]);

            $doctor = Doctor::where('user_id', $id)->firstOrFail();
            $doctor->is_verified = $request->action === 'verify' ? 1 : 0;
            $doctor->save();
            
            return response()->json([
                'success' => true,
                'message' => $request->action === 'verify' 
                    ? 'Doctor verified successfully' 
                    : 'Doctor rejected successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}