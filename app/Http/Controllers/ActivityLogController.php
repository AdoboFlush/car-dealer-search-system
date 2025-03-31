<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('ActivityLog/Index');
    }

    public function get(Request $request)
    {
        $activity = Activity::with(["causer"])
            ->when($request->log_name, fn($q) => $q->where("log_name", "LIKE", "%{$request->log_name}%"))
            ->when($request->description, fn($q) => $q->where("description", "LIKE", "%{$request->description}%"))
            ->when($request->subject_id, fn($q) => $q->where("subject_id", $request->subject_id))
            ->when($request->subject_type, fn($q) => $q->where("subject_type", $request->subject_type))
            ->when($request->causer_id, fn($q) => $q->where("causer_id", $request->causer_id))
            ->when($request->causer_type, fn($q) => $q->where("causer_type", $request->causer_type))
            ->when($request->properties, fn($q) => $q->where("properties", "LIKE", "%{$request->properties}%"))
            ->when($request->created_at, fn($q) => $q->where("created_at", $request->created_at))
            ->latest();
        return $request->has("per_page") ? $activity->paginate($request->per_page) : $activity->get();
    }

}
