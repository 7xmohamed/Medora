<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ReservationController;

// Public routes
Route::post('/contact', [ContactController::class, 'store']);

// Public doctor routes
Route::get('/doctors/location/{country}/{city}', [DoctorController::class, 'getDoctorsByLocation']);
Route::get('/doctors/nearby', [DoctorController::class, 'getNearbyDoctors']);
Route::get('/doctors/public/{id}', [DoctorController::class, 'getPublicProfile']);

// Doctor location routes
Route::prefix('doctors')->group(function () {
    Route::get('/location/{country}/{city}', [DoctorController::class, 'getDoctorsByLocation']);
    Route::get('/nearby', [DoctorController::class, 'getNearbyDoctors']);
});

// Guest only routes
Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware(['auth:sanctum'])->group(function () {



    // Protected routes ------------------
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/role', [AppointmentController::class, 'role']);
    
    // -------------------------------


    // Admin routes ----------------------
    Route::prefix('admin')->middleware(['role:admin'])->group(function() {
        Route::get('/dashboard', [AdminController::class, 'dashboardStats']);
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/users/{id}', [AdminController::class, 'getUserDetails']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::get('/doctors', [AdminController::class, 'getDoctors']);
        Route::patch('/doctors/{id}/verify', [AdminController::class, 'updateDoctorStatus']);
        Route::delete('/doctors/{id}', [AdminController::class, 'deleteDoctor']);
        Route::get('/contact-messages', [AdminController::class, 'getContactMessages']);
        Route::delete('/contact-messages/{id}', [AdminController::class, 'deleteContactMessage']);
        Route::get('/reservation-stats', [AdminController::class, 'getReservationStats']);
        Route::get('/doctor-specialties', [AdminController::class, 'getDoctorSpecialties']);
        Route::get('/monthly-users', [AdminController::class, 'getMonthlyUsers']);
    });
    // -----------------------------


    // Doctor routes
    Route::prefix('doctor')->middleware('role:doctor')->group(function () {
        Route::get('/dashboard', [DoctorController::class, 'dashboard']);
        Route::get('/profile', [DoctorController::class, 'getProfile']);
        Route::post('/profile/picture', [DoctorController::class, 'updateProfilePicture']);

        Route::get('/availabilities', [DoctorController::class, 'getAvailabilities']);
        Route::post('/availabilities', [DoctorController::class, 'storeAvailability']);
        Route::delete('/availabilities/{id}', [DoctorController::class, 'deleteAvailability']);
        Route::get('/getAppointments/{appointmentId}', [AppointmentController::class, 'getAppointments']);

    });
    // ------------------------------


    // Patient routes
    Route::prefix('patient')->middleware('role:patient')->group(function () {
        Route::get('/profile', [PatientController::class, 'getProfile']);
        Route::post('/profile/update', [PatientController::class, 'updateProfile']);
        Route::get('/doctorsbyid/{doctorId}',[DoctorController::class, 'getDoctorById']);
        Route::post('/reservations', [ReservationController::class, 'createReservation']);
        Route::get('/getDoctorReservations/{doctorId}', [ReservationController::class, 'getDoctorReservations']);
        Route::get('/getpatientreservations', [ReservationController::class, 'getPatientReservations']);
        Route::get('/reservations/{id}', [ReservationController::class, 'getReservationById']);
        Route::get('/getAppointments/{appointmentId}', [AppointmentController::class, 'getAppointments']);
        Route::get('/analytics', [PatientController::class, 'analytics']);
        Route::post('/cancelReservation/{reservationId}', [ReservationController::class, 'cancelReservation']);
    });
});


// Enable sanctum for all routes
Route::middleware('web')->group(function () {
    Route::get('/sanctum/csrf-cookie', function () {
        return response()->json(['message' => 'CSRF cookie set']);
    });
});
