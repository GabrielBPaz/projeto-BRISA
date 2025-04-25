import React from 'react';

function Filters({ onSortChange }) { // Recebe função para lidar com mudança
    return (
        <div className="filters">
            <label htmlFor="sort">Ordenar por:</label>
            <select id="sort" name="sort" onChange={onSortChange}>
                <option value="proximo_prazo">Próximo Prazo</option>
                <option value="mais_nova">Mais Nova</option>
                <option value="mais_antiga">Mais Antiga</option>
                <option value="orgao_az">Órgão (A-Z)</option>
                <option value="cidade_az">Cidade (A-Z)</option>
            </select>
            {/* Adicionar mais filtros aqui se necessário */}
        </div>
    );
}

export default Filters;