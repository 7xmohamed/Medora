import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authenticated');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const authService = {
    csrf: async () => {
        await axios.get('/sanctum/csrf-cookie');
    },

    check: async () => {
        try {
            await authService.csrf();
            const response = await api.get('/auth/check');
            localStorage.setItem('authenticated', 'true');
            return response;
        } catch (error) {
            localStorage.removeItem('authenticated');
            throw error;
        }
    },

    login: async (credentials) => {
        await authService.csrf();
        const response = await api.post('/login', credentials);
        localStorage.setItem('authenticated', 'true');
        return response;
    },

    logout: async () => {
        const response = await api.post('/logout');
        localStorage.removeItem('authenticated');
        return response;
    },

    getUser: async () => {
        await authService.csrf();
        return api.get('/user');
    }
};

export default authService;
