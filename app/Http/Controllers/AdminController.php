<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboardStats()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'total_doctors' => User::where('role', User::ROLE_DOCTOR)->count(),
                'total_patients' => User::where('role', User::ROLE_PATIENT)->count()
            ];
            
            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
