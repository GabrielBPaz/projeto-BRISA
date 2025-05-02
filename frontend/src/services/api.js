import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api' // Adicionar /api ao baseURL
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
    response => {
        return response;
    },
    error => {
        console.error("--- API Interceptor: ERRO na resposta ---", error.config.url, error.response?.status, error); // LOG DIAGNÓSTICO
        if (error.response && error.response.status === 401) {
            console.error("--- API Interceptor: Erro 401 detectado! Removendo token e usuário... ---", error.config.url); // LOG DIAGNÓSTICO
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            setTimeout(() => {
                 console.error("--- API Interceptor: REDIRECIONANDO para /login AGORA! ---"); // LOG DIAGNÓSTICO
                 window.location.href = "/login";
            }, 500);
        }
        return Promise.reject(error);
    }
);

export const licitacoesService = {
    getDashboardStats: async () => {
      try {
        const response = await api.get('/licitacoes/dashboard');
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    getLicitacoes: async (filtros = {}) => {
        try {
          const response = await api.get('/licitacoes', { params: filtros });
          return response.data;
        } catch (error) {
          throw error;
        }
    },
    getLicitacaoById: async (id) => {
        try {
          const response = await api.get(`/licitacoes/${id}`);
          return response.data;
        } catch (error) {
          throw error;
        }
    },
    // Modificado para aceitar FormData
    criarLicitacao: async (formData) => {
        try {
            // Enviar como multipart/form-data
            const response = await api.post("/licitacoes", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    adicionarEmpenho: async (licitacaoId, dadosEmpenho) => {
        try {
            const response = await api.post(`/empenhos`, dadosEmpenho);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    atualizarPrazos: async (licitacaoId, dadosPrazos) => {
        try {
            const response = await api.put(`/licitacoes/${licitacaoId}/prazos`, dadosPrazos);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    anexarDocumento: async (licitacaoId, formData) => {
        try {
            const response = await api.post(`/licitacoes/${licitacaoId}/documentos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    adicionarComentario: async (licitacaoId, comentario) => {
        try {
            const response = await api.post(`/licitacoes/${licitacaoId}/comentarios`, comentario);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const empresasService = {
    getEmpresas: async () => {
        try {
            const response = await api.get('/empresas');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

// NOVO: Serviço para Órgãos Públicos
export const orgaosService = {
    getOrgaos: async () => {
        try {
            const response = await api.get('/orgaos'); // Assumindo que a rota é /api/orgaos
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    validateToken: async () => {
        try {
            const response = await api.get('/auth/validate');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default api;

