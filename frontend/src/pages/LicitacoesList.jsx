import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Filters from '../components/Filters';
import LicitacaoItem from '../components/LicitacaoItem';
import FAB from '../components/FAB';

function LicitacoesList() {
    // Estado para armazenar as licitações (viria de uma API)
    const [licitacoes, setLicitacoes] = useState([]);
    const [sortBy, setSortBy] = useState('proximo_prazo'); // Estado para o filtro

    // Simulação de carregamento de dados
    useEffect(() => {
        // Lógica para buscar licitações da API baseada no 'sortBy'
        console.log(`Buscando licitações ordenadas por: ${sortBy}`);
        // Exemplo de dados estáticos:
        const dadosExemplo = [
            { id: 1, orgao: 'Prefeitura Municipal de Exemplo', cidadeUF: 'Exemplo / SP', proximaEntrega: '30/04/2025' },
            { id: 2, orgao: 'Secretaria Estadual de Obras', cidadeUF: 'Outro Exemplo / RJ', proximaEntrega: '05/05/2025' },
            { id: 3, orgao: 'Tribunal de Contas da União', cidadeUF: 'Brasília / DF', proximaEntrega: '10/05/2025' },
        ];
        // Adicionar lógica de ordenação aqui baseada no sortBy antes de setLicitacoes
        setLicitacoes(dadosExemplo);
    }, [sortBy]); // Re-executa quando sortBy muda

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

     const handleAddClick = () => {
        console.log('Adicionar Nova Licitação Clicado!');
        // Lógica para abrir modal ou navegar para tela de adição
    };

    return (
        <Layout>
            <h1>Licitações</h1>

            <Filters onSortChange={handleSortChange} />

            <div className="licitacoes-list">
                {licitacoes.length > 0 ? (
                    licitacoes.map(lic => (
                        <LicitacaoItem
                            key={lic.id} // Key é importante para listas no React
                            id={lic.id}
                            orgao={lic.orgao}
                            cidadeUF={lic.cidadeUF}
                            proximaEntrega={lic.proximaEntrega}
                        />
                    ))
                ) : (
                    <p>Nenhuma licitação encontrada.</p>
                )}
            </div>

            <FAB title="Adicionar Nova Licitação" onClick={handleAddClick} />
        </Layout>
    );
}

export default LicitacoesList;