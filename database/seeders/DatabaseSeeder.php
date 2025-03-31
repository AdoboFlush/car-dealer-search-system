<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $seeders = [
            RolesPermissionsSeeder::class,
            UserSeeder::class,
        ];

        $this->call($seeders);
    }
}
