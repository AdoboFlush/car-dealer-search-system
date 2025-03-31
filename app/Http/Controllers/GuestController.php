<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Car;
use App\Http\Resources\CarResource;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class GuestController extends Controller
{
    public function getCars(Request $request)
    {
        $car = Car::with(["scraperProcess"])
            ->when($request->search, fn($q) => $q->where("title", "LIKE", "%{$request->search}%"))
            ->when($request->title, fn($q) => $q->where("title", "LIKE", "%{$request->title}%"))
            ->when($request->brand, fn($q) => $q->where("brand", $request->brand))
            ->when($request->model, fn($q) => $q->where("model", $request->model))
            ->when($request->type, fn($q) => $q->where("type", $request->type))
            ->when($request->is_featured, fn($q) => $q->where("is_featured", $request->is_featured))
            ->whereHas("scraperProcess", fn($q) => $q->where("is_published", 1));
        
        return CarResource::collection($request->has("per_page") ? $car->paginate($request->per_page) : $car->get());
    }
}
