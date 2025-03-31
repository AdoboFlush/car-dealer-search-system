<?php

namespace App\Http\Controllers;

use App\Enums\UserType;
use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('User/Index');
    }

    public function get(Request $request): Paginator|LengthAwarePaginator|Collection
    {
        $user = User::with(["roles"])
            ->when($request->name, fn($q) => $q->where("name", "LIKE", "%{$request->name}%"))
            ->when($request->email, fn($q) => $q->where("email", "LIKE", "%{$request->email}%"))
            ->when($request->type, fn($q) => $q->where("type", $request->type))
            ->when($request->birth_date, fn($q) => $q->where("birth_date", $request->birth_date));
        return $request->has("per_page") ? $user->paginate($request->per_page) : $user->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserCreateRequest $request): RedirectResponse
    {
        $user = User::create([
            'email' => $request->email,
            'name' => $request->name,
            'password' => Hash::make($request->password),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'middle_name' => $request->middle_name,
            'suffix' => $request->suffix,
            'birth_date' => Carbon::parse($request->birth_date)->toDateString(),
            'type' => UserType::Admin->value,
        ]);
        $user->syncRoles($request->roles);
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        return Inertia::render('User/Show', ["user" => $user]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('User/Edit', ["user" => $user]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, User $user): RedirectResponse
    {
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->middle_name = $request->middle_name;
        $user->suffix = $request->suffix;
        $user->birth_date = Carbon::parse($request->birth_date)->toDateString();
        $user->syncRoles($request->roles);
        $user->save();

        return back();
    }

    /** 
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();
        return back();
    }


    public function destroyMultiple(Request $request): RedirectResponse
    {
        if (is_array($request->ids)) {
            foreach ($request->ids as $id) {
                $user = User::find($id);
                if ($user) {
                    $user->delete();
                }
            }
        }
        return back();
    }

    public function syncRoleMultiple(Request $request): RedirectResponse
    {
        if (is_array($request->ids)) {
            foreach ($request->ids as $id) {
                $user = User::find($id);
                if ($user) {
                    $user->syncRoles($request->roles);
                }
            }
        }
        return back();
    }

    public function updateMultiple(Request $request): RedirectResponse
    {
        $allowable_update_fields = ["is_blacklisted"];
        if (is_array($request->ids) && in_array($request->field, $allowable_update_fields)) {
            foreach ($request->ids as $id) {
                $user = User::find($id);
                if ($user) {
                    $user->update([$request->field => $request->value]);
                }
            }
        }
        return back();
    }
}
