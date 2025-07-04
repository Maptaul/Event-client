// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://event-nu-teal.vercel.app';

console.log('API Base URL:', API_BASE_URL);

// Helper function to get auth headers
export const getAuthHeaders = (token) => ({
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
});

// Helper function to make authenticated API calls
export const apiCall = async (endpoint, options = {}, token = null) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = getAuthHeaders(token);

        const config = {
                headers,
                ...options
        };

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
};
