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
        Schema::create('scraper_processes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('scraper_name');
            $table->string('scraper_class');
            $table->integer('total_records')->default(0);
            $table->integer('current_records_scraped')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->integer('retry_count')->default(0);
            $table->text('last_error_message')->nullable();
            $table->text('remarks')->nullable();
            $table->string('status');
            $table->boolean('is_published')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scraper_processes');
    }
};
