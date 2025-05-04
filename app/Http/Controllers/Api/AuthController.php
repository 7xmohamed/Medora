<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private function handleDoctorFiles(Request $request): array
    {
        $files = [];
        
        try {
            foreach (['id_card_front', 'id_card_back'] as $field) {
                if ($request->hasFile($field)) {
                    $file = $request->file($field);
                    
                    // Generate unique filename
                    $filename = uniqid('doc_') . '_' . time() . '.' . $file->getClientOriginalExtension();
                    
                    // Store in the doctors/documents directory
                    $path = $file->storeAs(
                        'doctors/documents', 
                        $filename, 
                        'public'
                    );
                    
                    if (!$path) {
                        throw new \Exception("Failed to store $field");
                    }
                    
                    $files[$field] = $path;
                }
            }
            
            return $files;
        } catch (\Exception $e) {
            // Clean up any files that were stored
            foreach ($files as $path) {
                Storage::disk('public')->delete($path);
            }
            throw $e;
        }
    }

    private function validateDoctorFiles(Request $request)
    {
        $maxSize = 2048; // 2MB
        
        return $request->validate([
            'id_card_front' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg',
                "max:$maxSize",
            ],
            'id_card_back' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg',
                "max:$maxSize",
            ],
        ]);
    }

    public function register(Request $request)
    {
        try {
            \Log::info('Registration request data:', $request->all());
            
            // Basic validation
            $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'unique:users'],
                'password' => ['required', 'confirmed', Password::defaults()],
                'role' => ['required', 'in:doctor,patient'],
                'phone' => ['required', 'string'],
                'address' => ['required', 'string'],
            ]);

            // Doctor-specific validation
            if ($request->role === 'doctor') {
                $request->validate([
                    'niom' => ['required', 'string', 'unique:doctors'],
                    'speciality' => ['required', 'string'],
                    'price' => ['required', 'numeric', 'min:0'],
                    'languages' => ['required'],
                    'experience' => ['required', 'string'],
                    'education' => ['required', 'string'],
                    'location' => ['required', 'string'],
                    'latitude' => ['required', 'numeric'],
                    'longitude' => ['required', 'numeric'],
                    'description' => ['nullable', 'string'],
                ]);

                // Validate files before handling them
                $this->validateDoctorFiles($request);
            }

            \DB::beginTransaction();

            try {
                // Create user
                $userData = $request->only(['name', 'email', 'role', 'phone', 'address']);
                $userData['password'] = Hash::make($request->password);
                
                // Handle file uploads for doctor
                if ($request->role === 'doctor') {
                    $files = $this->handleDoctorFiles($request);
                    $userData = array_merge($userData, $files);
                }

                $user = User::create($userData);

                if ($user->role === 'doctor') {
                    // Parse languages
                    $languages = is_string($request->languages) ? 
                        json_decode($request->languages, true) : 
                        $request->languages;

                    Doctor::create([
                        'user_id' => $user->id,
                        'niom' => $request->niom,
                        'speciality' => $request->speciality,
                        'price' => floatval($request->price),
                        'languages' => $languages,
                        'experience' => $request->experience,
                        'education' => $request->education,
                        'location' => $request->location,
                        'city' => $this->extractCityFromLocation($request->location),
                        'latitude' => floatval($request->latitude),
                        'longitude' => floatval($request->longitude),
                        'description' => $request->description,
                    ]);
                } else {
                    Patient::create(['user_id' => $user->id]);
                }

                \DB::commit();

                // Load relationships
                $user->load($user->role === 'doctor' ? 'doctor' : 'patient');
                
                return response()->json([
                    'user' => $user,
                    'token' => $user->createToken('auth_token')->plainTextToken
                ], 201);

            } catch (\Exception $e) {
                \DB::rollback();
                throw $e;
            }
        } catch (\Exception $e) {
            \Log::error('Registration error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->except(['password', 'password_confirmation'])
            ]);
            return response()->json([
                'message' => 'Registration failed',
                'errors' => $e instanceof ValidationException ? 
                    $e->errors() : ['general' => [$e->getMessage()]]
            ], 422);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function check()
    {
        if (auth()->check()) {
            return response()->json([
                'authenticated' => true,
                'user' => auth()->user()
            ]);
        }

        return response()->json(['authenticated' => false], 401);
    }

    private function extractCityFromLocation(string $location): string 
    {
        try {
            $parts = explode(',', $location);
            $parts = array_map('trim', $parts);
            // Look for the city in the address components
            foreach ($parts as $part) {
                // Simple check - you might want to improve this logic
                if (strlen($part) > 2 && !preg_match('/^\d+$/', $part)) {
                    return $part;
                }
            }
            return $parts[0] ?? ''; // Fallback to first component
        } catch (\Exception $e) {
            \Log::warning('Error extracting city:', ['location' => $location, 'error' => $e->getMessage()]);
            return '';
        }
    }
}
