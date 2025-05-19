<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // Generate token for the user
            $user = Auth::user();
            return response()->json([
                'token' => $user->createToken('YourAppName')->plainTextToken,
            ]);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }
}
