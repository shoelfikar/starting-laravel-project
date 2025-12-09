import axios from 'axios';
import router from '@/router';

const api = axios.create({
    // baseURL: '/api', // Opsional: jika ingin semua request otomatis ke /api
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Flag untuk mencegah multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
        return Promise.reject(new Error('No refresh token available'));
    }

    try {
        const response = await axios.post('/api/auth/refresh', {
            refresh_token: refreshToken
        });

        const { access_token, refresh_token: new_refresh_token, expires_in } = response.data;

        // Update tokens in localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('refresh_token', new_refresh_token);

        // Update token expiry time
        const expiryTime = Date.now() + (expires_in * 1000);
        localStorage.setItem('token_expiry', expiryTime.toString());

        return access_token;
    } catch (error) {
        // Clear all auth data if refresh fails
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expiry');
        localStorage.removeItem('remember_me');
        throw error;
    }
};

// Request Interceptor: Tambahkan Token otomatis
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 (Unauthorized) dengan auto-refresh
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Jangan refresh jika request adalah ke endpoint login atau refresh
            if (originalRequest.url?.includes('/auth/login') ||
                originalRequest.url?.includes('/auth/refresh')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshToken();
                processQueue(null, newToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                // Redirect to login
                if (router.currentRoute.value.name !== 'login') {
                    router.push('/login');
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
