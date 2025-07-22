<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Formation;
use Carbon\Carbon;

class FormationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $formations = [
            [
                'name' => 'Angular Advanced Concepts',
                'description' => 'Deep dive into Angular advanced features, RxJS, state management, and performance optimization.',
                'date' => Carbon::now()->subDays(10)->format('Y-m-d H:i:s'),
                'duree' => 6,
                'room' => 'Room A',
                'formateur_id' => 2, // Trainer user
                'team_id' => 1, // Development Team
                'status' => 'completed'
            ],
            [
                'name' => 'TypeScript Best Practices',
                'description' => 'Learn TypeScript best practices, advanced types, and modern development patterns.',
                'date' => Carbon::now()->addDays(5)->format('Y-m-d H:i:s'),
                'duree' => 4,
                'room' => 'Room B',
                'formateur_id' => 2,
                'team_id' => 1,
                'status' => 'scheduled'
            ],
            [
                'name' => 'React Fundamentals',
                'description' => 'Introduction to React, hooks, context API, and modern React development.',
                'date' => Carbon::now()->subDays(20)->format('Y-m-d H:i:s'),
                'duree' => 5,
                'room' => 'Room C',
                'formateur_id' => 2,
                'team_id' => 1,
                'status' => 'completed'
            ],
            [
                'name' => 'UI/UX Design Principles',
                'description' => 'Learn fundamental UI/UX design principles, user research, and prototyping.',
                'date' => Carbon::now()->subDays(15)->format('Y-m-d H:i:s'),
                'duree' => 4,
                'room' => 'Room D',
                'formateur_id' => 2,
                'team_id' => 2, // UI/UX Team
                'status' => 'completed'
            ],
            [
                'name' => 'Cybersecurity Fundamentals',
                'description' => 'Introduction to cybersecurity, threat analysis, and security best practices.',
                'date' => Carbon::now()->subDays(8)->format('Y-m-d H:i:s'),
                'duree' => 6,
                'room' => 'Room E',
                'formateur_id' => 2,
                'team_id' => 3, // Security Team
                'status' => 'completed'
            ],
            [
                'name' => 'JavaScript ES6+ Features',
                'description' => 'Modern JavaScript features, async/await, modules, and advanced concepts.',
                'date' => Carbon::now()->addDays(10)->format('Y-m-d H:i:s'),
                'duree' => 3,
                'room' => 'Room A',
                'formateur_id' => 2,
                'team_id' => 1,
                'status' => 'scheduled'
            ],
            [
                'name' => 'Docker & Containerization',
                'description' => 'Learn Docker fundamentals, container orchestration, and deployment strategies.',
                'date' => Carbon::now()->addDays(15)->format('Y-m-d H:i:s'),
                'duree' => 5,
                'room' => 'Room F',
                'formateur_id' => 2,
                'team_id' => 4, // DevOps Team
                'status' => 'scheduled'
            ],
            [
                'name' => 'Test Automation with Cypress',
                'description' => 'End-to-end testing with Cypress, test strategies, and CI/CD integration.',
                'date' => Carbon::now()->addDays(20)->format('Y-m-d H:i:s'),
                'duree' => 4,
                'room' => 'Room G',
                'formateur_id' => 2,
                'team_id' => 5, // QA Team
                'status' => 'scheduled'
            ]
        ];

        foreach ($formations as $formation) {
            Formation::create($formation);
        }
    }
}
