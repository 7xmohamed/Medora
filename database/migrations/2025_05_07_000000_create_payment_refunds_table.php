<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
            $table->foreignId('patient_id')->constrained('users');  // Changed from patients to users
            $table->foreignId('doctor_id')->constrained('users');   // Changed from doctors to users
            $table->decimal('amount', 10, 2);
            $table->string('status');
            $table->timestamp('refund_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_refunds');
    }
};
