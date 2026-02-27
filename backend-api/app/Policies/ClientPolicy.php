<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Client;
use App\Enums\UserRole;

class ClientPolicy
{
    /**
     * Only SuperAdmin can create company
     */
    public function create(User $user): bool
    {
    	return $user->role === UserRole::SUPERADMIN->value;
    }
    
    public function viewAny(User $user)
    {
    	return in_array($user->role, [UserRole::SUPERADMIN->value]);
    }
}
