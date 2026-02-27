<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserResource;
use App\Enums\UserRole;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Log;

class MemberController extends Controller
{
	use AuthorizesRequests;
	public function __construct()
	{
		$this->moduleName = trans('messages.member');
	}
	
	public function store(Request $request)
    {
    	$this->authorize('create', User::class);
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
        	'role'  => 	[
        		'required',
        		Rule::in([
        				UserRole::ADMIN,
        				UserRole::MEMBER,
        		]),
        		],
        ]);

        DB::beginTransaction();

        try {
        	$authUser = $request->user();
            $user = User::create([
                'client_id' => $authUser->client_id,
                'name'       => $validated['name'],
                'email'      => $validated['email'],
                'password'   => Hash::make(config('constants.DEFAULT_MEMBER_PASSWORD')),
                'role'       => $validated['role'],
            ]);

            DB::commit();
			return response()->success(
            		['data' => $user],
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
    
    public function index(Request $request)
    {
    	$validated = $request->validate([
    			'search' => 'nullable|string|max:255',
    			'page'   => 'nullable|integer|min:1'
    	]);
    	
    	$search = $validated['search'] ?? null;
    	
    	$authUser = Auth::user();
    	
    	$query = User::query()->withCount('shortUrls');
    	
    	if ($authUser->role === UserRole::ADMIN->value) {
    		$query->where('client_id', $authUser->client_id);
    	}
    	
    	if (!empty($search)) {
    		$query->where(function ($q) use ($search) {
    			$q->where('name', 'like', '%' . addcslashes($search, '%_') . '%')
    			->orWhere('email', 'like', '%' . addcslashes($search, '%_') . '%');
    		});
    	}
    	
    	if ($authUser->role === UserRole::MEMBER->value) {
    		$query->where('id', $authUser->id);
    	}
    	
    	$users = $query->latest()->paginate(10);
    	
    	return UserResource::collection($users);
    }
}
