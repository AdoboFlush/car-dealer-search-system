<?php

namespace App\Enums;

use App\Traits\EnumValues;

enum ScraperStatus: string
{
    use EnumValues;

    case Completed = "completed";
    case Pending = "pending";
    case Processing = "processing";
    case Failed = "failed";
    case Canceled = "canceled";
}
