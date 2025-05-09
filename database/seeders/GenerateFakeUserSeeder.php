<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class GenerateFakeUserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->count(50)->create();
    }
}
