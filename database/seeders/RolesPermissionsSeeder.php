<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesPermissionsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach (config("permissions") as $permission_name) {
            Permission::firstOrCreate(['name' => $permission_name]);
        }

        foreach (config("roles") as $role_name) {
            $role = Role::firstOrCreate(['name' => $role_name]);
            $role->syncPermissions(config("assigned_roles.{$role_name}"));
        }
    }
}
