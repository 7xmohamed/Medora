<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\NotificationController;

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
    Route::post('/patient/profile/update', [PatientController::class, 'updateProfile']);
    Route::post('/patient/profile/picture', [PatientController::class, 'updateProfilePicture']);

    // -------------------------------


    // Admin routes ----------------------
    Route::prefix('admin')->middleware(['role:admin'])->group(function () {
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
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    });
    // -----------------------------


    // Doctor routes
    Route::prefix('doctor')->middleware('role:doctor')->group(function () {
        Route::get('/dashboard', [DoctorController::class, 'dashboard']);
        Route::get('/profile', [DoctorController::class, 'getProfile']);
        Route::post('/profile/picture', [DoctorController::class, 'updateProfilePicture']);
        Route::post('/profile/update', [DoctorController::class, 'updateProfile']);

        Route::get('/availabilities', [DoctorController::class, 'getAvailabilities']);
        Route::post('/availabilities', [DoctorController::class, 'storeAvailability']);
        Route::delete('/availabilities/{id}', [DoctorController::class, 'deleteAvailability']);
        Route::get('/getAppointments/{appointmentId}', [AppointmentController::class, 'getAppointments']);
        Route::get('/appointments', [DoctorController::class, 'getAllAppointments']);
        Route::post('/doctor-report', [ReportController::class, 'uploadDoctorReport']);
        Route::post('/prescription', [ReportController::class, 'uploadPrescription']);
        Route::post('/analysis-request', [ReportController::class, 'uploadAnalysisRequest']);
        Route::delete('/doctor-report/{id}', [ReportController::class, 'deleteDoctorReport']);
        Route::delete('/prescription/{id}', [ReportController::class, 'deletePrescription']);
        Route::delete('/analysis-request/{id}', [ReportController::class, 'deleteAnalysisRequest']);
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    });
    // ------------------------------


    // Patient routes
    Route::prefix('patient')->middleware('role:patient')->group(function () {
        Route::get('/profile', [PatientController::class, 'getProfile']);
        Route::post('/profile/update', [PatientController::class, 'updateProfile']);
        Route::post('/profile/picture', [PatientController::class, 'updateProfilePicture']);
        Route::get('/doctorsbyid/{doctorId}', [DoctorController::class, 'getDoctorById']);
        Route::post('/reservations', [ReservationController::class, 'createReservation']);
        Route::get('/getDoctorReservations/{doctorId}', [ReservationController::class, 'getDoctorReservations']);
        Route::get('/getpatientreservations', [ReservationController::class, 'getPatientReservations']);
        Route::get('/reservations/{id}', [ReservationController::class, 'getReservationById']);
        Route::get('/getAppointments/{appointmentId}', [AppointmentController::class, 'getAppointments']);
        Route::get('/analytics', [PatientController::class, 'analytics']);
        Route::post('/cancelReservation/{reservationId}', [ReservationController::class, 'cancelReservation']);
        Route::get('reservations/booked-slots/{doctorId}', [ReservationController::class, 'getBookedSlots']);
        Route::post('/upload-lab-result', [FileController::class, 'uploadLabResult']);
        Route::delete('/delete-lab-result/{id}', [FileController::class, 'deleteLabResult']);
        Route::get('/slots/{doctorId}', [ReservationController::class, 'getSlots']);
    });

    // Lab Results routes
    Route::post('/list-lab-results', [FileController::class, 'listLabResults']);


    // Doctor Report routes
    Route::get('/reservationreports/{reservationId}', [ReportController::class, 'getReservationReports']);


    Route::post('/patient/profile/picture', [PatientController::class, 'updateProfilePicture']);
});


// Enable sanctum for all routes
Route::middleware('web')->group(function () {
    Route::get('/sanctum/csrf-cookie', function () {
        return response()->json(['message' => 'CSRF cookie set']);
    });
});
