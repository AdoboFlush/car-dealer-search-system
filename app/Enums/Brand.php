<?php

namespace App\Enums;

use App\Traits\EnumValues;

enum Brand: string
{
    use EnumValues;

    case Toyota = "toyota";
    case Honda = "honda";
    case Suzuki = "suzuki";
    case Isuzu = "isuzu";
    case Mitsubishi = "mitsubishi";
    case Mazda = "mazda";
    case Ford = "ford";
    case Chevrolet = "chevrolet";
    case Geely = "geely";
    case MG5 = "mg5";
    case Chery = "chery";
    case Kia = "kia";
    case Hyundai = "hyundai";
    case Subaru = "subaru";
    case Nissan = "nissan";
}
