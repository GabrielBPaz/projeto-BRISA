// Middleware para verificar autenticação e proteger rotas
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../services/api';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Verificar se o token é válido
        const response = await api.post('/api/auth/validate');
        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          // Token inválido
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!isAuthenticated) {
    // Redirecionar para login, salvando a localização atual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
