<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tasks')->insert(
            [
                [
                    'id' => 1,
                    'user_id' => 1,
                    'title' => 'title1',
                    'description' => 'description1',
                    'position' => 1,
                ],
                [
                    'id' => 2,
                    'user_id' => 1,
                    'title' => 'title2',
                    'description' => 'description2',
                    'position' => 2,
                ],
                [
                    'id' => 3,
                    'user_id' => 1,
                    'title' => 'title3',
                    'description' => 'description3',
                    'position' => 3,
                ]
            ]
        );
    }
}
