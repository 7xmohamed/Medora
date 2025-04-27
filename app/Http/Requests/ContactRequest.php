<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50|regex:/^[\p{L}\s\'-]+$/u',
            'email' => 'required|email:rfc,dns|max:100',
            'subject' => 'required|string|max:100',
            'message' => 'required|string|min:10|max:1000'
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'The name may only contain letters and basic punctuation',
            'email.email' => 'Please enter a valid email address',
            'subject.max' => 'Subject must not exceed 100 characters',
            'message.min' => 'Message must be at least 10 characters'
        ];
    }
}
