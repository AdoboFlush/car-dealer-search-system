<?php

namespace App\Http\Controllers;

use App\Http\Resources\AnonymousResource;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Models\Car;
use App\Models\ScraperProcess;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard');
    }

    public function getDashboardStats(Request $request)
    {
        $currentYear = $request->has("year") ? $request->year : Carbon::now()->year;

        $total_cars = Car::whereYear('created_at', $currentYear)->count();
        $total_cars_published = Car::whereYear('created_at', $currentYear)
            ->whereRelation('scraperProcess', 'is_published', true)
            ->count();
        $total_scraper_instances = ScraperProcess::whereYear('created_at', $currentYear)->count();
        $featured_cars = Car::whereYear('created_at', $currentYear)
            ->where('is_featured', true)
            ->count();

        return new AnonymousResource([
            'total_cars_published' => $total_cars_published,
            'total_scraper_instances' => $total_scraper_instances,
            'featured_cars' => $featured_cars,
            'total_cars' => $total_cars,
        ]);
    }

    public function getCarsByMonth(Request $request)
    {
        $currentYear = $request->has("year") ? $request->year : Carbon::now()->year;

        $months = collect(range(1, 12))->map(function ($month) use ($currentYear) {
            return Carbon::create($currentYear, $month, 1)->format('Y-m');
        });

        $cars_by_month = Car::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->whereYear('created_at', $currentYear)
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->keyBy('month');

        $result = $months->map(function ($month) use ($cars_by_month) {
            return [
                'month' => Carbon::parse($month . '-01')->format('M Y'),
                'count' => $cars_by_month->get($month)->count ?? 0,
            ];
        });

        return new AnonymousResource($result);
    }

    public function getCarsByScraper(Request $request)
    {
        $currentYear = $request->has("year") ? $request->year : Carbon::now()->year;

        $cars_by_scraper = Car::selectRaw('scraper_processes.scraper_name as scraper_name, COUNT(cars.id) as count')
            ->join('scraper_processes', 'cars.scraper_process_id', '=', 'scraper_processes.id')
            ->whereYear('cars.created_at', $currentYear)
            ->groupBy('cars.scraper_process_id')
            ->get()
            ->map(function ($item) {
                return [
                    'scraper_name' => $item->scraper_name,
                    'count' => $item->count,
                ];
            });

        return new AnonymousResource($cars_by_scraper);
    }
}
