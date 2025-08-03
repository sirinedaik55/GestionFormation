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

        // Create multiple trainers
        $trainers = [
            [
                'first_name' => 'Syrine',
                'last_name' => 'Daik',
                'email' => 'trainer@formation.com',
                'specialite' => 'Angular & TypeScript',
                'phone' => '+33123456789',
            ],
            [
                'first_name' => 'Jean',
                'last_name' => 'Dupont',
                'email' => 'jean.dupont@formation.com',
                'specialite' => 'Web Development',
                'phone' => '+33123456790',
            ],
            [
                'first_name' => 'Marie',
                'last_name' => 'Martin',
                'email' => 'marie.martin@formation.com',
                'specialite' => 'Data Science',
                'phone' => '+33123456791',
            ],
            [
                'first_name' => 'Pierre',
                'last_name' => 'Durand',
                'email' => 'pierre.durand@formation.com',
                'specialite' => 'Project Management',
                'phone' => '+33123456792',
            ],
            [
                'first_name' => 'Sophie',
                'last_name' => 'Leclerc',
                'email' => 'sophie.leclerc@formation.com',
                'specialite' => 'Digital Marketing',
                'phone' => '+33123456793',
            ],
            [
                'first_name' => 'Thomas',
                'last_name' => 'Bernard',
                'email' => 'thomas.bernard@formation.com',
                'specialite' => 'Cybersecurity',
                'phone' => '+33123456794',
            ],
        ];

        foreach ($trainers as $trainer) {
            User::create([
                'first_name' => $trainer['first_name'],
                'last_name' => $trainer['last_name'],
                'email' => $trainer['email'],
                'password' => Hash::make('trainer123'),
                'role' => 'formateur',
                'specialite' => $trainer['specialite'],
                'phone' => $trainer['phone'],
                'status' => 'active',
                'team_id' => null, // Trainers don't belong to teams
            ]);
        }

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

        // Create more employees for better statistics
        $moreEmployees = [
            ['first_name' => 'Alice', 'last_name' => 'Brown', 'email' => 'alice.brown@formation.com', 'team_id' => 1],
            ['first_name' => 'Bob', 'last_name' => 'Davis', 'email' => 'bob.davis@formation.com', 'team_id' => 2],
            ['first_name' => 'Charlie', 'last_name' => 'Miller', 'email' => 'charlie.miller@formation.com', 'team_id' => 3],
            ['first_name' => 'Diana', 'last_name' => 'Garcia', 'email' => 'diana.garcia@formation.com', 'team_id' => 4],
            ['first_name' => 'Eve', 'last_name' => 'Rodriguez', 'email' => 'eve.rodriguez@formation.com', 'team_id' => 5],
            ['first_name' => 'Frank', 'last_name' => 'Martinez', 'email' => 'frank.martinez@formation.com', 'team_id' => 1],
            ['first_name' => 'Grace', 'last_name' => 'Anderson', 'email' => 'grace.anderson@formation.com', 'team_id' => 2],
            ['first_name' => 'Henry', 'last_name' => 'Taylor', 'email' => 'henry.taylor@formation.com', 'team_id' => 3],
            ['first_name' => 'Ivy', 'last_name' => 'Thomas', 'email' => 'ivy.thomas@formation.com', 'team_id' => 4],
            ['first_name' => 'Jack', 'last_name' => 'Jackson', 'email' => 'jack.jackson@formation.com', 'team_id' => 5],
        ];

        foreach ($moreEmployees as $index => $employee) {
            User::create([
                'first_name' => $employee['first_name'],
                'last_name' => $employee['last_name'],
                'email' => $employee['email'],
                'password' => Hash::make('employee123'),
                'role' => 'employe',
                'specialite' => null,
                'phone' => '+3398765432' . ($index + 5),
                'status' => 'active',
                'team_id' => $employee['team_id'],
            ]);
        }
    }
}
