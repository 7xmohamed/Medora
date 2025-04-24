<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Auth check route
Route::get('/auth/check', [AuthController::class, 'check'])
    ->middleware('auth:sanctum');

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

    // Laboratory routes  
    Route::prefix('lab')->middleware('role:laboratory')->group(function () {
        Route::get('/dashboard', 'LaboratoryController@dashboard');
        Route::get('/tests', 'LaboratoryController@tests');
    });

    // Patient routes
    Route::prefix('patient')->middleware('role:patient')->group(function () {
        Route::get('/dashboard', 'PatientController@dashboard');
        Route::get('/results', 'PatientController@results');
    });
});
