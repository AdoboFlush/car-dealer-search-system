<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CheckRestrictions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $settings = Setting::get();
        Log::info($settings);
        foreach ($settings as $setting) {
           switch ($setting->key) {
                case 'is_maintenance':
                    Log::info($setting);
                    if ($setting->value == 1) {
                        return redirect()->route('maintenance');
                    }
                break;
                case 'is_coming_soon':
                    if ($setting->value == 1) {
                        return redirect()->route('restricted-access');
                    }
                break;
                case 'whitelisted_ips':
                    if(!empty($setting->value)) {
                        $ips = explode(',', $setting->value);
                        if (!in_array($request->ip(), $ips)) {
                            return redirect()->route('restricted-access');
                        }
                    }
                break;
                case 'blacklisted_ips':
                    if(!empty($setting->value)) {
                        $ips = explode(',', $setting->value);
                        if (in_array($request->ip(), $ips)) {
                            return redirect()->route('restricted-access');
                        }
                    }
                break;
                default:
           }
        }

        return $next($request);
    }
}
