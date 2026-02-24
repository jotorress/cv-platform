import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000' // Server
});

api.interceptors.request.use( // Authentication token with the requests 
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;