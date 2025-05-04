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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('speciality')->nullable();
            $table->string('niom')->nullable(); // numéro d'inscription à l'Ordre des Médecins            
            $table->string('location')->nullable(); // Make location nullable
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->json('languages')->nullable();
            $table->string('experience')->nullable();
            $table->string('education')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->string('city')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
