<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RolesPermissionsController;
use App\Http\Controllers\ScraperProcessController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {

    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('get', [DashboardController::class, 'getDashboardStats'])->name('dashboard.get');
        Route::get('cars-by-month', [DashboardController::class, 'getCarsByMonth'])->name('dashboard.cars-by-month');
        Route::get('cars-by-scraper', [DashboardController::class, 'getCarsByScraper'])->name('dashboard.cars-by-scraper');
    });

    Route::middleware(["can:user_view"])->prefix("users")->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('users');
        Route::get('get', [UserController::class, 'get'])->name('users.get');
        Route::get("create", [UserController::class, 'create'])->middleware(["can:user_create"])->name('user.create');
        Route::post("store", [UserController::class, 'store'])->middleware(["can:user_create"])->name('user.store');
        Route::post("update-multiple", [UserController::class, 'updateMultiple'])->middleware(["can:user_update"])->name('users.update-multiple');
        Route::put("sync-role-multiple", [UserController::class, 'syncRoleMultiple'])->middleware(["can:user_update"])->name('users.sync-role-multiple');
        Route::prefix("{user}")->group(function () {
            Route::get("show", [UserController::class, 'show'])->name('user.show');
            Route::get("edit", [UserController::class, 'edit'])->middleware(["can:user_update"])->name('user.edit');
            Route::put("update", [UserController::class, 'update'])->middleware(["can:user_update"])->name('user.update');
            Route::delete("delete", [UserController::class, 'delete'])->middleware(["can:user_delete"])->name('user.delete');
        });
    });

    Route::middleware(["can:scraper_process_view"])->prefix("scraper-processes")->group(function () {
        Route::get('/', [ScraperProcessController::class, 'index'])->name('scraper-processes');
        Route::get('get', [ScraperProcessController::class, 'get'])->name('scraper-processes.get');
        Route::post("create-instance", [ScraperProcessController::class, 'createInstance'])->middleware(["can:scraper_process_create"])->name('scraper-processes.create-instance');
        Route::prefix("{scraper_process}")->middleware(["can:scraper_process_update"])->group(function () {
            Route::put("retry", [ScraperProcessController::class, 'retry'])->name('scraper-processes.retry');
            Route::put("publish", [ScraperProcessController::class, 'publish'])->name('scraper-processes.publish');
        });
    });

    Route::middleware(["can:car_view"])->prefix("cars")->group(function () {
        Route::get('/', [CarController::class, 'index'])->name('cars');
        Route::get('get', [CarController::class, 'get'])->name('cars.get');
        Route::post("update-multiple", [CarController::class, 'updateMultiple'])->middleware(["can:car_update"])->name('cars.update-multiple');
        Route::get("create", [CarController::class, 'create'])->middleware(["can:car_update"])->name('cars.create');
        Route::post("store", [CarController::class, 'store'])->middleware(["can:car_update"])->name('cars.store');
        Route::prefix("{car}")->middleware(["can:car_update"])->group(function () {
            Route::get("edit", [CarController::class, 'edit'])->name('cars.edit');
            Route::put("update", [CarController::class, 'update'])->name('cars.update');
        });
    });

    Route::prefix("profile")->group(function () {
        Route::get('view', [ProfileController::class, 'index'])->name('profile.view');
        Route::post('update', [ProfileController::class, 'update'])->name('profile.update');
        Route::post("password/change", [ProfileController::class, "changePassword"])
            ->name("profile.password.change");
    });

    Route::prefix("roles-permissions")->middleware(["can:permission_view"])->group(function () {
        Route::get('/', [RolesPermissionsController::class, 'index'])->name('roles-permissions');
        Route::get('roles', [RolesPermissionsController::class, 'fetchRoles'])->name('roles-permissions.roles');
        Route::prefix("{role}")->group(function () {
            Route::get('role-permissions', [RolesPermissionsController::class, 'fetchRolePermissions'])->name('roles-permissions.permissions');
            Route::post('sync-permissions', [RolesPermissionsController::class, 'syncRolePermissions'])->middleware(["can:permission_update"])->name('roles-permissions.sync');
        });
    });

    Route::prefix("activity-logs")->middleware(["can:activity_log_view"])->group(function () {
        Route::get('/', [ActivityLogController::class, 'index'])->name('activity-logs');
        Route::get('get', [ActivityLogController::class, 'get'])->name('activity-logs.get');
    });

    Route::prefix("settings")->middleware(["can:settings_view"])->group(function () {
        Route::get('/', [SettingsController::class, 'index'])->name('settings');
        Route::post('update', [SettingsController::class, 'update'])->middleware(["can:settings_update"])->name('settings.update');
    });

    Route::prefix("blogs")->group(function () {
        Route::get('/', [BlogController::class, 'index'])->name('blogs');

        Route::post("update-multiple-posts", [BlogController::class, 'updateMultiplePosts'])->name('blogs.update-multiple-posts');
        Route::post("update-multiple-comments", [BlogController::class, 'updateMultipleComments'])->name('blogs.update-multiple-comments');

        Route::prefix("posts")->middleware(["can:post_view"])->group(function () {
            Route::get('get', [BlogController::class, 'getPosts'])->name('blogs.posts.get');
            Route::get('create', [BlogController::class, 'createPost'])->middleware(["can:post_create"])->name('blogs.posts.create');
            Route::post('store', [BlogController::class, 'storePost'])->middleware(["can:post_create"])->name('blogs.posts.store');

            Route::prefix("{post}")->group(function () {
                Route::get('show', [BlogController::class, 'showPost'])->name('blogs.posts.show');
                Route::get('edit', [BlogController::class, 'editPost'])->middleware(["can:post_update"])->name('blogs.posts.edit');
                Route::post('update', [BlogController::class, 'updatePost'])->middleware(["can:post_update"])->name('blogs.posts.update');

                Route::prefix("comments")->middleware(["can:comment_view"])->group(function () {
                    Route::get('get', [BlogController::class, 'getPostComments'])->name('blogs.posts.comments.get');
                    Route::get('create', [BlogController::class, 'createComment'])->middleware(["can:comment_create"])->name('blogs.posts.comments.create');
                    Route::post('store', [BlogController::class, 'storeComment'])->middleware(["can:comment_store"])->name('blogs.posts.comments.store');
                    Route::prefix("{comment}")->group(function () {
                        Route::get('edit', [BlogController::class, 'editComment'])->middleware(["can:comment_update"])->name('blogs.posts.comments.edit');
                        Route::put('update', [BlogController::class, 'updateComment'])->middleware(["can:comment_update"])->name('blogs.posts.comments.update');
                    });
                });
            });
        });
        Route::prefix("comments")->middleware(["can:comment_view"])->group(function () {
            Route::get('/', [BlogController::class, 'getComments'])->name('blogs.comments.get');
        });
    });
});

// public routes

Route::middleware(['check-restrictions'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome');
    })->name('home');
    Route::get('browse-cars', function () {
        return Inertia::render('BrowseCars');
    })->name('browse-cars');
});

Route::get('/maintenance', function () {
    return Inertia::render('Maintenance');
})->name('maintenance');

Route::get('/restricted-access', function () {
    return Inertia::render('RestrictedAccess');
})->name('restricted-access');


Route::prefix("guest")->group(function () {
    Route::prefix("cars")->group(function () {
        Route::get('get', [GuestController::class, 'getCars'])->name('guest.cars.get');
    });
    
    Route::prefix("blogs")->group(function () {
        Route::prefix("posts")->group(function () {
            Route::get('get', [BlogController::class, 'getPosts'])->name('guest.blogs.posts.get');
            Route::prefix("{post}")->group(function () {
                Route::prefix("comments")->group(function () {
                    Route::get('get', [BlogController::class, 'getPostComments'])->name('guest.blogs.posts.comments.get');
                });
            });
        });
    });
});


require __DIR__ . '/auth.php';
