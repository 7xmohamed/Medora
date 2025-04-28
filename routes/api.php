<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/contact', [ContactController::class, 'store']);

// Guest only routes
Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Admin routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboardStats'])
        ->middleware('role:admin');
    
    // Protected routes
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Doctor routes
    Route::prefix('doctor')->middleware('role:doctor')->group(function () {
        Route::get('/dashboard', 'DoctorController@dashboard');
        Route::get('/orders', 'DoctorController@orders');
    });

    // Patient routes
    Route::prefix('patient')->middleware('role:patient')->group(function () {
        Route::get('/results', 'PatientController@results');
        Route::get('/tests', 'PatientController@tests');
    });
});

// Enable sanctum for all routes
Route::middleware('web')->group(function () {
    Route::get('/sanctum/csrf-cookie', function () {
        return response()->json(['message' => 'CSRF cookie set']);
    });
});
