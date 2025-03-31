<?php

namespace App\Http\Controllers;

use App\Enums\Dealer;
use App\Enums\ScraperStatus;
use App\Models\ScraperProcess;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScraperProcessController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Scraper/Index');
    }

    public function get(Request $request)
    {
        $scraperProcess = ScraperProcess::with(["cars"])
            ->when($request->scraper_name, fn($q) => $q->where("scraper_name", "LIKE", "%{$request->scraper_name}%"))
            ->when($request->status, fn($q) => $q->where("status", $request->status))
            ->when($request->starts_at, fn($q) => $q->where("starts_at", $request->starts_at))
            ->when($request->ends_at, fn($q) => $q->where("ends_at", $request->ends_at))
            ->when($request->is_published, fn($q) => $q->where("is_published", $request->is_published));
        return $request->has("per_page") ? $scraperProcess->paginate($request->per_page) : $scraperProcess->get();
    }

    public function createInstance(Request $request)
    {
        switch ($request->scraper_name) {
            case Dealer::CarEmpire->value:
                $scraper = Dealer::CarEmpire->scraperClass();
                break;
            case Dealer::DashcarrPro->value:
                $scraper = Dealer::DashcarrPro->scraperClass();
                break;
            case Dealer::ManilaAutoDisplay->value:
                $scraper = Dealer::ManilaAutoDisplay->scraperClass();
                break;
            default:
                $scraper = null;
        }
        if ($scraper) {
            ScraperProcess::create([
                "scraper_name" => $request->scraper_name,
                "scraper_class" => $scraper,
                "status" => ScraperStatus::Pending,
            ]);
        }
    }

    public function publish(ScraperProcess $scraper_process, Request $request)
    {
        if ($scraper_process->status->is([
            ScraperStatus::Completed,
        ])) {
            // disable all other published scrapers
            ScraperProcess::where("scraper_name", $scraper_process->scraper_name)
                ->where("id", "<>", $scraper_process->id)
                ->update(["is_published" => false]);

            $scraper_process->is_published = $request->to_publish;
            $scraper_process->save();
        }
    }

    public function retry(ScraperProcess $scraper_process)
    {
        if ($scraper_process->status->is([
            ScraperStatus::Failed,
            ScraperStatus::Canceled
        ])) {
            $scraper_process->cars()->delete(); // clear existing inserted car data.
            $scraper_process->current_records_scraped = 0;
            $scraper_process->status = ScraperStatus::Pending;
            $scraper_process->starts_at = Carbon::now();
            $scraper_process->ends_at = null;
            $scraper_process->retry_count = intval($scraper_process->retry_count) + 1;
            $scraper_process->save();
        }
    }
}
