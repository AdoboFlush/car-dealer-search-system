<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $permissions = $user
            ? $user->getPermissionsViaRoles()->pluck("name")
            : [];
        return [
            ...parent::share($request),
            'auth' => [
                'user' => collect($user)->keyToCamel(),
                'permissions' => $permissions,
            ],
            "response" => session("response"),
            "ziggy" => function () use ($request) {
                return array_merge((new Ziggy())->toArray(), [
                    "location" => $request->url(),
                ]);
            },
        ];
    }
}
