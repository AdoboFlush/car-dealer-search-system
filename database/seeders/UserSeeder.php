<?php

namespace Database\Seeders;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'super_admin',
            'email' => 'adb_super_admin@gmail.com',
            'password' => Hash::make("Test12345!"),
            'type' => UserType::Admin,
        ]);
        $user->syncRoles(["super_admin"]);

        $user = User::create([
            'name' => 'admin',
            'email' => 'adb_admin@gmail.com',
            'password' => Hash::make("Test12345!"),
            'type' => UserType::Admin,
        ]);
        $user->syncRoles(["admin"]);
    }
}
