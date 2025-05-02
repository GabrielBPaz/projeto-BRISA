import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Filters from '../components/Filters';
import LicitacaoItem from '../components/LicitacaoItem';
import FAB from '../components/FAB';
import NovaLicitacaoModal from '../components/NovaLicitacaoModal'; // Importar o modal
import { licitacoesService, empresasService, orgaosService } from '../services/api'; // Importar todos os serviços necessários
import { useNavigate } from 'react-router-dom';

function LicitacoesList() {
    const navigate = useNavigate();
    const [licitacoes, setLicitacoes] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [orgaos, setOrgaos] = useState([]); // Estado para órgãos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para visibilidade do modal

    // Função para buscar licitações da API
    const fetchLicitacoes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await licitacoesService.getLicitacoes(filters);
            if (response.success) {
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
            if (response && response.success && Array.isArray(response.data)) {
                setEmpresas(response.data);
            } else if (response && Array.isArray(response)) {
                 setEmpresas(response);
            }
        } catch (err) {
            console.error('Erro ao buscar empresas:', err);
            // Não definir erro geral aqui para não impedir a exibição das licitações
        }
    };

    // Função para buscar órgãos da API
    const fetchOrgaos = async () => {
        try {
            const response = await orgaosService.getOrgaos();
            if (response && response.success && Array.isArray(response.data)) {
                setOrgaos(response.data);
            } else {
                 console.error('Resposta inesperada ao buscar órgãos:', response);
            }
        } catch (err) {
            console.error('Erro ao buscar órgãos:', err);
            // Não definir erro geral aqui
        }
    };

    // Buscar dados iniciais (empresas, órgãos, licitações)
    useEffect(() => {
        fetchEmpresas();
        fetchOrgaos();
        fetchLicitacoes(); // fetchLicitacoes já é chamado pelo useEffect de filters
    }, []); // Executar apenas na montagem inicial

    // Re-buscar licitações quando os filtros mudarem
    useEffect(() => {
        fetchLicitacoes();
    }, [filters]);

    // Handlers para filtros e ordenação
    const handleFilterChange = (newFilters) => {
        setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    };
    const handleSortChange = (event) => {
        handleFilterChange({ sortBy: event.target.value });
    };

    // Abrir o modal
    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    // Fechar o modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Submeter o formulário do modal
    const handleModalSubmit = async (formData) => {
        try {
            const response = await licitacoesService.criarLicitacao(formData); // Enviar FormData
            if (response.success) {
                alert('Licitação criada com sucesso!');
                handleCloseModal();
                fetchLicitacoes(); // Atualizar a lista após criar
            } else {
                alert(`Erro ao criar licitação: ${response.message}`);
            }
        } catch (error) {
            console.error("Erro ao submeter modal:", error);
            alert(`Erro ao criar licitação: ${error.response?.data?.message || error.message}`);
        }
    };

    // Navegar para detalhes
    const handleItemClick = (id) => {
        navigate(`/licitacoes/${id}`);
    };

    return (
        <Layout>
            <h1>Licitações</h1>

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
                                orgao={lic.orgao?.nome || 'N/A'}
                                // Exemplo: Adicionar cidade/UF do órgão se disponível
                                cidadeUF={`${lic.orgao?.cidade || 'N/A'} / ${lic.orgao?.estado || 'N/A'}`}
                                proximaEntrega={lic.data_encerramento ? new Date(lic.data_encerramento).toLocaleDateString() : (lic.data_abertura ? new Date(lic.data_abertura).toLocaleDateString() : 'N/A')}
                                status={lic.status || 'N/A'}
                                empresa={lic.empresa?.nome_fantasia || 'N/A'}
                                onClick={() => handleItemClick(lic.id)}
                            />
                        ))
                    ) : (
                        <p>Nenhuma licitação encontrada.</p>
                    )}
                </div>
            )}

            {/* Botão para adicionar nova licitação */}
            <FAB title="Adicionar Nova Licitação" onClick={handleAddClick} />

            {/* Modal para adicionar nova licitação */}
            <NovaLicitacaoModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                onSubmit={handleModalSubmit}
                orgaos={orgaos} // Passar a lista de órgãos
                empresas={empresas} // Passar a lista de empresas
            />
        </Layout>
    );
}

export default LicitacoesList;

