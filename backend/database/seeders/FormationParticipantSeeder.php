<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormationParticipant;

class FormationParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Assign employees to formations
        $participants = [
            // Formation 1 - Angular Advanced (Team 1 - Development)
            ['formation_id' => 1, 'user_id' => 3, 'status' => 'confirmed', 'attendance' => 'present'], // John Doe
            ['formation_id' => 1, 'user_id' => 4, 'status' => 'confirmed', 'attendance' => 'present'], // Jane Smith
            
            // Formation 2 - TypeScript Best Practices (Team 1 - Development)
            ['formation_id' => 2, 'user_id' => 3, 'status' => 'confirmed', 'attendance' => 'pending'], // John Doe
            ['formation_id' => 2, 'user_id' => 4, 'status' => 'confirmed', 'attendance' => 'pending'], // Jane Smith
            
            // Formation 3 - React Fundamentals (Team 1 - Development)
            ['formation_id' => 3, 'user_id' => 3, 'status' => 'confirmed', 'attendance' => 'present'], // John Doe
            ['formation_id' => 3, 'user_id' => 4, 'status' => 'confirmed', 'attendance' => 'absent'], // Jane Smith
            
            // Formation 4 - UI/UX Design (Team 2 - UI/UX)
            ['formation_id' => 4, 'user_id' => 5, 'status' => 'confirmed', 'attendance' => 'present'], // Mike Johnson
            
            // Formation 5 - Security Fundamentals (Team 3 - Security)
            ['formation_id' => 5, 'user_id' => 6, 'status' => 'confirmed', 'attendance' => 'present'], // Sarah Wilson
            
            // Formation 6 - JavaScript ES6+ (All teams)
            ['formation_id' => 6, 'user_id' => 3, 'status' => 'confirmed', 'attendance' => 'present'], // John Doe
            ['formation_id' => 6, 'user_id' => 4, 'status' => 'confirmed', 'attendance' => 'present'], // Jane Smith
            ['formation_id' => 6, 'user_id' => 5, 'status' => 'confirmed', 'attendance' => 'absent'], // Mike Johnson
            ['formation_id' => 6, 'user_id' => 6, 'status' => 'confirmed', 'attendance' => 'present'], // Sarah Wilson
        ];

        foreach ($participants as $participant) {
            FormationParticipant::create($participant);
        }
    }
}
