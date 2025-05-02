<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\Api\AuthController;

// Public routes
Route::post('/contact', [ContactController::class, 'store']);

// Guest only routes
Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    
    // Protected routes ------------------


    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Admin routes
    
    Route::prefix('admin')->middleware(['role:admin'])->group(function() {
        Route::get('/dashboard', [AdminController::class, 'dashboardStats']);
        Route::get('/contact-messages', [AdminController::class, 'getContactMessages']);
        Route::delete('/contact-messages/{id}', [AdminController::class, 'deleteContactMessage']);
    });

    

    // Doctor routes
    Route::prefix('doctor')->middleware('role:doctor')->group(function () {
        Route::get('/dashboard', [DoctorController::class, 'dashboard']);
    });

    // Patient routes
    Route::prefix('patient')->middleware('role:patient')->group(function () {
        Route::get('/profile', [PatientController::class, 'getProfile']);
        Route::post('/profile/update', [PatientController::class, 'updateProfile']);
    });
});

// Enable sanctum for all routes
Route::middleware('web')->group(function () {
    Route::get('/sanctum/csrf-cookie', function () {
        return response()->json(['message' => 'CSRF cookie set']);
    });
});
