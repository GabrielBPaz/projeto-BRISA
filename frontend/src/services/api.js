import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001'
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
    response => response,
    error => {
        // Se o erro for 401 (não autorizado), limpar o localStorage e redirecionar para login
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
