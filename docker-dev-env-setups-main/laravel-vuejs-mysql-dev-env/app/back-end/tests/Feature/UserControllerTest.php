<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Register user successfully.
     */
    public function test_register_user_successful(): void
    {
        $response = $this->post('/api/auth/register', [
            'email' => 'email@email.com',
            'password' => 'password'
        ]);

        $response->assertStatus(201);
    }

    /**
     * Register user failed, already registered.
     */
    public function test_register_user_failed_already_registered(): void
    {
        $response = $this->post('/api/auth/register', [
            'email' => 'email1@gmail.com',
            'password' => 'password1'
        ]);

        $response->assertStatus(409);
    }

    /**
     * Register user failed, empty values.
     */
    public function test_register_user_failed_empty_values(): void
    {
        $response = $this->post('/api/auth/register', [
            'email' => '',
            'password' => ''
        ]);

        $response->assertStatus(400);
    }

    /**
     * Login user successfully.
     */
    public function test_login_user_successful(): void
    {
        $response = $this->post('/api/auth/login', [
            'email' => 'email1@gmail.com',
            'password' => 'password1'
        ]);

        $response->assertStatus(200);
    }

    /**
     * Login user failed, empty values.
     */
    public function test_login_user_failed_empty_values(): void
    {
        $response = $this->post('/api/auth/login', [
            'email' => '',
            'password' => ''
        ]);

        $response->assertStatus(400);
    }

    /**
     * Login user failed, user not found.
     */
    public function test_login_user_failed_user_not_found(): void
    {
        $response = $this->post('/api/auth/login', [
            'email' => 'emm@gmail.com',
            'password' => 'password1'
        ]);

        $response->assertStatus(404);
    }

    /**
     * Login user failed, incorrect password.
     */
    public function test_login_user_failed_incorrect_password(): void
    {
        $response = $this->post('/api/auth/login', [
            'email' => 'email1@gmail.com',
            'password' => 'password2'
        ]);

        $response->assertStatus(400);
    }
}
