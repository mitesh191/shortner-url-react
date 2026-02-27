<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
	{
		if (!Auth::attempt($request->only('email','password')))
			return response()->error(trans('messages.invalid-credentials'), 401);
	
		$user = Auth::user();
		$token = $user->createToken('token')->plainTextToken;
	
		return response()->success([
		    'user' => $user,
		    'token' => $token
		]);
	}
	
	public function logout(Request $request)
	{
		$request->session()->invalidate();
		$request->session()->regenerateToken();
		$request->user()->tokens()->delete();
		return response()->json(['message'=>trans('messages.logged-out')]);
	}
}
