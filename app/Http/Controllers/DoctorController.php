<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\Storage;

class DoctorController extends Controller
{
    public function getDoctorsByLocation(Request $request, $country, $city)
    {
        try {
            $searchCity = mb_strtolower(trim($city));
            
            $doctors = Doctor::with(['user', 'availabilities'])
                ->where(function($query) use ($searchCity) {
                    $query->whereRaw('LOWER(city) LIKE ?', ['%' . $searchCity . '%'])
                          ->orWhereRaw('LOWER(location) LIKE ?', ['%' . $searchCity . '%']);
                })
                ->where('is_verified', 1)
                ->get();

            return response()->json([
                'doctors' => $doctors->map(function($doctor) {
                    return [
                        'id' => $doctor->id,
                        'user' => [
                            'name' => $doctor->user->name,
                            'niom' => $doctor->user->niom ?? null,
                            'is_verified' => $doctor->is_verified, 

                            'profile_picture' => $doctor->user->profile_picture 
                                ? (filter_var($doctor->user->profile_picture, FILTER_VALIDATE_URL) 
                                    ? $doctor->user->profile_picture 
                                    : asset('storage/' . $doctor->user->profile_picture))
                                : asset('images/no-photo.png'),
                        ],
                        'speciality' => $doctor->speciality,
                        'location' => $doctor->location,
                        'latitude' => $doctor->latitude,
                        'longitude' => $doctor->longitude,
                        'description' => $doctor->description,
                        'price' => $doctor->price,
                        'education' => $doctor->education ?? '',
                        'experience' => $doctor->experience ?? '',
                        'languages' => $doctor->languages ?? [],
                        'availabilities' => $doctor->availabilities->map(function ($availability) {
                            return [
                                'day_of_week' => $availability->day_of_week,
                                'start_time' => $availability->start_time,
                                'end_time' => $availability->end_time
                            ];
                        })
                    ];
                }),
                'total' => $doctors->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Doctor search error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch doctors'], 500);
        }
    }

    public function getNearbyDoctors(Request $request)
    {
        try {
            $request->validate([
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
                'radius' => 'sometimes|numeric|min:1|max:100'
            ]);

            $latitude = $request->latitude;
            $longitude = $request->longitude;
            $radius = $request->radius ?? 50;

            $doctors = Doctor::with(['user', 'availabilities'])
                ->where('is_verified', 1)
                ->nearby($latitude, $longitude, $radius)
                ->get();

            return response()->json([
                'doctors' => $doctors->map(function($doctor) {
                    return [
                        'id' => $doctor->id,
                        'user' => [
                            'name' => $doctor->user->name,
                            'niom' => $doctor->user->niom ?? null,
                            'is_verified' => $doctor->is_verified, // Include verification status
                            'profile_picture' => $doctor->user->profile_picture 
                                ? (filter_var($doctor->user->profile_picture, FILTER_VALIDATE_URL) 
                                    ? $doctor->user->profile_picture 
                                    : asset('storage/' . $doctor->user->profile_picture))
                                : asset('images/no-photo.png'),
                        ],
                        'speciality' => $doctor->speciality,
                        'location' => $doctor->location,
                        'distance' => round($doctor->distance, 2),
                        'description' => $doctor->description,
                        'price' => $doctor->price,
                        'education' => $doctor->education ?? '',
                        'experience' => $doctor->experience ?? '',
                        'languages' => $doctor->languages ?? [],
                        'availabilities' => $doctor->availabilities->map(function ($availability) {
                            return [
                                'day_of_week' => $availability->day_of_week,
                                'start_time' => $availability->start_time,
                                'end_time' => $availability->end_time
                            ];
                        })
                    ];
                }),
                'total' => $doctors->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Nearby doctors error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch nearby doctors'], 500);
        }
    }

    public function dashboard(Request $request)
    {
        try {
            $doctor = Doctor::with(['user', 'reservations.patient.user'])
                ->where('user_id', auth()->id())
                ->firstOrFail();

            // Calculate statistics
            $stats = [
                'today_appointments' => $doctor->reservations()
                    ->whereDate('reservation_date', today())
                    ->count(),
                'total_patients' => $doctor->reservations()
                    ->distinct('patient_id')
                    ->count('patient_id'),
                'total_prescriptions' => $doctor->reservations()
                    ->whereHas('prescription')
                    ->count(),
                'satisfaction_rate' => '95%',
                'total_revenue' => $doctor->reservations()
                    ->where('payment_status', 'paid')
                    ->sum('price'),
                'pending_appointments' => $doctor->reservations()
                    ->where('reservation_status', 'pending')
                    ->count(),
                // New statistics
                'weekly_appointments' => $doctor->reservations()
                    ->whereBetween('reservation_date', [now()->startOfWeek(), now()->endOfWeek()])
                    ->count(),
                'monthly_revenue' => $doctor->reservations()
                    ->where('payment_status', 'paid')
                    ->where('reservation_status', 'confirmed')
                    ->whereMonth('reservation_date', now()->month)
                    ->sum('price'),
                'completion_rate' => $doctor->reservations()
                    ->where('reservation_status', 'completed')
                    ->count() / max($doctor->reservations()->count(), 1) * 100,
                'average_rating' => 4.5, // Implement actual rating calculation
                'total_reviews' => 150, // Implement actual reviews count
            ];

            // Get upcoming appointments for the next 7 days
            $startDate = now()->startOfDay();
            $endDate = now()->addDays(6)->endOfDay();
            $upcomingAppointments = $doctor->reservations()
                ->with('patient.user')
                ->whereBetween('reservation_date', [$startDate, $endDate])
                ->orderBy('reservation_date', 'asc')
                ->get()
                ->map(function($reservation) {
                    return [
                        'id' => $reservation->id,
                        'patient_name' => $reservation->patient->user->name,
                        'date' => $reservation->reservation_date->format('Y-m-d'),
                        'time' => $reservation->reservation_time->format('h:i A'),
                        'status' => $reservation->reservation_status,
                        'type' => $reservation->appointment_type ?? 'Consultation',
                        'patient_id' => $reservation->patient_id,
                        'price' => $reservation->price,
                        'is_new_patient' => !$reservation->patient->reservations()
                            ->where('reservation_date', '<', $reservation->reservation_date)
                            ->exists()
                    ];
                });

            // Get today's appointments
            $todayAppointments = $upcomingAppointments
                ->where('date', now()->format('Y-m-d'))
                ->values();

            // Get past appointments
            $pastAppointments = $doctor->reservations()
                ->with('patient.user')
                ->where('reservation_date', '<', now())
                ->orderBy('reservation_date', 'desc')
                ->limit(10)
                ->get()
                ->map(function($reservation) {
                    return [
                        'id' => $reservation->id,
                        'patient_name' => $reservation->patient->user->name,
                        'date' => $reservation->reservation_date->format('Y-m-d'),
                        'time' => $reservation->reservation_date->format('h:i A'),
                        'status' => $reservation->reservation_status,
                        'type' => $reservation->appointment_type ?? 'Consultation',
                        'patient_id' => $reservation->patient_id,
                        'price' => $reservation->price,
                    ];
                });

            // Get recent patients
            $recentPatients = $doctor->reservations()
                ->with('patient.user')
                ->orderBy('reservation_date', 'desc')
                ->limit(5)
                ->get()
                ->map(function($reservation) {
                    return [
                        'id' => $reservation->patient_id,
                        'name' => $reservation->patient->user->name,
                        'last_visit' => $reservation->reservation_date->format('Y-m-d'),
                        'total_visits' => $reservation->patient->reservations()->count(),
                        'status' => $reservation->reservation_status
                    ];
                })
                ->unique('id')
                ->values();

            return response()->json([
                'success' => true,
                'stats' => $stats,
                'today_appointments' => $todayAppointments,
                'upcoming_appointments' => $upcomingAppointments,
                'past_appointments' => $pastAppointments,
                'recent_patients' => $recentPatients,
                'doctor' => [
                    'name' => $doctor->user->name,
                    'profile_picture' => $doctor->user->profile_picture ? 
                        asset('storage/' . $doctor->user->profile_picture) : 
                        null,
                    'speciality' => $doctor->speciality,
                    'experience' => $doctor->experience,
                    'total_patients_served' => $doctor->reservations()->distinct('patient_id')->count()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Doctor dashboard error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to load dashboard data'], 500);
        }
    }

    public function getDashboardData()
    {
        try {
            $doctor = auth()->user()->doctor;
            $today = now();

            // Update monthly revenue at the start of each month
            if ($today->day === 1 && $today->hour === 0) {
                $doctor->update(['monthly_revenue' => 0]);
            }

            // Calculate revenues
            $monthlyRevenue = $doctor->reservations()
                ->where('payment_status', 'paid')
                ->whereMonth('reservation_date', $today->month)
                ->whereYear('reservation_date', $today->year)
                ->where('reservation_status', '!=', 'canceled')
                ->sum('price');

            $doctor->update([
                'monthly_revenue' => $monthlyRevenue
            ]);

            $stats = [
                // ...existing code...
                'monthly_revenue' => $monthlyRevenue,
                // ...existing code...
            ];

            // ...existing code...
        } catch (\Exception $e) {
            // ...existing code...
        }
    }

    public function getProfile(Request $request)
    {
        try {
            $doctor = Doctor::with(['user', 'availabilities'])
                ->where('user_id', auth()->id())
                ->firstOrFail();

            return response()->json([
                'doctor' => [
                    'id' => $doctor->id,
                    'user' => [
                        'name' => $doctor->user->name,
                        'email' => $doctor->user->email,
                        'phone' => $doctor->user->phone,
                        'profile_picture' => $doctor->user->profile_picture 
                            ? (filter_var($doctor->user->profile_picture, FILTER_VALIDATE_URL) 
                                ? $doctor->user->profile_picture 
                                : asset('storage/' . $doctor->user->profile_picture))
                            : null,
                    ],
                    'speciality' => $doctor->speciality,
                    'location' => $doctor->location,
                    'city' => $doctor->city,
                    'description' => $doctor->description,
                    'price' => $doctor->price,
                    'is_verified'=>$doctor->is_verified,
                    'experience' => $doctor->experience ?? '',
                    'education' => $doctor->education ?? '',
                    'languages' => $doctor->languages ?? [],
                    'niom' => $doctor->niom ?? 'Not specified',
                    'availabilities' => $doctor->availabilities->map(function ($availability) {
                        return [
                            'id' => $availability->id,
                            'day' => $availability->day_of_week,
                            'hours' => $this->formatAvailabilityHours($availability->start_time, $availability->end_time)
                        ];
                    })
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching doctor profile:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch doctor profile'], 500);
        }
    }

    public function updateProfilePicture(Request $request) {

        try {
            $request->validate([
                'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $doctor = Doctor::with('user')
                ->where('user_id', auth()->id())
                ->firstOrFail();

            // Delete old picture if exists
            if ($doctor->user->profile_picture) {
                $oldImage = str_replace('/storage/', '', $doctor->user->profile_picture);
                \Storage::disk('public')->delete($oldImage);
            }

            // Store new picture
            $path = $request->file('profile_picture')->store('profile-pictures', 'public');
            $doctor->user->profile_picture = $path;
            $doctor->user->save();

            return response()->json([
                'profile_picture' => asset('storage/' . $path)
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating profile picture:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to update profile picture'], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'phone' => 'required|string'
            ]);

            $doctor = Doctor::where('user_id', auth()->id())->firstOrFail();
            
            // Update doctor info
            $doctor->description = $request->description;
            $doctor->price = $request->price;
            $doctor->save();

            // Update user phone
            $doctor->user->phone = $request->phone;
            $doctor->user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating doctor profile:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'error' => 'Failed to update profile'
            ], 500);
        }
    }

    public function getAvailabilities()
    {
        try {
            $doctor = Doctor::with('availabilities')
                ->where('user_id', auth()->id())
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'availabilities' => $doctor->availabilities
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching availabilities:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch availabilities'], 500);
        }
    }

    public function storeAvailability(Request $request)
    {
        try {
            $request->validate([
                'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
            ]);

            $doctor = Doctor::where('user_id', auth()->id())->firstOrFail();
            
            $availability = $doctor->availabilities()->create($request->all());

            return response()->json([
                'success' => true,
                'availability' => $availability
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating availability:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to create availability'], 500);
        }
    }

    public function deleteAvailability(Request $request, $id)
    {
        try {
            $doctor = Doctor::where('user_id', auth()->id())->firstOrFail();
            $availability = $doctor->availabilities()->findOrFail($id);
            
            if ($request->query('delete_all') === 'true') {
                // Delete all availabilities for the same day and time
                $doctor->availabilities()
                      ->where('day_of_week', $availability->day_of_week)
                      ->where('start_time', $availability->start_time)
                      ->where('end_time', $availability->end_time)
                      ->delete();
            } else {
                // Delete only this specific availability
                $availability->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'Availability deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting availability:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to delete availability'], 500);
        }
    }

    protected function formatAvailabilityHours($startTime, $endTime)
    {
        try {
            $start = \Carbon\Carbon::createFromFormat('H:i:s', $startTime)->format('g:i A');
            $end = \Carbon\Carbon::createFromFormat('H:i:s', $endTime)->format('g:i A');
            return $start . ' - ' . $end;
        } catch (\Exception $e) {
            return $startTime . ' - ' . $endTime;
        }
    }

    public function getDoctorById($doctorId)
    {
        $doctor = Doctor::with(['user', 'availabilities'])->findOrFail($doctorId);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }
        return response()->json([
            'id' => $doctor->id,
            'name' => $doctor->user->name,
            'email' => $doctor->user->email,
            'address' => $doctor->user->address,
            'phone' => $doctor->user->phone,
            'profile_picture' => $doctor->user->profile_picture ? asset('storage/' . $doctor->user->profile_picture) : null,
            'speciality' => $doctor->speciality,
            'niom' => $doctor->niom,
            'location' => $doctor->location,
            'description' => $doctor->description,
            'image' => $doctor->image ? asset('storage/' . $doctor->image) : null,
            'price' => $doctor->price,
            'languages' => $doctor->languages,
            'experience' => $doctor->experience,
            'education' => $doctor->education,
            'availabilities' => $doctor->availabilities ? $doctor->availabilities->map(function($a) {
                return [
                    'day_of_week' => $a->day_of_week,
                    'start_time' => $a->start_time,
                    'end_time' => $a->end_time,
                ];
            })->values()->toArray() : [],
        ]);
    }

    public function getPublicProfile($doctorId)
    {
        try {
            $doctor = Doctor::with(['user', 'availabilities'])
                ->where('id', $doctorId)
                ->where('is_verified', 1)
                ->firstOrFail();
            
            return response()->json([
                'id' => $doctor->id,
                'name' => $doctor->user->name,
                'email' => $doctor->user->email, 
                'phone' => $doctor->user->phone,
                'profile_picture' => $doctor->user->profile_picture ? asset('storage/' . $doctor->user->profile_picture) : null,
                'speciality' => $doctor->speciality,
                'location' => $doctor->location,
                'latitude' => $doctor->latitude,
                'longitude' => $doctor->longitude,
                'description' => $doctor->description,
                'experience' => $doctor->experience,
                'education' => $doctor->education,
                'languages' => $doctor->languages,
                'price' => $doctor->price,
                'availabilities' => $doctor->availabilities->map(function($a) {
                    return [
                        'day_of_week' => $a->day_of_week,
                        'start_time' => $a->start_time,
                        'end_time' => $a->end_time
                    ];
                })->values()->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }
    }

    public function getAllAppointments(Request $request)
    {
        try {
            $doctor = Doctor::with(['reservations.patient.user'])
                ->where('user_id', auth()->id())
                ->firstOrFail();

            $appointments = $doctor->reservations()
                ->orderBy('reservation_date', 'desc')
                ->get()
                ->map(function($reservation) {
                    return [
                        'id' => $reservation->id,
                        'patient_name' => $reservation->patient->user->name,
                        'patient_email' => $reservation->patient->user->email,
                        'patient_phone' => $reservation->patient->user->phone,
                        'date' => $reservation->reservation_date->format('Y-m-d'),
                        'time' => $reservation->reservation_date->format('h:i A'),
                        'status' => $reservation->reservation_status,
                        'type' => $reservation->appointment_type ?? 'Consultation',
                        'price' => $reservation->price,
                        'reason' => $reservation->reason,
                        'medical_history' => $reservation->patient->medical_history
                    ];
                });

            return response()->json([
                'success' => true,
                'appointments' => $appointments
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching appointments:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch appointments'], 500);
        }
    }
}