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
                const apiResponse = await licitacoesService.getDashboardStats();
                console.log("Frontend: Raw response received from service:", apiResponse);

                if (apiResponse?.success && apiResponse?.data?.stats && typeof apiResponse.data.stats === 'object') {
                    const backendStats = apiResponse.data.stats;
                    const backendLicitacoes = apiResponse.data.licitacoesAndamento || [];

                    console.log("Frontend: Stats data found:", backendStats);

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
                    console.error('Estrutura inesperada ou dados ausentes na resposta da API. Resposta recebida do serviço:', apiResponse);
                    setError('Erro ao processar dados do dashboard. Formato inesperado ou dados ausentes.');
                    setStats({
                        ativas: { value: 0, details: 'Erro' },
                        proximosPrazos: { value: 0, details: 'Erro' },
                        emAtraso: { value: 0, details: 'Erro' },
                        concluidas: { value: 0, details: 'Erro' }
                    });
                }
            } catch (err) {
                console.error('Erro ao buscar dados do dashboard:', err);
                setError('Erro ao carregar dados. Tente novamente.');
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

    if (error) {
        return <Layout><div>{error}</div></Layout>;
    }

    return (
        // <Layout> // REMOVIDO
        <div className="dashboard-content"> {/* Adicionada div para aplicar estilos de card */}
            <h1>Dashboard</h1>
            <p>Visão geral das suas licitações e atividades.</p>

            <div className="stats-container">
                {/* Passar filterParam correspondente ao status esperado pela API/Lista */}
                <StatCard 
                    title="Licitações Ativas" 
                    value={stats.ativas.value} 
                    details={stats.ativas.details} 
                    filterParam="ativa" // Filtra por status 'ativa'
                />
                <StatCard 
                    title="Próximos Prazos" 
                    value={stats.proximosPrazos.value} 
                    details={stats.proximosPrazos.details} 
                    variant="prazos" 
                    // filterParam removido - não filtra por status
                />
                <StatCard 
                    title="Em Atraso" 
                    value={stats.emAtraso.value} 
                    details={stats.emAtraso.details} 
                    variant="atraso" 
                    // filterParam removido - não filtra por status
                />
                <StatCard 
                    title="Concluídas" 
                    value={stats.concluidas.value} 
                    details={stats.concluidas.details} 
                    variant="concluidas" 
                    filterParam="concluida" // Filtra por status 'concluida'
                />
            </div>

            {/* Display Ongoing Bids (if any) */}
            {licitacoesAndamento.length > 0 && (
                <div className="licitacoes-recentes-container">
                    <h2>Licitações em Andamento</h2>
                    <div className="licitacoes-andamento-grid">
                        {/* Coluna Pendente */}
                        <div className="licitacao-andamento-coluna">
                            <h3>Pendente</h3>
                            {/* Ajustar filtro de status para 'Em Aberto' se for o caso */}
                            {licitacoesAndamento.filter(lic => lic.status === 'Em Aberto').map(lic => (
                                <div key={lic.id} className="licitacao-recente-item">
                                    <strong>{lic.numero_licitacao}</strong>
                                    <span>{lic.orgao?.nome || 'Órgão não informado'}</span>
                                    <span className="encerramento">Encerra: {lic.data_encerramento ? new Date(lic.data_encerramento).toLocaleDateString() : 'N/D'}</span>
                                </div>
                            ))}
                            {licitacoesAndamento.filter(lic => lic.status === 'Em Aberto').length === 0 && <p>Nenhuma pendente.</p>}
                        </div>

                        {/* Coluna Em Andamento */}
                        <div className="licitacao-andamento-coluna">
                            <h3>Em Andamento</h3>
                             {/* Ajustar filtro de status para 'ativa' ou 'Em Andamento' */}
                             {licitacoesAndamento.filter(lic => lic.status === 'ativa' || lic.status === 'Em Andamento').map(lic => (
                                <div key={lic.id} className="licitacao-recente-item">
                                    <strong>{lic.numero_licitacao}</strong>
                                    <span>{lic.orgao?.nome || 'Órgão não informado'}</span>
                                    <span className="encerramento">Encerra: {lic.data_encerramento ? new Date(lic.data_encerramento).toLocaleDateString() : 'N/D'}</span>
                                </div>
                            ))}
                             {(licitacoesAndamento.filter(lic => lic.status === 'ativa' || lic.status === 'Em Andamento').length === 0) && <p>Nenhuma em andamento.</p>}
                        </div>

                        {/* Coluna Concluído */}
                        <div className="licitacao-andamento-coluna">
                            <h3>Concluído</h3>
                            {licitacoesAndamento.filter(lic => lic.status === 'concluida').map(lic => (
                                <div key={lic.id} className="licitacao-recente-item">
                                    <strong>{lic.numero_licitacao}</strong>
                                    <span>{lic.orgao?.nome || 'Órgão não informado'}</span>
                                    <span className="encerramento">Concluída em: {lic.data_encerramento ? new Date(lic.data_encerramento).toLocaleDateString() : 'N/D'}</span>
                                </div>
                            ))}
                            {(licitacoesAndamento.filter(lic => lic.status === 'concluida').length === 0) && <p>Nenhuma concluída recentemente.</p>}
                        </div>
                    </div>
                </div>
            )}

        </div>
        // </Layout> // REMOVIDO
    );
}

export default Dashboard;

