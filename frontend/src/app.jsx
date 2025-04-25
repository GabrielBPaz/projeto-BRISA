import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import LicitacoesList from './pages/LicitacoesList';
import LicitacaoDetalhe from './pages/LicitacaoDetalhe';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      
      {/* Rota padrão - redireciona para login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Rotas protegidas */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/licitacoes" element={
        <ProtectedRoute>
          <Layout>
            <LicitacoesList />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/licitacoes/:id" element={
        <ProtectedRoute>
          <Layout>
            <LicitacaoDetalhe />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute>
          <Layout>
            <Admin />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Rota para páginas não encontradas */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
