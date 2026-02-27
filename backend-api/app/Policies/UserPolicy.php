<?php

namespace App\Policies;

use App\Models\User;
use App\Enums\UserRole;

class UserPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    
    public function create(User $authUser): bool
    {
    	return $authUser->role === UserRole::ADMIN->value;
    }
}
