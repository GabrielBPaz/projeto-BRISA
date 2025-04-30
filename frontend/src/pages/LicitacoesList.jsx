import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Filters from '../components/Filters';
import LicitacaoItem from '../components/LicitacaoItem';
import FAB from '../components/FAB';
import { licitacoesService, empresasService } from '../services/api'; // Importar os serviços da API
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function LicitacoesList() {
    const navigate = useNavigate(); // Hook para navegação
    const [licitacoes, setLicitacoes] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({}); // Estado para filtros (incluindo ordenação)

    // Função para buscar licitações da API
    const fetchLicitacoes = async () => {
        setLoading(true);
        setError(null);
        try {
            // Passar os filtros atuais para o serviço
            const response = await licitacoesService.getLicitacoes(filters);
            if (response.success) {
                console.log("LicitacoesList: Dados recebidos:", response.data); // Log para verificar dados
                setLicitacoes(response.data);
            } else {
                setError(response.message || 'Erro ao buscar licitações');
            }
        } catch (err) {
            console.error('Erro ao buscar licitações:', err);
            setError('Falha ao conectar com a API.');
        }
        setLoading(false);
    };

    // Função para buscar empresas da API
    const fetchEmpresas = async () => {
        try {
            const response = await empresasService.getEmpresas();
            // Ajuste: A API de empresas pode retornar { success: true, data: [...] }
            if (response && response.success && Array.isArray(response.data)) {
                setEmpresas(response.data);
            } else if (response && Array.isArray(response)) {
                 // Fallback se a API retornar diretamente o array
                 setEmpresas(response);
            }
        } catch (err) {
            console.error('Erro ao buscar empresas:', err);
        }
    };

    // Buscar empresas ao montar o componente
    useEffect(() => {
        fetchEmpresas();
    }, []);

    // Buscar licitações ao montar o componente e quando os filtros mudarem
    useEffect(() => {
        fetchLicitacoes();
    }, [filters]);

    // Handler para mudanças nos filtros (incluindo ordenação)
    const handleFilterChange = (newFilters) => {
        setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    };

    // Handler para mudança na ordenação
    const handleSortChange = (event) => {
        handleFilterChange({ sortBy: event.target.value });
    };

    const handleAddClick = () => {
        console.log('Adicionar Nova Licitação Clicado!');
        // Lógica para abrir modal ou navegar para tela de adição
        // Ex: navigate('/licitacoes/nova');
    };

    const handleItemClick = (id) => {
        console.error(`--- LicitacoesList handleItemClick START para ID: ${id} ---`); // LOG DIAGNÓSTICO
        const token = localStorage.getItem("token");
        console.error(`--- LicitacoesList handleItemClick: Token no localStorage ANTES de navegar: ${token ? "Existe" : "NÃO Existe"} ---`); // LOG DIAGNÓSTICO
        if (!token) {
            console.error("--- LicitacoesList handleItemClick: Tentando navegar sem token! ABORTANDO NAVEGAÇÃO ---"); // LOG DIAGNÓSTICO
            // Considerar redirecionar para login aqui se isso acontecer
            // navigate("/login");
            return;
        }
        console.error(`--- LicitacoesList handleItemClick: CHAMANDO navigate(\"/licitacoes/${id}\") AGORA ---`); // LOG DIAGNÓSTICO
        navigate(`/licitacoes/${id}`); // Navega para a rota de detalhes
        console.error(`--- LicitacoesList handleItemClick: navigate() chamado. ---`); // LOG DIAGNÓSTICO
    };

    return (
        <Layout>
            <h1>Licitações</h1>

            {/* Passar a função de atualização de filtros e a lista de empresas para o componente Filters */}
            <Filters
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                empresas={empresas}
            />

            {loading && <p>Carregando licitações...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

            {!loading && !error && (
                <div className="licitacoes-list">
                    {licitacoes.length > 0 ? (
                        licitacoes.map(lic => (
                            <LicitacaoItem
                                key={lic.id}
                                id={lic.id}
                                // CORRIGIDO: Usar 'orgao' e 'empresa' (minúsculo)
                                orgao={lic.orgao?.nome || 'Órgão não informado'}
                                // Assumindo que cidade/UF não vêm do órgão, ajustar se necessário
                                cidadeUF={`Cidade não informada / UF`}
                                // Usar data_encerramento se disponível, senão data_abertura
                                proximaEntrega={lic.data_encerramento ? new Date(lic.data_encerramento).toLocaleDateString() : (lic.data_abertura ? new Date(lic.data_abertura).toLocaleDateString() : 'Data não informada')}
                                status={lic.status || 'Status não informado'}
                                empresa={lic.empresa?.nome_fantasia || 'Empresa não informada'}
                                // ADICIONADO: Passar o handler de clique
                                onClick={() => handleItemClick(lic.id)}
                            />
                        ))
                    ) : (
                        <p>Nenhuma licitação encontrada.</p>
                    )}
                </div>
            )}

            <FAB title="Adicionar Nova Licitação" onClick={handleAddClick} />
        </Layout>
    );
}

export default LicitacoesList;

