<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/contact', [ContactController::class, 'store']);

// Guest only routes
Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Doctor routes
    Route::prefix('doctor')->middleware('role:doctor')->group(function () {
        Route::get('/dashboard', 'DoctorController@dashboard');
        Route::get('/orders', 'DoctorController@orders');
    });

    // Patient routes
    Route::prefix('patient')->middleware('role:patient')->group(function () {
        Route::get('/dashboard', 'PatientController@dashboard');
        Route::get('/results', 'PatientController@results');
    });
});
