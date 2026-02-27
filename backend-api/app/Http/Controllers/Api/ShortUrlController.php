<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ShortUrl;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ShortUrlResource;
use App\Enums\UserRole;

class ShortUrlController extends Controller
{
	public function __construct()
	{
		$this->moduleName = trans('messages.short-url');
	}
	
	public function store(Request $request)
	{
		$request->validate([
            'original_url' => 'required|url'
        ]);

        $user = Auth::user();

		if ($user->role === UserRole::SUPERADMIN->value) {
            return response()->json([
                'message' => trans('messages.superadmin-cant-create-urls')
            ], 403);
        }
		
		do {
            $shortCode = Str::random(6);
        } while (ShortUrl::where('short_code', $shortCode)->exists());

        $shortUrl = ShortUrl::create([
            'client_id'  => $user->client_id,
        	'user_id'     => $user->id,
            'original_url'=> $request->original_url,
            'short_code'  => $shortCode,
            'hits'        => 0,
        ]);

        return response()->success(
        		['data' => $user->client_id],
        		trans('messages.success-added' , ['module' => $this->moduleName]),
        		config('constants.CREATE_RECORD_STATUS_CODE')
        );
	}
	
	public function index(Request $request)
	{
		
		$validated = $request->validate([
				'search' => 'nullable|string|max:255',
				'filter' => 'nullable|in:today,week,month,last_month',
				'page'   => 'nullable|integer|min:1'
		]);
		
		$user = Auth::user();
		
		$search = $validated['search'] ?? null;
		$filter = $validated['filter'] ?? null;
		
		$query = ShortUrl::with('user:id,name');
		
		// Role restriction
		if ($user->role === UserRole::ADMIN->value) {
			$query->where('client_id', $user->client_id);
		} elseif ($user->role == UserRole::MEMBER->value) {
			$query->where('user_id', $user->id);
		}
		
		if (!empty($search)) {
			$query->where(function ($q) use ($search) {
				$q->where('original_url', 'like', '%' . addcslashes($search, '%_') . '%')
				->orWhere('short_code', 'like', '%' . addcslashes($search, '%_') . '%');
			});
		}
		
		if ($filter) {
			switch ($filter) {
				case 'today':
					$query->whereDate('created_at', now());
					break;
		
				case 'week':
					$query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
					break;
		
				case 'month':
					$query->whereMonth('created_at', now()->month)
					->whereYear('created_at', now()->year);
					break;
		
				case 'last_month':
					$query->whereMonth('created_at', now()->subMonth()->month)
					->whereYear('created_at', now()->subMonth()->year);
					break;
			}
		}
		
		return ShortUrlResource::collection(
				$query->latest()->paginate(10)
		);
	}
}
