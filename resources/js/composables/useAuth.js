import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/lib/axios';

export function useAuth() {
    const router = useRouter();
    const isLoading = ref(false);
    const error = ref(null);

    // Get current user from localStorage
    const user = computed(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    });

    // Check if user is authenticated
    const isAuthenticated = computed(() => {
        return !!localStorage.getItem('token');
    });

    // Login function
    const login = async (email, password) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            });

            const { access_token, refresh_token, user, expires_in } = response.data;

            // Store tokens and user info
            localStorage.setItem('token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('user', JSON.stringify(user));

            // Store token expiry time
            const expiryTime = Date.now() + (expires_in * 1000);
            localStorage.setItem('token_expiry', expiryTime.toString());

            return { success: true, user };
        } catch (err) {
            error.value = err.response?.data?.message || 'Login failed';
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    // Logout function
    const logout = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            // Call logout endpoint to revoke token on server
            await axios.post('/api/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
            // Continue with local logout even if API call fails
        } finally {
            // Clear all auth data from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            localStorage.removeItem('token_expiry');
            localStorage.removeItem('remember_me');

            isLoading.value = false;

            // Redirect to login
            router.push('/login');
        }
    };

    // Refresh token function (manual refresh)
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await axios.post('/api/auth/refresh', {
                refresh_token: refreshToken
            });

            const { access_token, refresh_token: new_refresh_token, expires_in } = response.data;

            // Update tokens
            localStorage.setItem('token', access_token);
            localStorage.setItem('refresh_token', new_refresh_token);

            // Update expiry time
            const expiryTime = Date.now() + (expires_in * 1000);
            localStorage.setItem('token_expiry', expiryTime.toString());

            return { success: true };
        } catch (err) {
            // Clear auth data if refresh fails
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            localStorage.removeItem('token_expiry');
            localStorage.removeItem('remember_me');

            error.value = 'Session expired. Please login again.';
            router.push('/login');

            return { success: false, error: error.value };
        }
    };

    // Check if token is about to expire (within 5 minutes)
    const isTokenExpiringSoon = computed(() => {
        const expiryTime = localStorage.getItem('token_expiry');
        if (!expiryTime) return false;

        const now = Date.now();
        const expiry = parseInt(expiryTime);
        const fiveMinutes = 5 * 60 * 1000;

        return (expiry - now) < fiveMinutes;
    });

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        refreshToken,
        isTokenExpiringSoon
    };
}
