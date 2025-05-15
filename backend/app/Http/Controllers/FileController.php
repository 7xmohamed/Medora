<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LabResult;
use App\Models\Reservation;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    private function resolveReservationId(Request $request)
    {
        $reservationId = $request->input('reservation_id') ?? $request->input('appointment_id');
        if (!$reservationId || !Reservation::find($reservationId)) {
            return null;
        }
        return $reservationId;
    }

    public function uploadLabResult(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpeg,png,jpg|max:2048',
            'appointment_id' => 'nullable|integer',
            'reservation_id' => 'nullable|integer',
        ]);

        $reservationId = $this->resolveReservationId($request);
        if (!$reservationId) {
            return response()->json(['error' => 'Reservation not found'], 404);
        }

        $path = $request->file('file')->store('lab_results', 'public');

        $labResult = LabResult::create([
            'reservation_id' => $reservationId,
            'file_path' => $path,
        ]);

        return response()->json([
            'id' => $labResult->id,
            'file_url' => asset('storage/' . $path),
            'file_path' => $path,
        ]);
    }



    public function deleteLabResult($id)
    {
        $labResult = LabResult::find($id);
        if (!$labResult) {
            return response()->json(['error' => 'File not found'], 404);
        }

        Storage::disk('public')->delete($labResult->file_path);
        $labResult->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }

    public function listLabResults(Request $request)
    {
        $request->validate([
            'appointment_id' => 'nullable|integer',
            'reservation_id' => 'nullable|integer',
        ]);

        $reservationId = $this->resolveReservationId($request);
        if (!$reservationId) {
            return response()->json(['error' => 'Reservation not found'], 404);
        }

        $labResults = LabResult::where('reservation_id', $reservationId)->get();

        return response()->json($labResults->map(function ($result) {
            return [
                'id' => $result->id,
                'file_url' => asset('storage/' . $result->file_path),
                'file_path' => $result->file_path,
            ];
        }));
    }

    public function getLabResult($id)
    {
        $labResult = LabResult::find($id);
        if (!$labResult) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return response()->json([
            'id' => $labResult->id,
            'file_url' => asset('storage/' . $labResult->file_path),
            'file_path' => $labResult->file_path,
        ]);
    }
}
