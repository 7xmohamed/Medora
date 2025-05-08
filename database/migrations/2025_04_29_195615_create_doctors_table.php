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
            $table->foreignId('user_id')->constrained();
            $table->string('speciality')->nullable();
            $table->string('niom')->nullable();
            $table->string('location')->nullable();
            $table->string('location_searchable')->nullable();
            $table->string('city')->nullable();
            $table->string('city_searchable')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->json('languages')->nullable();
            $table->string('experience')->nullable();
            $table->string('education')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('total_revenue', 10, 2)->default(0)->change();
            $table->decimal('monthly_revenue', 10, 2)->default(0)->change();
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
