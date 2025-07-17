<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Team;
use Illuminate\Support\Facades\Hash;

class DefaultUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create default teams first
        $adminTeam = Team::firstOrCreate([
            'name' => 'Administration'
        ], [
            'speciality' => 'Management'
        ]);

        $devTeam = Team::firstOrCreate([
            'name' => 'Development'
        ], [
            'speciality' => 'Software Development'
        ]);

        $hrTeam = Team::firstOrCreate([
            'name' => 'Human Resources'
        ], [
            'speciality' => 'Human Resources'
        ]);

        // Create default admin user
        User::firstOrCreate([
            'email' => 'admin@formation.com'
        ], [
            'first_name' => 'System',
            'last_name' => 'Administrator',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'team_id' => $adminTeam->id,
            'phone' => '+1234567890',
            'status' => 'active'
        ]);

        // Create default trainer
        User::firstOrCreate([
            'email' => 'trainer@formation.com'
        ], [
            'first_name' => 'John',
            'last_name' => 'Trainer',
            'password' => Hash::make('password123'),
            'role' => 'trainer',
            'team_id' => $devTeam->id,
            'phone' => '+1234567891',
            'specialite' => 'Angular & React',
            'date_debut' => now(),
            'room' => 'Room A1',
            'status' => 'active'
        ]);

        // Create default employee
        User::firstOrCreate([
            'email' => 'employee@formation.com'
        ], [
            'first_name' => 'Jane',
            'last_name' => 'Employee',
            'password' => Hash::make('password123'),
            'role' => 'employee',
            'team_id' => $devTeam->id,
            'phone' => '+1234567892',
            'status' => 'active'
        ]);

        // Create additional test users
        User::firstOrCreate([
            'email' => 'trainer2@formation.com'
        ], [
            'first_name' => 'Mike',
            'last_name' => 'Wilson',
            'password' => Hash::make('password123'),
            'role' => 'trainer',
            'team_id' => $hrTeam->id,
            'phone' => '+1234567893',
            'specialite' => 'Leadership & Management',
            'date_debut' => now(),
            'room' => 'Room B2',
            'status' => 'active'
        ]);

        User::firstOrCreate([
            'email' => 'employee2@formation.com'
        ], [
            'first_name' => 'Sarah',
            'last_name' => 'Johnson',
            'password' => Hash::make('password123'),
            'role' => 'employee',
            'team_id' => $hrTeam->id,
            'phone' => '+1234567894',
            'status' => 'active'
        ]);
    }
}
