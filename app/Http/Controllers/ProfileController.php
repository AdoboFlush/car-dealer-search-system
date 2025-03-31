<?php

namespace App\Http\Controllers;

use App\Http\Requests\PasswordChangeRequest;
use App\Http\Requests\ProfileUpdateRequest;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('User/Profile');
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        if($request->first_name !== $request->user()->first_name) {
            $request->user()->first_name = $request->first_name;
        }

        if($request->last_name !== $request->user()->last_name) {
            $request->user()->last_name = $request->last_name;
        }

        if($request->middle_name !== $request->user()->middle_name) {
            $request->user()->middle_name = $request->middle_name;
        }

        if($request->suffix !== $request->user()->suffix) {
            $request->user()->suffix = $request->suffix;
        }

        if($request->birth_date !== $request->user()->birth_date) {
            $request->user()->birth_date = Carbon::parse($request->birth_date)->toDateString();
        }
        
        if($request->filled('profile_image')) {
            $request->user()->uploadImage($request->profile_image);
        }
        $request->user()->save();
        return back();
    }

    public function changePassword(PasswordChangeRequest $request): RedirectResponse
    {
        Auth::user()->update([
            "password" => Hash::make($request->password),
        ]);

        return back();
    }
}
