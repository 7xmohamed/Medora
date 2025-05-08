<?php

namespace App\Models;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\LabResult;
use App\Models\DoctorReport;
use App\Models\Prescription;
use App\Models\RequestAnalyse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model {

    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'price',
        'payment_status',
        'reservation_status',
        'reason',
        'reservation_date',
        'reservation_time',
    ];

    protected $casts = [
        'reservation_date' => 'date',
        'reservation_time' => 'datetime:H:i:s',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function doctorReport(){
        return $this->hasOne(DoctorReport::class);
    }

    public function labResult(){
        return $this->hasOne(LabResult::class);
    }

    public function requestAnalyse(){
        return $this->hasOne(RequestAnalyse::class);
    }

    public function prescription(){
        return $this->hasOne(Prescription::class);
    }

}