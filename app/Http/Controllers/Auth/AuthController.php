<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'in:doctor,laboratory,patient'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
        ];

        if ($request->role === User::ROLE_DOCTOR) {
            $rules['niom'] = ['required', 'string', 'unique:users'];
            $rules['id_card_front'] = ['required', 'image', 'max:2048'];
            $rules['id_card_back'] = ['required', 'image', 'max:2048'];
        } elseif ($request->role === User::ROLE_LABORATORY) {
            $rules['laboratory_license'] = ['required', 'image', 'max:2048'];
        }

        $validated = $request->validate($rules);
        
        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'],
            'address' => $validated['address'] ?? null,
        ];

        // Handle file uploads
        if ($request->hasFile('id_card_front')) {
            $userData['id_card_front'] = $request->file('id_card_front')
                ->store('users/doctors/id-cards', 'public');
        }
        if ($request->hasFile('id_card_back')) {
            $userData['id_card_back'] = $request->file('id_card_back')
                ->store('users/doctors/id-cards', 'public');
        }
        if ($request->hasFile('laboratory_license')) {
            $userData['laboratory_license'] = $request->file('laboratory_license')
                ->store('users/labs/licenses', 'public');
        }
        if ($request->has('niom')) {
            $userData['niom'] = $validated['niom'];
        }

        $user = User::create($userData);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = User::where('email', $request->email)->first();
        
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

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
