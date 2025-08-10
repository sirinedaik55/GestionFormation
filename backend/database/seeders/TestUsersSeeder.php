<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testUsers = [
            // Trainers
            [
                'first_name' => 'Marie',
                'last_name' => 'Martin',
                'email' => 'marie.martin@formation.com',
                'password' => Hash::make('trainer123'),
                'role' => 'formateur',
                'status' => 'active',
                'phone' => '+33123456791',
                'specialite' => 'Data Science & Python',
                'email_verified_at' => now(),
            ],
            [
                'first_name' => 'Pierre',
                'last_name' => 'Dubois',
                'email' => 'pierre.dubois@formation.com',
                'password' => Hash::make('trainer123'),
                'role' => 'formateur',
                'status' => 'active',
                'phone' => '+33123456792',
                'specialite' => 'Project Management',
                'email_verified_at' => now(),
            ],
            [
                'first_name' => 'Sophie',
                'last_name' => 'Laurent',
                'email' => 'sophie.laurent@formation.com',
                'password' => Hash::make('trainer123'),
                'role' => 'formateur',
                'status' => 'active',
                'phone' => '+33123456793',
                'specialite' => 'Digital Marketing',
                'email_verified_at' => now(),
            ],

            // Employees
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@formation.com',
                'password' => Hash::make('employee123'),
                'role' => 'employe',
                'status' => 'active',
                'phone' => '+33987654321',
                'specialite' => null,
                'email_verified_at' => now(),
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane.smith@formation.com',
                'password' => Hash::make('employee123'),
                'role' => 'employe',
                'status' => 'active',
                'phone' => '+33987654322',
                'specialite' => null,
                'email_verified_at' => now(),
            ],
            [
                'first_name' => 'Mike',
                'last_name' => 'Johnson',
                'email' => 'mike.johnson@formation.com',
                'password' => Hash::make('employee123'),
                'role' => 'employe',
                'status' => 'active',
                'phone' => '+33987654323',
                'specialite' => null,
                'email_verified_at' => now(),
            ],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Wilson',
                'email' => 'sarah.wilson@formation.com',
                'password' => Hash::make('employee123'),
                'role' => 'employe',
                'status' => 'active',
                'phone' => '+33987654324',
                'specialite' => null,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($testUsers as $userData) {
            // Check if user already exists
            if (!User::where('email', $userData['email'])->exists()) {
                User::create($userData);
                $this->command->info('Created user: ' . $userData['email']);
            } else {
                $this->command->info('User already exists: ' . $userData['email']);
            }
        }

        $this->command->info('Test users seeding completed!');
    }
}
