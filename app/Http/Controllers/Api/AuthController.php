<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private function issueToken(User $user, $remember = false)
    {
        // Create access token using Passport
        $tokenResult = $user->createToken('auth_token');

        // Set token expiration based on remember me
        if ($remember) {
            // Remember me: 7 days for access token
            $tokenResult->token->expires_at = now()->addDays(7);
            $accessTokenExpiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
            $refreshTokenExpiresAt = now()->addDays(14); // 14 days for refresh token
        } else {
            // Default: 30 minutes for access token
            $tokenResult->token->expires_at = now()->addMinutes(30);
            $accessTokenExpiresIn = 1800; // 30 minutes in seconds
            $refreshTokenExpiresAt = now()->addDay(); // 1 day for refresh token
        }

        $tokenResult->token->save();

        // Create refresh token model directly
        $refreshToken = new \Laravel\Passport\RefreshToken();
        $refreshToken->id = \Illuminate\Support\Str::random(40);
        $refreshToken->access_token_id = $tokenResult->token->id;
        $refreshToken->revoked = false;
        $refreshToken->expires_at = $refreshTokenExpiresAt;
        $refreshToken->save();

        return [
            'access_token' => $tokenResult->accessToken,
            'refresh_token' => $refreshToken->id,
            'token_type' => 'Bearer',
            'expires_in' => $accessTokenExpiresIn,
        ];
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 403);
        }

        $validated = $validator->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Issue token directly (no HTTP request needed)
        $tokenData = $this->issueToken($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'access_token' => $tokenData['access_token'],
            'refresh_token' => $tokenData['refresh_token'],
            'token_type' => 'Bearer',
            'expires_in' => $tokenData['expires_in'],
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 403);
        }

        $validated = $validator->validated();

        if (!Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        $user = Auth::user();
        $remember = $validated['remember'] ?? false;

        // Issue token with remember me option
        $tokenData = $this->issueToken($user, $remember);

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'access_token' => $tokenData['access_token'],
            'refresh_token' => $tokenData['refresh_token'],
            'token_type' => 'Bearer',
            'expires_in' => $tokenData['expires_in'],
        ]);
    }

    public function refresh(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'refresh_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 403);
        }

        try {
            // Find the refresh token
            $refreshToken = \Laravel\Passport\RefreshToken::find($request->refresh_token);

            if (!$refreshToken) {
                return response()->json([
                    'message' => 'Invalid refresh token',
                    'error' => 'token_not_found'
                ], 401);
            }

            // Check if refresh token is revoked
            if ($refreshToken->revoked) {
                return response()->json([
                    'message' => 'Refresh token has been revoked',
                    'error' => 'token_revoked'
                ], 401);
            }

            // Check if refresh token is expired
            if ($refreshToken->expires_at < now()) {
                return response()->json([
                    'message' => 'Refresh token has expired',
                    'error' => 'token_expired'
                ], 401);
            }

            // Get the access token associated with the refresh token
            $oldAccessToken = \Laravel\Passport\Token::find($refreshToken->access_token_id);

            if (!$oldAccessToken) {
                return response()->json([
                    'message' => 'Associated access token not found',
                    'error' => 'access_token_not_found'
                ], 401);
            }

            // Get the user
            $user = User::find($oldAccessToken->user_id);

            if (!$user) {
                return response()->json([
                    'message' => 'User not found',
                    'error' => 'user_not_found'
                ], 401);
            }

            // Revoke old tokens
            $oldAccessToken->revoke();
            $refreshToken->revoked = true;
            $refreshToken->save();

            // Issue new tokens
            $tokenData = $this->issueToken($user);

            return response()->json([
                'message' => 'Token refreshed successfully',
                'access_token' => $tokenData['access_token'],
                'refresh_token' => $tokenData['refresh_token'],
                'token_type' => 'Bearer',
                'expires_in' => $tokenData['expires_in'],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to refresh token',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->token()->revoke();

        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
