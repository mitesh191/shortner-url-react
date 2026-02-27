<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\User;
use App\Models\ShortUrl;
use App\Enums\UserRole;

class DashboardController extends Controller
{
	public function index(Request $request)
    {
    	$user = auth()->user();
    	
    	$totalClients = 0;
    	$totalMembers = 0;
    	$totalShortUrls = 0;
    	
    	if ($user->role === UserRole::SUPERADMIN->value) {
    		$totalClients = Client::count();
    		$totalMembers = User::where('role', UserRole::MEMBER->value)->count();
    		$totalShortUrls = ShortUrl::count();
    	}
    	
    	if ($user->role === UserRole::ADMIN->value) {
    		$totalMembers = User::where('role', UserRole::MEMBER->value)->where('client_id', $user->client_id)->count();
    		$totalShortUrls = ShortUrl::where('client_id', $user->client_id)->count();
    	}
    	
    	if ($user->role === UserRole::MEMBER->value) {
    		$totalShortUrls = ShortUrl::where('user_id', $user->id)->count();
    	}
    	
    	$last7Days = ShortUrl::selectRaw('DATE(created_at) as date, COUNT(*) as count')
	    	->where('created_at', '>=', now()->subDays(6))
	    	->groupBy('date')
	    	->orderBy('date')
	    	->get();
    	
    	return response()->json([
    			'total_clients' => $totalClients,
    			'total_members' => $totalMembers,
    			'total_short_urls' => $totalShortUrls,
    			'last_7_days' => $last7Days
    	]);
    }
}
