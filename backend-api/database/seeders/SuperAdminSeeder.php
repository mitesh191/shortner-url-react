<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Enums\UserRole;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    	User::create([
    			'name' => 'Super Admin',
    			'email' => 'superadmin@example.com',
    			'password' => bcrypt(config('constants.DEFAULT_SUPERADMIN_PASSWORD')),
    			'role' => UserRole::SUPERADMIN,
    			'client_id' => null
    	]);
    }
}
