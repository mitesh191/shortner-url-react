<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPERADMIN = 'SuperAdmin';
    case ADMIN = 'Admin';
    case MEMBER = 'Member';
}
