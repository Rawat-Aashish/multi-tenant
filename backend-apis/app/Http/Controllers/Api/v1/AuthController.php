<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\UserLoginRequest;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(UserLoginRequest $request)
    {
        $is_shop_owner = $request->is_shop_owner;
        if ($is_shop_owner) {
            $user = User::where('email', $request->email)->first();
        } else {
            $user = Customer::where('email', $request->email)->first();
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => __('auth.incorrect_password'),
                'status' => 0,
            ], 401);
        }

        return response()->json([
            'message' => __('auth.user_login'),
            'data' => $is_shop_owner ? $user->load('shop') : $user,
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
