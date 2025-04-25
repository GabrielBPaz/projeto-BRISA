import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para pegar o ID da URL
import Layout from '../components/Layout';
import FAB from '../components/FAB';

function LicitacaoDetalhe() {
    const { id } = useParams(); // Pega o 'id' da URL (definido na rota)
    const [licitacao, setLicitacao] = useState(null); // Estado para os detalhes

    // Simulação de carregamento de dados para UM item
    useEffect(() => {
        // Lógica para buscar os detalhes da licitação com o 'id' da API
        console.log(`Buscando detalhes da licitação ID: ${id}`);
        // Exemplo de dados estáticos:
        const dadosExemplo = {
            id: id,
            orgao: 'Prefeitura Municipal de Exemplo',
            numeroProcesso: '2025/001-ABC',
            modalidade: 'Pregão Eletrônico',
            objeto: 'Contratação de empresa para fornecimento de material de escritório.',
            dataAbertura: '15/04/2025',
            proximoPrazo: '30/04/2025 - Envio de Proposta',
            status: 'Em Andamento',
            cidadeUF: 'Exemplo / SP',
            valorEstimado: 'R$ 50.000,00'
        };
        setLicitacao(dadosExemplo);
    }, [id]); // Re-executa quando o ID da URL muda

     const handleAddActionClick = (actionType) => {
        console.log(`Adicionar ${actionType} Clicado para Licitação ID: ${id}`);
        // Lógica para adicionar empenho, documento, etc.
    };

     const handleFabClick = () => {
        console.log('FAB de Adicionar Item Clicado!');
         // Pode abrir um menu ou modal para escolher o que adicionar
     };


    if (!licitacao) {
        return <Layout><p>Carregando detalhes da licitação...</p></Layout>;
    }

    return (
        <Layout>
            <h1>Detalhes da Licitação: #{licitacao.numeroProcesso || licitacao.id}</h1>

            <div className="licitacao-details">
                <p><strong>Órgão Público:</strong> {licitacao.orgao}</p>
                <p><strong>Número do Processo:</strong> {licitacao.numeroProcesso}</p>
                <p><strong>Modalidade:</strong> {licitacao.modalidade}</p>
                <p><strong>Objeto:</strong> {licitacao.objeto}</p>
                <p><strong>Data de Abertura:</strong> {licitacao.dataAbertura}</p>
                <p><strong>Próxima Entrega/Prazo:</strong> {licitacao.proximoPrazo}</p>
                <p><strong>Status:</strong> {licitacao.status}</p>
                <p><strong>Cidade/UF:</strong> {licitacao.cidadeUF}</p>
                <p><strong>Valor Estimado:</strong> {licitacao.valorEstimado}</p>
                {/* Adicionar mais campos conforme necessário */}
            </div>

            <div className="actions-section">
                <h2>Adicionar à Licitação:</h2>
                <button onClick={() => handleAddActionClick('Empenho')}>Novo Empenho</button>
                <button onClick={() => handleAddActionClick('Documento')}>Anexar Documento</button>
                <button onClick={() => handleAddActionClick('Comentário')}>Adicionar Comentário</button>
                <button onClick={() => handleAddActionClick('Evento')}>Registrar Evento</button>
            </div>

            {/* Aqui podem entrar seções para listar os empenhos, documentos, etc. */}

            <FAB title="Adicionar Item (Empenho, Documento, etc.)" onClick={handleFabClick} />
        </Layout>
    );
}

export default LicitacaoDetalhe;