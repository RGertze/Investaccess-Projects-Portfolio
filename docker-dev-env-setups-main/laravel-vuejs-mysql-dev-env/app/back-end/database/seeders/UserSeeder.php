<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert(
            [
                [
                    'id' => 1,
                    'email' => 'email1@gmail.com',
                    'password' => Hash::make('password1'),
                ],
                [
                    'id' => 2,
                    'email' => 'email2@gmail.com',
                    'password' => Hash::make('password2'),
                ],
                [
                    'id' => 3,
                    'email' => 'email3@gmail.com',
                    'password' => Hash::make('password3'),
                ],
            ]
        );
    }
}
