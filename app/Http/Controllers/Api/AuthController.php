<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Doctor;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', 'in:doctor,patient'],
            'phone' => ['required', 'string'],
            'address' => ['required', 'string'],
        ] + $this->getRoleSpecificRules($request->role));

        $userData = $request->only(['name', 'email', 'role', 'phone', 'address']);
        $userData['password'] = Hash::make($request->password);
        
        // Handle file uploads based on role
        if ($request->role === 'doctor') {
            $userData += $this->handleDoctorFiles($request);
        }

        $user = User::create($userData);

        if ($user->role === 'doctor') {
            Doctor::create([
                'user_id' => $user->id,
                'location' => $user->address,
            ]);
        }


        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken
        ], 201);
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

    private function getRoleSpecificRules(string $role): array
    {
        if ($role === 'doctor') {
            return [
                'niom' => ['required', 'string', 'unique:users'],
                'id_card_front' => ['required', 'image'],
                'id_card_back' => ['required', 'image'],
            ];
        }
        

        return [];
    }

    private function handleDoctorFiles(Request $request): array
    {
        return [
            'niom' => $request->niom,
            'id_card_front' => $request->file('id_card_front')->store('doctors/id-cards', 'public'),
            'id_card_back' => $request->file('id_card_back')->store('doctors/id-cards', 'public'),
        ];
    }
}
