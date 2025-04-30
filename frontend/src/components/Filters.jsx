import React, { useState, useEffect } from 'react';
import { licitacoesService } from '../services/api'; // Supondo que você tenha um serviço para buscar empresas

function Filters({ onSortChange, onFilterChange }) { 
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState('');

    // Simulação: Buscar lista de empresas para o filtro
    // Em um cenário real, buscaria da API
    useEffect(() => {
        // Exemplo: Chamar um serviço api.get('/empresas')
        const fetchEmpresas = async () => {
            try {
                // Substituir por chamada real à API para buscar empresas
                // const response = await api.get('/empresas'); 
                // if (response.data.success) { setEmpresas(response.data.data); }
                const dadosEmpresasExemplo = [
                    { id: 1, nome_fantasia: 'Empresa A' },
                    { id: 2, nome_fantasia: 'Empresa B' },
                    { id: 3, nome_fantasia: 'Empresa C' },
                ];
                setEmpresas(dadosEmpresasExemplo);
            } catch (error) {
                console.error("Erro ao buscar empresas:", error);
            }
        };
        fetchEmpresas();
    }, []);

    const handleEmpresaChange = (event) => {
        const empresaId = event.target.value;
        setSelectedEmpresa(empresaId);
        onFilterChange({ empresaId: empresaId }); // Atualiza o filtro no componente pai
    };

    return (
        <div className="filters">
            {/* Filtro por Empresa */}
            <label htmlFor="empresa">Empresa:</label>
            <select id="empresa" name="empresa" value={selectedEmpresa} onChange={handleEmpresaChange}>
                <option value="">Todas</option>
                {empresas.map(empresa => (
                    <option key={empresa.id} value={empresa.id}>
                        {empresa.nome_fantasia}
                    </option>
                ))}
            </select>

            {/* Filtro de Ordenação */}
            <label htmlFor="sort">Ordenar por:</label>
            <select id="sort" name="sort" onChange={onSortChange}>
                <option value="data_abertura_desc">Mais Recente</option>
                <option value="data_abertura_asc">Mais Antiga</option>
                <option value="proximo_prazo">Próximo Prazo (Exemplo)</option> 
                <option value="orgao_az">Órgão (A-Z)</option>
                <option value="cidade_az">Cidade (A-Z)</option>
            </select>
            {/* Adicionar mais filtros aqui se necessário */}
        </div>
    );
}

export default Filters;

