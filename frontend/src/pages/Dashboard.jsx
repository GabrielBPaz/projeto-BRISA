import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import FAB from '../components/FAB';
import { useNavigate } from 'react-router-dom';
import { licitacoesService } from '../services/api';

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ ativas: {}, proximosPrazos: {}, emAtraso: {}, concluidas: {} }); // Initialize with structure
    const [licitacoesAndamento, setLicitacoesAndamento] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleAddClick = () => {
        console.log('Adicionar Nova Licitação Clicado!');
        // Logic to open modal or navigate to add screen
        // Ex: navigate('/licitacoes/nova');
    };

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError('');
            try {
                // licitacoesService.getDashboardStats() returns the 'data' part of the axios response directly
                // which has the structure { success: true, data: { stats: {...}, licitacoesAndamento: [...] } }
                const apiResponse = await licitacoesService.getDashboardStats();
                console.log("Frontend: Raw response received from service:", apiResponse);

                // *** CORRECTED CHECK ***
                // Check if the core data structure exists: apiResponse.data.stats
                if (apiResponse?.success && apiResponse?.data?.stats && typeof apiResponse.data.stats === 'object') {
                    const backendStats = apiResponse.data.stats;
                    const backendLicitacoes = apiResponse.data.licitacoesAndamento || [];

                    console.log("Frontend: Stats data found:", backendStats);

                    // Format data for StatCards, using correct names from backend
                    const formattedStats = {
                        ativas: {
                            value: backendStats.ativas || 0,
                            details: 'Total de licitações ativas'
                        },
                        proximosPrazos: {
                            value: backendStats.proximosPrazos || 0,
                            details: 'Com encerramento nos próximos 7 dias'
                        },
                        emAtraso: {
                            value: backendStats.emAtraso || 0,
                            details: 'Com encerramento vencido'
                        },
                        concluidas: {
                            value: backendStats.concluidas || 0,
                            details: 'Total de licitações concluídas'
                        }
                    };

                    setStats(formattedStats);
                    setLicitacoesAndamento(backendLicitacoes);
                } else {
                    // Log the problematic response structure for debugging
                    console.error('Estrutura inesperada ou dados ausentes na resposta da API. Resposta recebida do serviço:', apiResponse);
                    setError('Erro ao processar dados do dashboard. Formato inesperado ou dados ausentes.');
                    // Set stats to zero to avoid rendering errors
                    setStats({
                        ativas: { value: 0, details: 'Erro' },
                        proximosPrazos: { value: 0, details: 'Erro' },
                        emAtraso: { value: 0, details: 'Erro' },
                        concluidas: { value: 0, details: 'Erro' }
                    });
                }
                // *** END OF CORRECTED CHECK ***
            } catch (err) {
                console.error('Erro ao buscar dados do dashboard:', err);
                setError('Erro ao carregar dados. Tente novamente.');
                 // Set stats to zero to avoid rendering errors
                 setStats({
                    ativas: { value: 0, details: 'Erro' },
                    proximosPrazos: { value: 0, details: 'Erro' },
                    emAtraso: { value: 0, details: 'Erro' },
                    concluidas: { value: 0, details: 'Erro' }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <Layout><div>Carregando...</div></Layout>; // Wrap with Layout
    }

    // Show error inside Layout
    if (error) {
        return <Layout><div>{error}</div></Layout>;
    }

    return (
        <Layout>
            <h1>Dashboard</h1>
            <p>Visão geral das suas licitações e atividades.</p>

            <div className="stats-container">
                {/* Use correct property names from 'stats' state */}
                <StatCard title="Licitações Ativas" value={stats.ativas.value} details={stats.ativas.details} />
                <StatCard title="Próximos Prazos" value={stats.proximosPrazos.value} details={stats.proximosPrazos.details} variant="prazos" />
                <StatCard title="Em Atraso" value={stats.emAtraso.value} details={stats.emAtraso.details} variant="atraso" />
                <StatCard title="Concluídas" value={stats.concluidas.value} details={stats.concluidas.details} variant="concluidas" />
            </div>

            {/* Display Ongoing Bids (if any) */}
            {licitacoesAndamento.length > 0 && (
                <div className="licitacoes-recentes-container">
                    <h2>Licitações em Andamento</h2>
                    <div className="licitacoes-andamento-grid">
                        {/* Coluna Pendente (Exemplo, ajustar filtro conforme dados reais) */}
                        <div className="licitacao-andamento-coluna">
                            <h3>Pendente</h3>
                            {licitacoesAndamento.filter(lic => lic.status === 'Pendente').map(lic => (
                                <div key={lic.id} className="licitacao-recente-item">
                                    <strong>{lic.numero_licitacao}</strong>
                                    <span>{lic.orgao?.nome || 'Órgão não informado'}</span>
                                    <span className="encerramento">Encerra: {lic.data_encerramento ? new Date(lic.data_encerramento).toLocaleDateString() : 'N/D'}</span>
                                </div>
                            ))}
                            {licitacoesAndamento.filter(lic => lic.status === 'Pendente').length === 0 && <p>Nenhuma pendente.</p>}
                        </div>

                        {/* Coluna Em Andamento (Exemplo, ajustar filtro conforme dados reais) */}
                        <div className="licitacao-andamento-coluna">
                            <h3>Em Andamento</h3>
                             {licitacoesAndamento.filter(lic => lic.status === 'Em Andamento' || lic.status === 'Em Aberto').map(lic => (
                                <div key={lic.id} className="licitacao-recente-item">
                                    <strong>{lic.numero_licitacao}</strong>
                                    <span>{lic.orgao?.nome || 'Órgão não informado'}</span>
                                    <span className="encerramento">Encerra: {lic.data_encerramento ? new Date(lic.data_encerramento).toLocaleDateString() : 'N/D'}</span>
                                </div>
                            ))}
                             {(licitacoesAndamento.filter(lic => lic.status === 'Em Andamento' || lic.status === 'Em Aberto').length === 0) && <p>Nenhuma em andamento.</p>}
                        </div>

                        {/* Coluna Concluído (Exemplo, ajustar filtro conforme dados reais) */}
                        <div className="licitacao-andamento-coluna">
                            <h3>Concluído</h3>
                            {licitacoesAndamento.filter(lic => lic.status === 'Concluído' || lic.status === 'Concluida').map(lic => (
                                <div key={lic.id} className="licitacao-recente-item">
                                    <strong>{lic.numero_licitacao}</strong>
                                    <span>{lic.orgao?.nome || 'Órgão não informado'}</span>
                                    <span className="encerramento">Concluída em: {lic.data_encerramento ? new Date(lic.data_encerramento).toLocaleDateString() : 'N/D'}</span>
                                </div>
                            ))}
                            {(licitacoesAndamento.filter(lic => lic.status === 'Concluído' || lic.status === 'Concluida').length === 0) && <p>Nenhuma concluída recentemente.</p>}
                        </div>
                    </div>
                </div>
            )}

            <FAB title="Adicionar Nova Licitação" onClick={handleAddClick} />
        </Layout>
    );
}

export default Dashboard;

