import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

// Add retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Custom error class
class ApiError extends Error {
    constructor(status, message, details = null) {
        super(message);
        this.status = status;
        this.details = details;
        this.name = 'ApiError';
    }
}

// Error messages mapping
const ERROR_MESSAGES = {
    400: 'Invalid request. Please check your data and try again.',
    401: 'Your session has expired. Please log in again.',
    403: 'You don\'t have permission to access this resource.',
    404: 'The requested resource was not found.',
    408: 'The request timed out. Please try again.',
    409: 'There was a conflict with your request.',
    422: 'The provided data is invalid.',
    429: 'Too many requests. Please try again later.',
    500: 'An unexpected server error occurred. Our team has been notified.',
    503: 'Service temporarily unavailable. Please try again later.',
    default: 'An unexpected error occurred. Please try again.'
};

// Handle network errors
const isNetworkError = (error) => {
    return !error.response && !error.status && error.code !== 'ECONNABORTED';
};

// Retry logic
const retryRequest = (error, retryCount = 0) => {
    const shouldRetry = (
        (isNetworkError(error) || error.response?.status >= 500) &&
        retryCount < MAX_RETRIES
    );

    if (!shouldRetry) {
        return Promise.reject(error);
    }

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(api(error.config));
        }, RETRY_DELAY * Math.pow(2, retryCount));
    });
};

// Request timeout
api.defaults.timeout = 30000; // 30 seconds

// Request interceptor enhancements
api.interceptors.request.use(
    config => {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        config.params = {
            ...config.params,
            _t: timestamp
        };

        // Add token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = crypto.randomUUID();

        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    response => response,
    async error => {
        // Get retry count from config
        const retryCount = error.config?.retryCount || 0;
        error.config.retryCount = retryCount + 1;

        // Handle retry
        if (await retryRequest(error, retryCount).catch(() => null)) {
            return retryRequest(error, retryCount);
        }

        // Handle authentication errors
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return Promise.reject(new ApiError(401, 'Session expired'));
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
            const retryAfter = error.response.headers['retry-after'] || 30;
            return Promise.reject(new ApiError(429, `Rate limit exceeded. Please try again in ${retryAfter} seconds.`));
        }

        // Format error message
        const status = error.response?.status;
        const message = error.response?.data?.message ||
            ERROR_MESSAGES[status] ||
            ERROR_MESSAGES.default;

        // Format validation errors
        const details = error.response?.status === 422 ?
            Object.entries(error.response.data.errors || {}).reduce((acc, [field, errors]) => {
                acc[field] = Array.isArray(errors) ? errors[0] : errors;
                return acc;
            }, {}) :
            error.response?.data;

        // Track error in monitoring system (you can add your monitoring service here)
        if (error.response?.status >= 500) {
            // Log to monitoring service
            console.warn('Server Error:', {
                status,
                message,
                details,
                url: error.config?.url,
                method: error.config?.method
            });
        }

        return Promise.reject(new ApiError(status, message, details));
    }
);

export { ApiError };
export default api;
