<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentRefund extends Model
{
    protected $fillable = [
        'reservation_id',
        'patient_id',
        'doctor_id',
        'amount',
        'status',
        'refund_date'
    ];

    protected $casts = [
        'refund_date' => 'datetime',
        'amount' => 'decimal:2'
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
