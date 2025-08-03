<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DefaultAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default admin user if it doesn't exist
        $adminEmail = 'admin@formation.com';
        
        if (!User::where('email', $adminEmail)->exists()) {
            User::create([
                'first_name' => 'System',
                'last_name' => 'Administrator',
                'email' => $adminEmail,
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            $this->command->info('Default admin user created: ' . $adminEmail);
        } else {
            $this->command->info('Default admin user already exists: ' . $adminEmail);
        }
    }
}
