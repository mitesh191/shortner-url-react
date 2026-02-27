<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\User;
use App\Models\ShortUrl;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Enums\UserRole;
use App\Http\Resources\ClientResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ClientController extends Controller
{
	use AuthorizesRequests;
	public function __construct()
	{
		$this->moduleName = trans('messages.client');
	}
	
	public function index(Request $request)
	{
		$this->authorize('viewAny', Client::class);
		$validated = $request->validate([
				'search' => 'nullable|string|max:255',
				'page'   => 'nullable|integer|min:1'
		]);
		 
		$search = $validated['search'] ?? null;
		 
		$query = Client::with('firstUser')
			->withCount(['users', 'shortUrls']);
		 
		if (!empty($search)) {
			$query->where(function ($q) use ($search) {
				$q->where('name', 'like', '%' . addcslashes($search, '%_') . '%');
			});
		}
		
		$users = $query->latest()->paginate(10);
		 
		return ClientResource::collection($users);
	}
	
	public function store(Request $request)
    {
    	$this->authorize('create', Client::class);
    	
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
        ]);
        
		DB::beginTransaction();

        try {
			$client = Client::create([
                'name' => $validated['name'],
            ]);
			
			$user = User::create([
                'client_id' => $client->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make(config('constants.DEFAULT_ADMIN_PASSWORD')),
                'role' => UserRole::ADMIN,
            ]);

            DB::commit();
			return response()->success(
			    ['client' => $client->id],
			    trans('messages.success-added' , ['module' => $this->moduleName]),
			    config('constants.CREATE_RECORD_STATUS_CODE')
			);

        } catch (\Exception $e) {
        	DB::rollBack();
			return response()->error(
					trans('messages.error-added' , ['module' => $this->moduleName]),
					config('constants.SYSTEM_ERROR_STATUS_CODE'),
					['error' => $e->getMessage()]
				);
		}
    }
    
    public function dashboard(Request $request)
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
