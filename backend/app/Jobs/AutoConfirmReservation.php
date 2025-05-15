<?php

namespace App\Jobs;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AutoConfirmReservation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct()
    {
        //
    }

    public function handle(): void
    {
        $now = now();
        $target = $now->copy()->addMinutes(30);

        // Confirm reservations scheduled between now and 30 minutes from now
        Reservation::where('reservation_status', 'pending')
            ->whereDate('reservation_date', $now->toDateString())
            ->whereTime('reservation_time', '>=', $now->format('H:i:s'))
            ->whereTime('reservation_time', '<=', $target->format('H:i:s'))
            ->update(['reservation_status' => 'confirmed']);
    }
}
