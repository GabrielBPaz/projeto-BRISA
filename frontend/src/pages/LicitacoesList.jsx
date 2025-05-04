import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Filters from '../components/Filters';
import LicitacaoItem from '../components/LicitacaoItem';
import FAB from '../components/FAB';
import NovaLicitacaoModal from '../components/NovaLicitacaoModal'; // Importar o modal
import { licitacoesService, empresasService, orgaosService } from '../services/api'; // Importar todos os serviços necessários
import { useNavigate, useLocation } from 'react-router-dom'; // Importar useLocation

function LicitacoesList() {
    const navigate = useNavigate();
    const location = useLocation(); // Usar useLocation para acessar query params
    const [licitacoes, setLicitacoes] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [orgaos, setOrgaos] = useState([]); // Estado para órgãos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para visibilidade do modal

    // Função para buscar licitações da API
    const fetchLicitacoes = async (currentFilters) => { // Recebe os filtros atuais
        setLoading(true);
        setError(null);
        try {
            const response = await licitacoesService.getLicitacoes(currentFilters);
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

    // Buscar dados iniciais e aplicar filtro da URL
    useEffect(() => {
        fetchEmpresas();
        fetchOrgaos();

        // Ler o parâmetro 'status' da URL
        const queryParams = new URLSearchParams(location.search);
        const statusFromUrl = queryParams.get('status');

        let initialFilters = {};
        if (statusFromUrl) {
            initialFilters = { status: statusFromUrl };
            setFilters(initialFilters); // Define o filtro inicial
        } else {
             fetchLicitacoes({}); // Busca inicial sem filtro se não houver param na URL
        }
        // A busca com filtro será acionada pelo useEffect abaixo quando setFilters for chamado

    }, [location.search]); // Re-executar se a URL search mudar

    // Re-buscar licitações quando os filtros mudarem
    useEffect(() => {
        // Só busca se filters não estiver vazio ou se não veio da URL (evita busca dupla inicial)
        if (Object.keys(filters).length > 0) {
             fetchLicitacoes(filters);
        }
    }, [filters]);

    // Handlers para filtros e ordenação
    const handleFilterChange = (newFilters) => {
        // Atualiza a URL sem recarregar a página (opcional, mas bom para UX)
        const queryParams = new URLSearchParams(location.search);
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) {
                queryParams.set(key, newFilters[key]);
            } else {
                queryParams.delete(key);
            }
        });
        navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });

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
                fetchLicitacoes(filters); // Atualizar a lista após criar
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
                initialFilters={filters} // Passa os filtros iniciais para o componente Filters
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
                        <p>Nenhuma licitação encontrada com os filtros aplicados.</p>
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

