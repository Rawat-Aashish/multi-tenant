<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\UserLoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(UserLoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => __('auth.incorrect_password'),
                'status' => 0,
            ], 401);
        }

        return response()->json([
            'message' => __('auth.user_login'),
            'data' => $user->load('shop'),
            'token' => $user->createToken($request->header('User-Agent') ?? $request->ip())->plainTextToken,
            'status' => 1
        ], 200);
    }

    public function logout()
    {
        $user = Auth::user();

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => __("messages.logout_successful"),
            'status' => 1
        ], 200);
    }
}
