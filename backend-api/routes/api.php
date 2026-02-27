<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\ShortUrlController;
use App\Http\Controllers\Api\DashboardController;

Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/clients', [ClientController::class, 'store']);
    Route::get('/clients', [ClientController::class, 'index']);
    
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::post('/members', [MemberController::class, 'store']);
    Route::get('/team-members', [MemberController::class, 'index']);

    Route::get('/short-urls', [ShortUrlController::class, 'index']);
    Route::post('/short-urls', [ShortUrlController::class, 'store']);
});