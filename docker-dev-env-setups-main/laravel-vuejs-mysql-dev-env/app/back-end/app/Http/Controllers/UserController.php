<?php

namespace App\Http\Controllers;

use App\Models\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    /**
     * Login user
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        try {
            if (!$request->email || !$request->password) {
                return response()->json(
                    new ApiResponse(400, "Email and password are required"),
                    400
                );
            }

            $user = User::query()->where('email', $request->email)->first();

            if (!$user) {
                return response()->json(
                    new ApiResponse(401, "user not found"),
                    404
                );
            }

            if (Hash::check($request->password, $user->password) === false) {
                return response()->json(
                    new ApiResponse($user->id, "Incorrect password"),
                    400
                );
            }

            return response()->json(
                new ApiResponse($user->id, ""),
                200
            );
        } catch (\Exception $e) {
            report($e);
            return response()->json(
                new ApiResponse(500, "An error occurred"),
                500
            );
        }
    }

    /**
     * Register a new user
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        try {
            if (!$request->email || !$request->password) {
                return response()->json(
                    new ApiResponse(400, "Email and password are required"),
                    400
                );
            }

            $user = User::query()->where('email', $request->email)->first();

            if ($user) {
                return response()->json(
                    new ApiResponse(409, "User already exists"),
                    409
                );
            }

            $user = User::query()->create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return response()->json(
                new ApiResponse($user->id, ""),
                201
            );
        } catch (\Exception $e) {
            report($e);
            printf($e);
            return response()->json(
                new ApiResponse(500, "Internal server error"),
                500
            );
        }
    }
}
