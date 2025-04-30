import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        
        console.log('Tentando login com:', { email, senha });

        try {
            // Corrigido: removido o prefixo '/api' duplicado
            console.log('Enviando requisição para:', `${api.defaults.baseURL}/auth/login`);
        
            // Corrigido: removido o prefixo '/api' duplicado
            const response = await api.post('/auth/login', {
                email,
                senha
            });
            
            console.log('Resposta do servidor:', response.data);


            if (response.data.success) {
                // Armazenar token e informações do usuário
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
                
                // Configurar o token para todas as requisições futuras
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                
                // Redirecionar para o dashboard
                navigate('/dashboard');
            } else {
                setError(response.data.message || 'Erro ao fazer login');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setError(
                error.response?.data?.message || 
                'Erro ao conectar com o servidor. Verifique sua conexão.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Login</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="senha">Senha:</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
