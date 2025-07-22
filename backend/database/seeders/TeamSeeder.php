<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Team;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = [
            [
                'name' => 'Development Team',
                'speciality' => 'Web Development',
                'description' => 'Team focused on web development using modern technologies like Angular, React, and Laravel.'
            ],
            [
                'name' => 'UI/UX Team',
                'speciality' => 'Design & User Experience',
                'description' => 'Team specialized in user interface design and user experience optimization.'
            ],
            [
                'name' => 'Security Team',
                'speciality' => 'Cybersecurity',
                'description' => 'Team responsible for application security, penetration testing, and security audits.'
            ],
            [
                'name' => 'DevOps Team',
                'speciality' => 'Infrastructure & Deployment',
                'description' => 'Team managing infrastructure, CI/CD pipelines, and deployment processes.'
            ],
            [
                'name' => 'QA Team',
                'speciality' => 'Quality Assurance',
                'description' => 'Team focused on testing, quality assurance, and test automation.'
            ]
        ];

        foreach ($teams as $team) {
            Team::create($team);
        }
    }
}
