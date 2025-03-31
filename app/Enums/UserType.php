<?php

namespace App\Enums;

use App\Traits\EnumValues;

enum UserType: string
{
    use EnumValues;

    case Admin = "admin";
    case Guest = "guest";
}
