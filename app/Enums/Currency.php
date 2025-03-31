<?php

namespace App\Enums;

use App\Traits\EnumValues;

enum Currency: string
{
    use EnumValues;

    case PHP = "PHP";
    case USD = "USD";
}
