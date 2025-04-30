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
    // *** ADICIONADO LOG ***
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
    response => {
        // *** ADICIONADO LOG ***
        return response;
    },
    error => {
        console.error("--- API Interceptor: ERRO na resposta ---", error.config.url, error.response?.status, error); // LOG DIAGNÓSTICO

        // Se o erro for 401 (não autorizado), limpar o localStorage e redirecionar para login
        if (error.response && error.response.status === 401) {
            console.error("--- API Interceptor: Erro 401 detectado! Removendo token e usuário... ---", error.config.url); // LOG DIAGNÓSTICO
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            setTimeout(() => {
                 console.error("--- API Interceptor: REDIRECIONANDO para /login AGORA! ---"); // LOG DIAGNÓSTICO
                 window.location.href = "/login"; // Reativado
            }, 500);
        }
        return Promise.reject(error); // Rejeitar a promessa para que o erro possa ser tratado no local da chamada
    }
);

export const licitacoesService = {
    // Obter estatísticas para o dashboard
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
        // *** ADICIONADO LOG ***
        try {
          const response = await api.get(`/licitacoes/${id}`);
          // *** ADICIONADO LOG ***
          return response.data;
        } catch (error) {
          // *** ADICIONADO LOG ***
          throw error;
        }
    },

    adicionarEmpenho: async (licitacaoId, dadosEmpenho) => {
        try {
            const response = await api.post(`/licitacoes/${licitacaoId}/empenhos`, dadosEmpenho);
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

// Serviço de autenticação
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

