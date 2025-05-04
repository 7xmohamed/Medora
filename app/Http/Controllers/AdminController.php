<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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

    public function getUsers()
    {
        try {
            $users = User::with(['doctor', 'patient'])
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'created_at' => $user->created_at,
                    ];
                });
            
            return response()->json(['users' => $users]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getDoctors()
    {
        try {
            $doctors = Doctor::with(['user' => function($query) {
                $query->select('id', 'name', 'email', 'profile_picture', 'id_card_front', 'id_card_back');
            }])->get();

            $formattedDoctors = $doctors->map(function ($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->user->name,
                    'email' => $doctor->user->email,
                    'speciality' => $doctor->speciality ?? 'Not specified',
                    'niom' => $doctor->niom,
                    'is_verified' => (bool)$doctor->is_verified,
                    'experience' => $doctor->experience ?? 'Not specified',
                    'education' => $doctor->education ?? 'Not specified',
                    'created_at' => $doctor->created_at,
                    'profile_picture' => $doctor->user->profile_picture ? 
                        Storage::disk('public')->url($doctor->user->profile_picture) : null,
                    'id_card_front' => $doctor->user->id_card_front ? 
                        Storage::disk('public')->url($doctor->user->id_card_front) : null,
                    'id_card_back' => $doctor->user->id_card_back ? 
                        Storage::disk('public')->url($doctor->user->id_card_back) : null,
                    'verification_documents' => [
                        'front' => $doctor->user->id_card_front ? 
                            Storage::disk('public')->url($doctor->user->id_card_front) : null,
                        'back' => $doctor->user->id_card_back ? 
                            Storage::disk('public')->url($doctor->user->id_card_back) : null,
                    ]
                ];
            });
            
            return response()->json([
                'success' => true,
                'doctors' => $formattedDoctors
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching doctors: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch doctors'], 500);
        }
    }

    public function updateDoctorStatus($id)
    {
        try {
            $doctor = Doctor::findOrFail($id);
            $doctor->update([
                'is_verified' => request('verified')
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Doctor verification status updated successfully',
                'doctor' => [
                    'id' => $doctor->id,
                    'is_verified' => (bool)$doctor->is_verified
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating doctor status: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update doctor status'], 500);
        }
    }

    public function getReservationStats()
    {
        try {
            $stats = Reservation::selectRaw('DATE(created_at) as date')
                ->selectRaw('COUNT(CASE WHEN reservation_status = "confirmed" THEN 1 END) as confirmed')
                ->selectRaw('COUNT(CASE WHEN reservation_status = "pending" THEN 1 END) as pending')
                ->selectRaw('COUNT(CASE WHEN reservation_status = "cancelled" THEN 1 END) as cancelled')
                ->groupBy('date')
                ->orderBy('date', 'DESC')
                ->limit(7)
                ->get();

            return response()->json(['stats' => $stats]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getDoctorSpecialties()
    {
        try {
            $specialties = Doctor::select('speciality')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('speciality')
                ->get()
                ->map(function ($item) {
                    return [
                        'specialty' => $item->speciality,
                        'count' => $item->count
                    ];
                });

            return response()->json(['specialties' => $specialties]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getMonthlyUsers()
    {
        try {
            $users = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('month')
                ->orderBy('month', 'ASC')
                ->limit(12)
                ->get();

            return response()->json(['users' => $users]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getUserDetails($id)
    {
        try {
            $user = User::with(['doctor', 'patient'])->findOrFail($id);
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'address' => $user->address,
                'created_at' => $user->created_at,
                'profile_picture' => $user->profile_picture ? 
                    Storage::disk('public')->url($user->profile_picture) : null,
            ];

            if ($user->doctor) {
                $userData['doctor'] = [
                    'speciality' => $user->doctor->speciality,
                    'niom' => $user->doctor->niom,
                    'experience' => $user->doctor->experience,
                    'education' => $user->doctor->education,
                    'verification_documents' => [
                        'front' => $user->id_card_front ? 
                            Storage::disk('public')->url($user->id_card_front) : null,
                        'back' => $user->id_card_back ? 
                            Storage::disk('public')->url($user->id_card_back) : null,
                    ],
                    'is_verified' => $user->doctor->is_verified,
                ];
            }

            if ($user->patient) {
                $userData['patient'] = [
                    'blood_type' => $user->patient->blood_type,
                    'height' => $user->patient->height,
                    'weight' => $user->patient->weight,
                    'date_of_birth' => $user->patient->date_of_birth,
                    'gender' => $user->patient->gender,
                ];
            }

            return response()->json(['user' => $userData]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
            ]);

            $user->update($validated);

            if ($user->doctor && $request->has('doctor')) {
                $user->doctor->update($request->input('doctor'));
            }

            if ($user->patient && $request->has('patient')) {
                $user->patient->update($request->input('patient'));
            }

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'user' => $user->fresh(['doctor', 'patient'])
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}