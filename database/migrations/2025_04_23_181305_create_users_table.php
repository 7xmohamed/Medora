<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create 'users' table with all required fields
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone');  // Optional field
            $table->string('address')->nullable(); // Added address field
            $table->enum('role', ['laboratory', 'doctor', 'patient', 'admin']); // Role added here
            $table->string('id_card_front')->nullable();
            $table->string('id_card_back')->nullable();
            $table->string('niom')->nullable(); // numéro d'inscription à l'Ordre des Médecins
            $table->string('laboratory_license')->nullable(); // Laboratory License column
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->softDeletes(); // Adds a 'deleted_at' column for soft deletes
            $table->timestamps();
        });

        // Create 'password_reset_tokens' table
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Create 'sessions' table
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the tables in reverse order
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
