import axios from 'axios';
import router from '@/router';

const api = axios.create({
    // baseURL: '/api', // Opsional: jika ingin semua request otomatis ke /api
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

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

// Response Interceptor: Handle 401 (Unauthorized)
api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        // Token expired atau invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect ke login jika bukan sedang di halaman login
        if (router.currentRoute.value.name !== 'login') {
            router.push('/login');
        }
    }
    return Promise.reject(error);
});

export default api;
