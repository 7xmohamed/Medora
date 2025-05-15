<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ConfirmPendingReservations extends Command
{
    protected $signature = 'reservations:confirm-pending';
    protected $description = 'Confirm pending reservations that are within 30 minutes of their start time';

    public function handle()
    {
        $thirtyMinutesFromNow = Carbon::now()->addMinutes(30);

        // Get all pending reservations that are coming up in the next 30 minutes
        $pendingReservations = Reservation::where('reservation_status', 'pending')
            ->where(function ($query) use ($thirtyMinutesFromNow) {
                $query->whereDate('reservation_date', today())
                    ->whereTime('reservation_time', '<=', $thirtyMinutesFromNow->format('H:i:s'))
                    ->whereTime('reservation_time', '>', now()->format('H:i:s'));
            })
            ->orWhere(function ($query) {
                $query->whereDate('reservation_date', tomorrow())
                    ->whereTime('reservation_time', '<', '00:30:00');
            })
            ->get();

        foreach ($pendingReservations as $reservation) {
            $reservationDateTime = Carbon::parse($reservation->reservation_date . ' ' . $reservation->reservation_time);
            $minutesUntilReservation = now()->diffInMinutes($reservationDateTime, false);

            if ($minutesUntilReservation <= 30 && $minutesUntilReservation > 0) {
                $reservation->update(['reservation_status' => 'confirmed']);
                \Log::info('Reservation automatically confirmed', [
                    'reservation_id' => $reservation->id,
                    'datetime' => $reservationDateTime
                ]);
            }
        }
    }
}
