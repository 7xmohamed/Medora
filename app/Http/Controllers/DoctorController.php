<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
                ->where('is_verified', 1) // Only get verified doctors
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
                        'latitude' => $doctor->latitude,
                        'longitude' => $doctor->longitude,
                        'description' => $doctor->description,
                        'price' => $doctor->price,
                        'education' => $doctor->education ?? '',
                        'experience' => $doctor->experience ?? '',
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
                ->where('is_verified', 1) // Only get verified doctors
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
            $doctor = Doctor::with(['user', 'reservations'])
                ->where('user_id', auth()->id())
                ->firstOrFail();

            $stats = [
                'total_reservations' => $doctor->reservations->count(),
                'pending_reservations' => $doctor->reservations->where('reservation_status', 'pending')->count(),
                'completed_reservations' => $doctor->reservations->where('reservation_status', 'completed')->count(),
            ];

            return response()->json([
                'stats' => $stats,
                'recent_reservations' => $doctor->reservations()
                    ->with(['patient.user'])
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function($reservation) {
                        return [
                            'id' => $reservation->id,
                            'patient_name' => $reservation->patient->user->name,
                            'status' => $reservation->reservation_status,
                            'date' => $reservation->created_at->format('M d, Y'),
                            'price' => $reservation->price,
                        ];
                    })
            ]);
        } catch (\Exception $e) {
            Log::error('Doctor dashboard error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to load dashboard data'], 500);
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

}