<?php

namespace App\Http\Controllers;

use App\Models\DoctorReport;
use App\Models\Prescription;
use App\Models\RequestAnalyse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    // Upload Doctor Report
    public function uploadDoctorReport(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'report_text' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ]);

        $filePath = $request->file('file')->store('doctor_reports', 'public');

        $report = DoctorReport::create([
            'reservation_id' => $request->reservation_id,
            'report_text' => $request->report_text,
            'file_path' => $filePath,
        ]);

        return response()->json([
            'message' => 'Doctor report uploaded successfully',
            'data' => $report,
        ], 201);
    }

    // Upload Prescription
    public function uploadPrescription(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'prescription_text' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $filePath = $request->file('file')->store('prescriptions', 'public');

        $prescription = Prescription::create([
            'reservation_id' => $request->reservation_id,
            'prescription_text' => $request->prescription_text,
            'file_path' => $filePath,
        ]);

        return response()->json([
            'message' => 'Prescription uploaded successfully',
            'data' => $prescription,
        ], 201);
    }

    // Upload Analysis Request
    public function uploadAnalysisRequest(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $filePath = $request->file('file')->store('analysis_requests', 'public');

        $analysis = RequestAnalyse::create([
            'reservation_id' => $request->reservation_id,
            'file_path' => $filePath,
        ]);

        return response()->json([
            'message' => 'Analysis request uploaded successfully',
            'data' => $analysis,
        ], 201);
    }

    // Get all reports for a reservation
    public function getReservationReports($reservationId)
    {
        $reports = DoctorReport::where('reservation_id', $reservationId)->get();
        $prescriptions = Prescription::where('reservation_id', $reservationId)->get();
        $analyses = RequestAnalyse::where('reservation_id', $reservationId)->get();

        return response()->json([
            'doctor_reports' => $reports,
            'prescriptions' => $prescriptions,
            'analysis_requests' => $analyses,
        ]);
    }

    // Delete Doctor Report
    public function deleteDoctorReport($id)
    {
        $report = DoctorReport::findOrFail($id);
        if ($report->file_path && \Storage::disk('public')->exists($report->file_path)) {
            \Storage::disk('public')->delete($report->file_path);
        }
        $report->delete();
        return response()->json(['message' => 'Doctor report deleted successfully']);
    }

    // Delete Prescription
    public function deletePrescription($id)
    {
        $prescription = Prescription::findOrFail($id);
        if ($prescription->file_path && \Storage::disk('public')->exists($prescription->file_path)) {
            \Storage::disk('public')->delete($prescription->file_path);
        }
        $prescription->delete();
        return response()->json(['message' => 'Prescription deleted successfully']);
    }

    // Delete Analysis Request
    public function deleteAnalysisRequest($id)
    {
        $analysis = RequestAnalyse::findOrFail($id);
        if ($analysis->file_path && \Storage::disk('public')->exists($analysis->file_path)) {
            \Storage::disk('public')->delete($analysis->file_path);
        }
        $analysis->delete();
        return response()->json(['message' => 'Analysis request deleted successfully']);
    }
}