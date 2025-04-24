<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
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
            'role' => ['required', 'in:doctor,laboratory,patient'],
            'phone' => ['required', 'string'],
            'address' => ['required', 'string'],
        ] + $this->getRoleSpecificRules($request->role));

        $userData = $request->only(['name', 'email', 'role', 'phone', 'address']);
        $userData['password'] = Hash::make($request->password);
        
        // Handle file uploads based on role
        if ($request->role === 'doctor') {
            $userData += $this->handleDoctorFiles($request);
        } elseif ($request->role === 'laboratory') {
            $userData += $this->handleLaboratoryFiles($request);
        }

        $user = User::create($userData);

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
        
        if ($role === 'laboratory') {
            return [
                'laboratory_license' => ['required', 'image'],
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

    private function handleLaboratoryFiles(Request $request): array
    {
        return [
            'laboratory_license' => $request->file('laboratory_license')->store('labs/licenses', 'public'),
        ];
    }
}
