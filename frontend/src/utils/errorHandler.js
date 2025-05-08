import { ApiError } from '../services/api';

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
    if (error instanceof ApiError) {
        // Handle validation errors
        if (error.status === 422 && error.details) {
            return {
                message: error.message,
                fields: error.details
            };
        }

        // Handle known errors
        return {
            message: error.message,
            status: error.status
        };
    }

    // Handle unexpected errors
    return {
        message: defaultMessage,
        status: 500
    };
};

export const formatValidationErrors = (errors) => {
    if (!errors || typeof errors !== 'object') return {};

    return Object.entries(errors).reduce((acc, [field, message]) => {
        acc[field] = Array.isArray(message) ? message[0] : message;
        return acc;
    }, {});
};
