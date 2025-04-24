import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        const message = error.response?.data?.message || 'An error occurred';

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        toast.error(message);
        return Promise.reject(error);
    }
);

export const authApi = {
    login: credentials => api.post('/login', credentials),
    register: data => api.post('/register', data),
    logout: () => api.post('/logout'),
    me: () => api.get('/user')
};

export const doctorApi = {
    getDashboard: () => api.get('/doctor/dashboard'),
    getOrders: () => api.get('/doctor/orders'),
};

export const labApi = {
    getDashboard: () => api.get('/lab/dashboard'),
    getTests: () => api.get('/lab/tests'),
};

export const patientApi = {
    getDashboard: () => api.get('/patient/dashboard'),
    getResults: () => api.get('/patient/results'),
};

export default api;
