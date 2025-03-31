<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class SettingsController extends Controller
{
    public function index(Request $request): Response
    {
        $settings = [];
        $settings_raw = Setting::get();
        foreach($settings_raw as $setting) {
            $settings[$setting->key] = $setting->value; 
        }
        return Inertia::render('Settings/Index', ["settings" => $settings]);
    }

    public function update(Request $request): RedirectResponse
    {
        $settings = $request->input('settings');
        foreach ($settings as $key => $value) {
            Setting::updateOrCreate([
                'key' => Str::snake($key),
            ], [
                'value' => $value,
            ]);
        }
        return back();
    }
}
