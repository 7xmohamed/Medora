<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Http\Requests\ContactRequest;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use App\Models\Notification;

class ContactController extends Controller
{
    public function store(ContactRequest $request): JsonResponse
    {
        try {
            $message = ContactMessage::create($request->validated());

            // Create notification for admin users
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => 'contact_message',
                    'message' => "New contact message from {$request->name}",
                    'data' => ['message_id' => $message->id]
                ]);
            }

            return response()->json([
                'message' => 'Thank you for your message! We will get back to you soon.',
                'data' => $message
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send message. Please try again later.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function show(string $id)
    {
        //
    }
}
