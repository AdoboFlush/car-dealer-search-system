<?php

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

if (!function_exists("isValidTimestamp")) {
    function isValidTimestamp($timestamp)
    {
        return ((string) (int) $timestamp === $timestamp)
            && ($timestamp <= PHP_INT_MAX)
            && ($timestamp >= ~PHP_INT_MAX);
    }
}

if (!function_exists("convertDimensionKeyToCamel")) {
    function convertDimensionKeyToCamel(array|Collection|EloquentCollection $parameters): array
    {
        $new_payload = [];

        if (!empty($parameters)) {
            foreach ($parameters as $key => $value) {
                $new_payload[Str::camel($key)] = is_array($value)
                    || is_a($value, "Illuminate\Support\Collection")
                    || is_a($value, "Illuminate\Database\Eloquent\Collection")
                    ? convertDimensionKeyToCamel($value)
                    : $value;
            }
        }

        return $new_payload;
    }
}

if (!function_exists("isAgentMobile")) {
    function isAgentMobile(string $agent): bool
    {
        return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $agent);
    }
}

if (!function_exists("timeDifference")) {
    function timeDifference(Carbon $from, Carbon $to): string
    {
        $duration_value = "";

        $weeks = $to->diffInWeeks($from);
        $days = $to->diffInDays($from);
        $hours = $to->diffInHours($from);
        $minutes = $to->diffInMinutes($from);
        $seconds = $to->diffInSeconds($from);

        if ($weeks > 0) {
            $excess_days = $days % 7;

            $duration_value .= "{$weeks}w ";
            if ($excess_days > 0) {
                $duration_value .= "{$excess_days}d ";
            }
        } else if ($days > 0) {
            $excess_hours = $hours % 24;

            $duration_value .= "{$days}d ";
            if ($excess_hours > 0) {
                $duration_value .= "{$excess_hours}h ";
            }
        } else if ($hours > 0) {
            $excess_minutes = $minutes % 60;

            $duration_value .= "{$hours}h ";
            if ($excess_minutes > 0) {
                $duration_value .= "{$excess_minutes}m ";
            }
        } else if ($minutes > 0) {
            $excess_seconds = $seconds % 60;

            $duration_value .= "{$minutes}m ";
            if ($excess_seconds > 0) {
                $duration_value .= "{$excess_seconds}s";
            }
        } else {
            $duration_value .= "{$seconds}s";
        }

        return $duration_value;
    }
}
