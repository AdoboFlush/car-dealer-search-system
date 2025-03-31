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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('type')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('currency', 3)->nullable();
            $table->text('description')->nullable();
            $table->text('details_link')->nullable();
            $table->text('thumbnail_link')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->bigInteger('scraper_process_id')->default(0);
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
