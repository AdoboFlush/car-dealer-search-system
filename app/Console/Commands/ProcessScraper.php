<?php

namespace App\Console\Commands;

use App\Enums\ScraperStatus;
use App\Models\ScraperProcess;
use Illuminate\Console\Command;

class ProcessScraper extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-scrapers {scraper_name?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $scraper_name = $this->argument("scraper_name");
        $scraper_process = ScraperProcess::where("status", ScraperStatus::Pending);
        if($scraper_name) {
            $scraper_process->where("scraper_name", $scraper_name);
        }
        $instances = $scraper_process->get();
        if($instances) {
            $instances->map(function ($instance) {
                (new $instance->scraper_class)->setScraperInstance($instance)->process();
            });
        }
    }
}
