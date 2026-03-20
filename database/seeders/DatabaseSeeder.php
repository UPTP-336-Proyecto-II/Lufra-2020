<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        User::factory()->create([
            'name' => 'Trabajador Ejemplo',
            'email' => 'trabajador@example.com',
            'role' => 'trabajador',
            'password' => bcrypt('password'),
        ]);
        User::factory()->create([
            'name' => 'Administrativo Ejemplo',
            'email' => 'administrativo@example.com',
            'role' => 'administrativo',
            'password' => bcrypt('password'),
        ]);
        User::factory()->create([
            'name' => 'Superusuario Ejemplo',
            'email' => 'superusuario@example.com',
            'role' => 'superusuario',
            'password' => bcrypt('password'),
        ]);
    }
}
