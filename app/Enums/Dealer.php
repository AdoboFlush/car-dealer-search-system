<?php

namespace App\Enums;

use App\Traits\EnumValues;

enum Dealer: string
{
    use EnumValues;

    case DashcarrPro = "dashcarr_pro";
    case ManilaAutoDisplay = "manila_auto_display";
    case CarEmpire = "car_empire";

    public function scraperClass()
    {
        return match($this) {
            self::DashcarrPro => \App\Integrations\Scrapers\DashcarrProScraper::class,
            self::ManilaAutoDisplay => \App\Integrations\Scrapers\ManilaAutoDisplayScraper::class,
            self::CarEmpire => \App\Integrations\Scrapers\CarEmpireScraper::class,
            default => null,
        };
    }

    public function website()
    {
        return match($this) {
            self::DashcarrPro => "https://dashcarrpro.com/",
            self::ManilaAutoDisplay => "https://www.manilaautodisplay.com/",
            self::CarEmpire => "https://carempireph.com/",
            default => null,
        };
    }
}
