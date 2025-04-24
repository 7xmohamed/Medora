<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_user_can_register_as_patient()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test Patient',
            'email' => 'patient@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'patient',
            'phone' => '1234567890',
            'address' => 'Test Address',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'role'],
                'token'
            ]);
        
        $this->assertDatabaseHas('users', [
            'email' => 'patient@example.com',
            'role' => 'patient'
        ]);
    }

    public function test_user_can_register_as_doctor()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test Doctor',
            'email' => 'doctor@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'doctor',
            'phone' => '1234567890',
            'address' => 'Test Address',
            'niom' => '12345',
            'id_card_front' => UploadedFile::fake()->image('id_front.jpg'),
            'id_card_back' => UploadedFile::fake()->image('id_back.jpg'),
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', [
            'email' => 'doctor@example.com',
            'role' => 'doctor',
            'niom' => '12345'
        ]);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user',
                'token'
            ]);
    }

    public function test_user_cannot_access_protected_route_without_token()
    {
        $response = $this->getJson('/api/user');
        $response->assertStatus(401);
    }

    public function test_user_can_access_protected_route_with_token()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson($user->toArray());
    }

    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/logout');

        $response->assertStatus(200);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_role_middleware()
    {
        $doctor = User::factory()->create(['role' => 'doctor']);
        $patient = User::factory()->create(['role' => 'patient']);

        $doctorToken = $doctor->createToken('test-token')->plainTextToken;
        $patientToken = $patient->createToken('test-token')->plainTextToken;

        // Test doctor route access
        $this->withHeader('Authorization', 'Bearer ' . $doctorToken)
            ->getJson('/api/doctor/dashboard')
            ->assertStatus(200);

        // Test patient cannot access doctor routes
        $this->withHeader('Authorization', 'Bearer ' . $patientToken)
            ->getJson('/api/doctor/dashboard')
            ->assertStatus(403);
    }
}
