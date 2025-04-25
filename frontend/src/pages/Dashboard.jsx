import React from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import FAB from '../components/FAB';

function Dashboard() {
    const handleAddClick = () => {
        console.log('Adicionar Nova Licitação Clicado!');
        // Lógica para abrir modal ou navegar para tela de adição
    };

    // Dados de exemplo (viriam do estado ou API)
    const stats = {
        ativas: { value: 5, details: '+2 esta semana' },
        prazos: { value: 3, details: 'Até fim da semana' },
        atraso: { value: 1, details: 'Requer atenção' },
        concluidas: { value: 15, details: 'Últimos 30 dias' },
    };

    return (
        <Layout>
            <h1>Dashboard</h1>
            <p>Visão geral das suas licitações e atividades.</p>

            <div className="stats-container">
                <StatCard title="Licitações Ativas" value={stats.ativas.value} details={stats.ativas.details} />
                <StatCard title="Próximos Prazos" value={stats.prazos.value} details={stats.prazos.details} variant="prazos" />
                <StatCard title="Em Atraso" value={stats.atraso.value} details={stats.atraso.details} variant="atraso" />
                <StatCard title="Concluídas" value={stats.concluidas.value} details={stats.concluidas.details} variant="concluidas" />
            </div>

             {/* Exemplo: Licitações em Andamento (simplificado) */}
             <h2>Licitações em Andamento</h2>
             <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                <div style={{ flex: 1, background: '#fff', padding: '15px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><strong>Pendente</strong><br/>Licitação X...</div>
                <div style={{ flex: 1, background: '#fff', padding: '15px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><strong>Em Andamento</strong><br/>Licitação Y...</div>
                <div style={{ flex: 1, background: '#fff', padding: '15px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><strong>Concluído</strong><br/>Licitação Z...</div>
            </div>


            <FAB title="Adicionar Nova Licitação" onClick={handleAddClick} />
        </Layout>
    );
}

export default Dashboard;