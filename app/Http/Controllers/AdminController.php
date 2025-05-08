<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use App\Models\ContactMessage;
use App\Models\Reservation;
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
                $user = $doctor->user;
                return [
                    'id' => $doctor->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'speciality' => $doctor->speciality ?? 'Not specified',
                    'niom' => $doctor->niom,
                    'is_verified' => (bool)$doctor->is_verified,
                    'experience' => $doctor->experience ?? 'Not specified',
                    'education' => $doctor->education ?? 'Not specified',
                    'created_at' => $doctor->created_at,
                    'profile_picture' => $user->profile_picture ? 
                        Storage::disk('public')->url($user->profile_picture) : null,
                    'id_card_front' => $user->id_card_front ? 
                        Storage::disk('public')->url('doctors/documents/' . $user->id_card_front) : null,
                    'id_card_back' => $user->id_card_back ? 
                        Storage::disk('public')->url('doctors/documents/' . $user->id_card_back) : null
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
            $endDate = now();
            $startDate = now()->subDays(30);

            $stats = Reservation::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date')
                ->selectRaw('COUNT(*) as total')
                ->selectRaw('SUM(CASE WHEN reservation_status = "confirmed" THEN 1 ELSE 0 END) as confirmed')
                ->selectRaw('SUM(CASE WHEN reservation_status = "pending" THEN 1 ELSE 0 END) as pending')
                ->selectRaw('SUM(CASE WHEN reservation_status = "canceled" THEN 1 ELSE 0 END) as cancelled')
                ->groupBy('date')
                ->orderBy('date', 'ASC')
                ->get()
                ->map(function($stat) {
                    return [
                        'date' => $stat->date,
                        'confirmed' => (int)$stat->confirmed,
                        'pending' => (int)$stat->pending,
                        'cancelled' => (int)$stat->cancelled,
                        'total' => (int)$stat->total,
                        'confirmationRate' => $stat->total > 0 ? 
                            round(($stat->confirmed / $stat->total) * 100, 2) : 0,
                        'pendingRate' => $stat->total > 0 ? 
                            round(($stat->pending / $stat->total) * 100, 2) : 0,
                        'cancellationRate' => $stat->total > 0 ? 
                            round(($stat->cancelled / $stat->total) * 100, 2) : 0
                    ];
                });

            // Calculate overall statistics
            $totals = [
                'confirmed' => $stats->sum('confirmed'),
                'pending' => $stats->sum('pending'),
                'cancelled' => $stats->sum('cancelled'),
                'total' => $stats->sum('total')
            ];

            $peakDay = $stats->sortByDesc('total')->first();
            $bestPerformanceDay = $stats->sortByDesc('confirmationRate')->first();

            return response()->json([
                'stats' => $stats,
                'summary' => [
                    'totalReservations' => $totals['total'],
                    'totalConfirmed' => $totals['confirmed'],
                    'totalPending' => $totals['pending'],
                    'totalCancelled' => $totals['cancelled'],
                    'avgConfirmationRate' => $totals['total'] > 0 ? 
                        round(($totals['confirmed'] / $totals['total']) * 100, 2) : 0,
                    'avgCancellationRate' => $totals['total'] > 0 ? 
                        round(($totals['cancelled'] / $totals['total']) * 100, 2) : 0,
                    'peakDay' => [
                        'date' => $peakDay ? $peakDay['date'] : null,
                        'total' => $peakDay ? $peakDay['total'] : 0
                    ],
                    'bestPerformance' => [
                        'date' => $bestPerformanceDay ? $bestPerformanceDay['date'] : null,
                        'rate' => $bestPerformanceDay ? $bestPerformanceDay['confirmationRate'] : 0
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Reservation stats error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch reservation statistics'], 500);
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
            $endDate = now();
            $startDate = now()->subMonths(12);
            
            $users = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month')
                ->selectRaw('COUNT(*) as count')
                ->selectRaw('COUNT(CASE WHEN role = "doctor" THEN 1 END) as doctors')
                ->selectRaw('COUNT(CASE WHEN role = "patient" THEN 1 END) as patients')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('month')
                ->orderBy('month', 'ASC')
                ->get();

            // Calculate derived metrics
            $processedData = [];
            $totalUsers = 0;
            
            foreach ($users as $index => $data) {
                $previousCount = $index > 0 ? $processedData[$index - 1]['count'] : $data->count;
                $growthRate = $previousCount > 0 ? 
                    (($data->count - $previousCount) / $previousCount) * 100 : 0;
                
                $totalUsers += $data->count;
                $doctorRatio = $data->count > 0 ? ($data->doctors / $data->count) * 100 : 0;
                
                $processedData[] = [
                    'month' => $data->month,
                    'count' => $data->count,
                    'doctors' => $data->doctors,
                    'patients' => $data->patients,
                    'growthRate' => round($growthRate, 2),
                    'doctorRatio' => round($doctorRatio, 2),
                    'runningTotal' => $totalUsers
                ];
            }

            // Calculate trends
            $recentGrowth = array_slice($processedData, -3);
            $growthTrend = collect($recentGrowth)->avg('growthRate');

            return response()->json([
                'users' => $processedData,
                'summary' => [
                    'totalUsers' => $totalUsers,
                    'averageGrowth' => round(collect($processedData)->avg('growthRate'), 2),
                    'latestMonthGrowth' => end($processedData)['growthRate'],
                    'growthTrend' => round($growthTrend, 2),
                    'doctorPatientRatio' => round(($users->sum('doctors') / $users->sum('patients')) * 100, 2),
                    'lastThreeMonths' => [
                        'growth' => $recentGrowth,
                        'trend' => $growthTrend >= 0 ? 'increasing' : 'decreasing'
                    ]
                ]
            ]);
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