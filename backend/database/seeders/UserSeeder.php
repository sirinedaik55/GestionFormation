<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@formation.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'specialite' => null,
            'phone' => '+33123456789',
            'status' => 'active',
            'team_id' => null,
        ]);

        // Create trainer user
        User::create([
            'first_name' => 'Syrine',
            'last_name' => 'Daik',
            'email' => 'trainer@formation.com',
            'password' => Hash::make('trainer123'),
            'role' => 'formateur',
            'specialite' => 'Angular & TypeScript',
            'phone' => '+33123456789',
            'status' => 'active',
            'team_id' => null, // Trainers don't belong to teams
        ]);

        // Create employee user
        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'employee@formation.com',
            'password' => Hash::make('employee123'),
            'role' => 'employe',
            'specialite' => null,
            'phone' => '+33987654321',
            'status' => 'active',
            'team_id' => 1, // Assign to Development Team
        ]);

        // Create additional employees for testing
        User::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane.smith@formation.com',
            'password' => Hash::make('employee123'),
            'role' => 'employe',
            'specialite' => null,
            'phone' => '+33987654322',
            'status' => 'active',
            'team_id' => 1, // Development Team
        ]);

        User::create([
            'first_name' => 'Mike',
            'last_name' => 'Johnson',
            'email' => 'mike.johnson@formation.com',
            'password' => Hash::make('employee123'),
            'role' => 'employe',
            'specialite' => null,
            'phone' => '+33987654323',
            'status' => 'active',
            'team_id' => 2, // UI/UX Team
        ]);

        User::create([
            'first_name' => 'Sarah',
            'last_name' => 'Wilson',
            'email' => 'sarah.wilson@formation.com',
            'password' => Hash::make('employee123'),
            'role' => 'employe',
            'specialite' => null,
            'phone' => '+33987654324',
            'status' => 'active',
            'team_id' => 3, // Security Team
        ]);
    }
}
