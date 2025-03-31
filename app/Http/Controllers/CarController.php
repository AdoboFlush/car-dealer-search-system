<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Car;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class CarController extends Controller
{
    public function index()
    {
        return Inertia::render('Car/Index');
    }

    public function get(Request $request)
    {
        $car = Car::with(["scraperProcess"])
            ->when($request->title, fn($q) => $q->where("title", "LIKE", "%{$request->title}%"))
            ->when($request->brand, fn($q) => $q->where("brand", $request->brand))
            ->when($request->model, fn($q) => $q->where("model", $request->model))
            ->when($request->type, fn($q) => $q->where("type", $request->type))
            ->when($request->is_featured, fn($q) => $q->where("is_featured", $request->is_featured))
            ->when($request->is_published, fn($q) => $q->whereRelation("scraperProcess", "is_published", $request->is_published))
            ->when($request->scraper_process_id, fn($q) => $q->where("scraper_process_id", $request->scraper_process_id))
            ->when($request->scraper_name, fn($q) => $q->whereRelation("scraperProcess", "scraper_name", $request->scraper_name));

        return $request->has("per_page") ? $car->paginate($request->per_page) : $car->get();
    }

    public function updateMultiple(Request $request): RedirectResponse
    {
        $allowable_update_fields = ["is_featured"];
        if (is_array($request->ids) && in_array($request->field, $allowable_update_fields)) {
            foreach ($request->ids as $id) {
                $user = Car::find($id);
                if ($user) {
                    $user->update([$request->field => $request->value]);
                }
            }
        }
        return back();
    }

    public function edit()
    {
        // ...existing code...
    }

    public function update(Request $request, $id)
    {
        // ...existing code...
    }

    public function create(Request $request)
    {
        // ...existing code...
    }

    public function delete($id)
    {
        // ...existing code...
    }
}
