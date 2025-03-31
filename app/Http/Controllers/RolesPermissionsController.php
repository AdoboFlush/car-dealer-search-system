<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Http\Resources\AnonymousResource;
use App\Http\Resources\RolesResource;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesPermissionsController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('RolesPermissions/Index');
    }

    public function fetchRoles(Request $request): Paginator|Collection|RolesResource
    {
        $roles_permissions = Role::with(["permissions"])->orderBy("id");

        return $request->resource_response
            ? RolesResource::collection($roles_permissions->get())
            : match (true) {
                $request->has("per_page") => $roles_permissions->paginate($request->per_page),
                default => $roles_permissions->get(),
            };
    }

    public function fetchRolePermissions(Role $role): AnonymousResource
    {
        $roles_permissions = Permission::whereHas("roles", fn ($q) => $q->where("name", $role->name))
            ->get();

        return new AnonymousResource($roles_permissions);
    }

    public function syncRolePermissions(Request $request, Role $role): RedirectResponse
    {
        $role->syncPermissions($request->permissions);

        return back();
    }
}
