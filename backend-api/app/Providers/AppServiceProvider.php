<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Gate;
use App\Models\Client;
use App\Policies\ClientPolicy;
use App\Models\User;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Response;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    	Schema::defaultStringLength(191);
    	Gate::policy(Client::class, ClientPolicy::class);
    	Gate::policy(User::class, UserPolicy::class);
    	Response::macro('success', function (
    			mixed $data = [],
    			string $message = null,
    			int $code = 200
    	) {
    		return response()->json([
    				'status'  => true,
    				'message' => $message,
    				'data'    => $data,
    		], $code);
    	});
    	
    	Response::macro('error', function (
    			string $message = null,
    			int $code = 400,
    			mixed $errors = []
    	) {
    		return response()->json([
    				'status'  => false,
    				'message' => $message,
    				'errors'  => $errors,
    		], $code);
    	});
    }
}
