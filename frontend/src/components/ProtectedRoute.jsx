// Middleware para verificar autenticação e proteger rotas
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

function ProtectedRoute({ children }) {
  console.error("--- ProtectedRoute RENDER START ---"); // LOG DIAGNÓSTICO
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    console.error("--- ProtectedRoute useEffect START ---", location.pathname); // LOG DIAGNÓSTICO
    const verifyToken = async () => {
      console.error("--- ProtectedRoute verifyToken START ---"); // LOG DIAGNÓSTICO
      setLoading(true); // Inicia carregando
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("--- ProtectedRoute verifyToken: Token NÃO encontrado no localStorage ---"); // LOG DIAGNÓSTICO
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      console.error("--- ProtectedRoute verifyToken: Token encontrado, chamando API... ---"); // LOG DIAGNÓSTICO

      try {
        // Restaurada a chamada para validar o token com o backend
        const response = await authService.validateToken(); 
        console.error("--- ProtectedRoute verifyToken: Resposta da API recebida ---", response); // LOG DIAGNÓSTICO
        if (response.success) {
          console.error("--- ProtectedRoute verifyToken: Validação API SUCESSO ---"); // LOG DIAGNÓSTICO
          setIsAuthenticated(true);
        } else {
          // Token inválido ou erro na resposta
          console.error("--- ProtectedRoute verifyToken: Validação API FALHOU (response.success=false) ---"); // LOG DIAGNÓSTICO
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Erro na chamada da API (ex: rede, 401 não tratado explicitamente aqui, mas no interceptor)
        console.error("--- ProtectedRoute verifyToken: ERRO CATCH na chamada API ---", error); // LOG DIAGNÓSTICO
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setIsAuthenticated(false);
      } finally {
        console.error("--- ProtectedRoute verifyToken: FINALLY ---"); // LOG DIAGNÓSTICO
        setLoading(false); // Finaliza carregando
      }
    };

    verifyToken();
    // Mantida a dependência location para revalidar ao navegar
  }, [location]);

  if (loading) {
    console.error("--- ProtectedRoute RENDER: Loading... ---"); // LOG DIAGNÓSTICO
    return <div className="loading">Verificando autenticação...</div>; // Mensagem de loading
  }

  if (!isAuthenticated) {
    // Redirecionar para login, salvando a localização atual
    console.error("--- ProtectedRoute RENDER: NÃO autenticado, redirecionando para /login ---"); // LOG DIAGNÓSTICO
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Usuário autenticado, renderiza o componente filho
  console.error("--- ProtectedRoute RENDER: Autenticado, renderizando children ---"); // LOG DIAGNÓSTICO
  return children;
}

export default ProtectedRoute;