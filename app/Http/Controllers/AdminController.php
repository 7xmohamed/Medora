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

    public function deleteDoctor($id)
    {
        try {
            \DB::beginTransaction();

            $doctor = Doctor::with('user')->findOrFail($id);
            $user = $doctor->user;

            // Delete doctor files if they exist
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            if ($user->id_card_front) {
                Storage::disk('public')->delete('doctors/documents/' . $user->id_card_front);
            }
            if ($user->id_card_back) {
                Storage::disk('public')->delete('doctors/documents/' . $user->id_card_back);
            }

            // Delete the doctor and associated user
            $doctor->delete();
            $user->delete();

            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Doctor deleted successfully'
            ]);
        } catch (\Exception $e) {
            \DB::rollback();
            Log::error('Error deleting doctor: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete doctor',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function getReservationStats()
    {
        try {
            $endDate = now();
            $startDate = now()->subDays(30);

            // Get daily stats
            $dailyStats = Reservation::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date')
                ->selectRaw('COUNT(*) as total')
                ->selectRaw('SUM(CASE WHEN reservation_status = "confirmed" THEN 1 ELSE 0 END) as confirmed')
                ->selectRaw('SUM(CASE WHEN reservation_status = "pending" THEN 1 ELSE 0 END) as pending')
                ->selectRaw('SUM(CASE WHEN reservation_status = "canceled" THEN 1 ELSE 0 END) as cancelled')
                ->groupBy('date')
                ->orderBy('date', 'ASC')
                ->get();

            // Fill in missing dates with zero values
            $allDates = collect();
            for ($date = clone $startDate; $date <= $endDate; $date->addDay()) {
                $dateStr = $date->format('Y-m-d');
                $stat = $dailyStats->firstWhere('date', $dateStr);
                
                $allDates->push([
                    'date' => $dateStr,
                    'confirmed' => (int)($stat->confirmed ?? 0),
                    'pending' => (int)($stat->pending ?? 0),
                    'cancelled' => (int)($stat->cancelled ?? 0),
                    'total' => (int)($stat->total ?? 0)
                ]);
            }

            // Calculate totals and rates
            $totals = [
                'confirmed' => $allDates->sum('confirmed'),
                'pending' => $allDates->sum('pending'),
                'cancelled' => $allDates->sum('cancelled'),
                'total' => $allDates->sum('total')
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'daily' => $allDates,
                    'summary' => [
                        'total' => $totals['total'],
                        'confirmed' => $totals['confirmed'],
                        'pending' => $totals['pending'],
                        'cancelled' => $totals['cancelled'],
                        'confirmation_rate' => $totals['total'] > 0 ? 
                            round(($totals['confirmed'] / $totals['total']) * 100, 2) : 0,
                        'cancellation_rate' => $totals['total'] > 0 ? 
                            round(($totals['cancelled'] / $totals['total']) * 100, 2) : 0
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Reservation stats error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch reservation statistics',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
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
            $startDate = now()->subMonths(11);

            // Get monthly stats
            $monthlyStats = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month')
                ->selectRaw('COUNT(*) as total')
                ->selectRaw('COUNT(CASE WHEN role = "doctor" THEN 1 END) as doctors')
                ->selectRaw('COUNT(CASE WHEN role = "patient" THEN 1 END) as patients')
                ->whereBetween('created_at', [$startDate->startOfMonth(), $endDate])
                ->groupBy('month')
                ->orderBy('month', 'ASC')
                ->get();

            // Fill in missing months with zero values
            $allMonths = collect();
            $runningTotal = 0;
            $totalDoctors = 0;
            $totalPatients = 0;
            
            for ($date = clone $startDate; $date <= $endDate; $date->addMonth()) {
                $monthKey = $date->format('Y-m');
                $stat = $monthlyStats->firstWhere('month', $monthKey);
                
                $monthDoctors = (int)($stat->doctors ?? 0);
                $monthPatients = (int)($stat->patients ?? 0);
                $monthTotal = $monthDoctors + $monthPatients;
                
                $runningTotal += $monthTotal;
                $totalDoctors += $monthDoctors;
                $totalPatients += $monthPatients;
                
                $previousMonth = $allMonths->last();
                $growthRate = $previousMonth ? 
                    ($monthTotal - $previousMonth['total']) / max($previousMonth['total'], 1) * 100 : 0;

                $allMonths->push([
                    'month' => $monthKey,
                    'total' => $monthTotal,
                    'doctors' => $monthDoctors,
                    'patients' => $monthPatients,
                    'growth_rate' => round($growthRate, 2),
                    'running_total' => $runningTotal
                ]);
            }

            // Calculate trends
            $lastThreeMonths = $allMonths->take(-3);
            $avgGrowthRate = $lastThreeMonths->avg('growth_rate');

            return response()->json([
                'success' => true,
                'data' => [
                    'users' => $allMonths,
                    'summary' => [
                        'totalUsers' => $runningTotal,
                        'totalDoctors' => $totalDoctors,
                        'totalPatients' => $totalPatients,
                        'averageGrowth' => round($avgGrowthRate, 2),
                        'lastMonthGrowth' => $allMonths->last()['growth_rate'],
                        'growthTrend' => $avgGrowthRate,
                        'doctorPatientRatio' => $totalPatients > 0 ? 
                            round(($totalDoctors / $totalPatients) * 100, 2) : 0
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Monthly users stats error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch user statistics',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
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