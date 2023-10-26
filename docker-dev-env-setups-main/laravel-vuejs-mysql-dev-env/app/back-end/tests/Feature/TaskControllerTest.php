<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Get all tasks for a user successfully.
     */
    public function test_get_all_tasks_for_user_successful(): void
    {
        $response = $this->get('/api/tasks/1');

        $response->assertStatus(200);
    }

    /**
     * Add a new task successfully.
     */
    public function test_add_new_task_successful(): void
    {
        $response = $this->post('/api/tasks', [
            'userId' => 1,
            'title' => 'title'
        ]);

        $response->assertStatus(201);
    }

    /**
     * Add a new task failed, user ID is required.
     */
    public function test_add_new_task_failed_user_id_is_required(): void
    {
        $response = $this->post('/api/tasks', [
            'userId' => '',
            'title' => 'title'
        ]);

        $response->assertStatus(400);
    }

    /**
     * Add a new task failed, title is required.
     */
    public function test_add_new_task_failed_title_is_required(): void
    {
        $response = $this->post('/api/tasks', [
            'userId' => 1,
            'title' => ''
        ]);

        $response->assertStatus(400);
    }

    /**
     * Add a new task failed, user not found.
     */
    public function test_add_new_task_failed_user_not_found(): void
    {
        $response = $this->post('/api/tasks', [
            'userId' => 999,
            'title' => 'title'
        ]);

        $response->assertStatus(404);
    }

    /**
     * Update a task successfully.
     */
    public function test_update_task_successful(): void
    {
        $response = $this->post('/api/tasks/1', [
            'title' => 'title',
            'completed' => true,
        ]);

        $response->assertStatus(200);
    }

    /**
     * Update a task failed, task not found.
     */
    public function test_update_task_failed_task_not_found(): void
    {
        $response = $this->post('/api/tasks/999', [
            'title' => 'title',
            'completed_at' => false,
            'position' => 3
        ]);

        $response->assertStatus(404);
    }

    /**
     * Update a task successfully, move task down.
     */
    public function test_update_task_successful_move_down(): void
    {
        $response = $this->post('/api/tasks/1', [
            'title' => 'title',
            'completed' => true,
            'position' => 3
        ]);

        $response = $this->get('/api/tasks/1');
        $tasks = json_decode($response->getContent(), true);

        $this->assertEquals(2, $tasks["data"][0]['id']);
        $this->assertEquals(1, $tasks["data"][0]['position']);
        $this->assertEquals(3, $tasks["data"][1]['id']);
        $this->assertEquals(2, $tasks["data"][1]['position']);
        $this->assertEquals(1, $tasks["data"][2]['id']);
        $this->assertEquals(3, $tasks["data"][2]['position']);

        $response->assertStatus(200);
    }

    /**
     * Update a task successfully, move task up.
     */
    public function test_update_task_successful_move_up(): void
    {
        $response = $this->post('/api/tasks/3', [
            'title' => 'title',
            'completed' => true,
            'position' => 1
        ]);

        $response = $this->get('/api/tasks/1');
        $tasks = json_decode($response->getContent(), true);

        $this->assertEquals(3, $tasks["data"][0]['id']);
        $this->assertEquals(1, $tasks["data"][0]['position']);
        $this->assertEquals(1, $tasks["data"][1]['id']);
        $this->assertEquals(2, $tasks["data"][1]['position']);
        $this->assertEquals(2, $tasks["data"][2]['id']);
        $this->assertEquals(3, $tasks["data"][2]['position']);

        $response->assertStatus(200);
    }

    /**
     * Delete a task successfully.
     */
    public function test_delete_task_successful(): void
    {
        $response = $this->delete('/api/tasks/2');

        $response->assertStatus(200);
    }

    /**
     * Delete a task failed, task not found.
     */
    public function test_delete_task_failed_task_not_found(): void
    {
        $response = $this->delete('/api/tasks/999');

        $response->assertStatus(404);
    }
}











