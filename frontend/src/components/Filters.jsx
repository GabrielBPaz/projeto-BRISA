import React, { useState, useEffect } from 'react';

function Filters({ onSortChange, onFilterChange, initialFilters }) { 
    // Estado para o filtro de situação selecionado
    // Inicializa com o valor do filtro vindo da URL ou estado anterior, se houver
    const [selectedStatus, setSelectedStatus] = useState(initialFilters?.status || '');

    // Atualiza o estado local se o filtro inicial mudar (ex: navegação por URL)
    useEffect(() => {
        setSelectedStatus(initialFilters?.status || '');
    }, [initialFilters?.status]);

    // Handler para mudança no filtro de situação
    const handleStatusChange = (event) => {
        const statusValue = event.target.value;
        setSelectedStatus(statusValue);
        onFilterChange({ status: statusValue }); // Atualiza o filtro no componente pai
    };

    // Handler para mudança na ordenação
    const handleSortChange = (event) => {
        onSortChange(event); // Chama a função passada pelo pai
    };

    return (
        <div className="filters">
            {/* Filtro por Situação - Valores ajustados para corresponder ao backend */}
            <label htmlFor="status">Situação:</label>
            <select id="status" name="status" value={selectedStatus} onChange={handleStatusChange}>
                <option value="">Todas</option>
                {/* Mapeamento: Ativo -> ativa, Pendente -> Em Aberto, Concluído -> concluida */}
                <option value="ativa">Ativo</option> 
                <option value="Em Aberto">Pendente</option> {/* Usando 'Em Aberto' para Pendente */} 
                <option value="concluida">Concluído</option>
                {/* Adicionar outras opções se necessário, ex: Em Andamento, Cancelada */}
                {/* <option value="Em Andamento">Em Andamento</option> */}
                {/* <option value="Cancelada">Cancelada</option> */}
            </select>

            {/* Filtro de Ordenação - Texto 'Exemplo' removido */}
            <label htmlFor="sort">Ordenar por:</label>
            <select id="sort" name="sort" onChange={handleSortChange} defaultValue={initialFilters?.sortBy || 'data_abertura_desc'}>
                <option value="data_abertura_desc">Mais Recente</option>
                <option value="data_abertura_asc">Mais Antiga</option>
                <option value="proximo_prazo">Próximo Prazo</option> 
                <option value="orgao_az">Órgão (A-Z)</option>
                <option value="cidade_az">Cidade (A-Z)</option>
            </select>
        </div>
    );
}

export default Filters;

