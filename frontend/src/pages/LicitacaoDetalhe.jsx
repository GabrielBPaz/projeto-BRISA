import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import FAB from '../components/FAB';
import EmpenhoForm from '../components/EmpenhoForm';
import PrazosForm from '../components/PrazosForm';
import DocumentoForm from '../components/DocumentoForm';
import ComentarioForm from '../components/ComentarioForm'; // Importar o formulário de comentário
import { licitacoesService } from '../services/api';
import Modal from 'react-modal';

// Configurar o elemento raiz para o react-modal
Modal.setAppElement('#root');

function LicitacaoDetalhe() {
    const { id } = useParams();
    const [licitacao, setLicitacao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('detalhes');
    const [isEmpenhoModalOpen, setIsEmpenhoModalOpen] = useState(false);
    const [isPrazosModalOpen, setIsPrazosModalOpen] = useState(false);
    const [isDocumentoModalOpen, setIsDocumentoModalOpen] = useState(false);
    const [isComentarioModalOpen, setIsComentarioModalOpen] = useState(false); // Estado para o modal de comentário

    // Função para buscar detalhes da licitação
    const fetchLicitacaoDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await licitacoesService.getLicitacaoById(id);
            if (response.success) {
                setLicitacao(response.data);
            } else {
                setError(response.message || 'Erro ao buscar detalhes da licitação');
            }
        } catch (err) {
            console.error(`Erro ao buscar detalhes da licitação ${id}:`, err);
            // Verifica se o erro é 403 (Forbidden)
            if (err.response && err.response.status === 403) {
                setError("Acesso negado. Você não tem permissão para visualizar esta licitação.");
            } else {
                setError("Falha ao buscar detalhes da licitação. Verifique sua conexão ou tente novamente.");
            }
        }
        setLoading(false);
    };

    // Buscar detalhes ao montar o componente
    useEffect(() => {
        fetchLicitacaoDetails();
    }, [id]);

    // --- Handlers para Ações ---
    const handleAddEmpenhoClick = () => setIsEmpenhoModalOpen(true);
    const handleCloseEmpenhoModal = () => setIsEmpenhoModalOpen(false);
    const handleUpdatePrazosClick = () => setIsPrazosModalOpen(true);
    const handleClosePrazosModal = () => setIsPrazosModalOpen(false);
    const handleAttachDocumentClick = () => setIsDocumentoModalOpen(true);
    const handleCloseDocumentoModal = () => setIsDocumentoModalOpen(false);
    const handleAddCommentClick = () => setIsComentarioModalOpen(true); // Abrir modal de comentário
    const handleCloseComentarioModal = () => setIsComentarioModalOpen(false); // Fechar modal de comentário

    const handleEmpenhoSubmit = async (empenhoData) => {
        try {
            const response = await licitacoesService.adicionarEmpenho(id, empenhoData);
            if (response.success || response.id) {
                handleCloseEmpenhoModal();
                fetchLicitacaoDetails();
                setActiveTab('empenhos');
            } else {
                console.error("Erro ao adicionar empenho:", response.message);
                alert(response.message || "Erro ao salvar empenho.");
            }
        } catch (error) {
            console.error("Erro ao submeter empenho:", error);
            alert("Falha na comunicação ao salvar empenho.");
        }
    };

    const handlePrazosSubmit = async (prazosData) => {
        try {
            const response = await licitacoesService.atualizarPrazos(id, prazosData);
            if (response.success) {
                handleClosePrazosModal();
                fetchLicitacaoDetails();
                setActiveTab('detalhes');
            } else {
                console.error("Erro ao atualizar prazos:", response.message);
                alert(response.message || "Erro ao atualizar prazos.");
            }
        } catch (error) {
            console.error("Erro ao submeter prazos:", error);
            alert("Falha na comunicação ao atualizar prazos.");
        }
    };

    const handleDocumentoSubmit = async (formData) => {
        try {
            const response = await licitacoesService.anexarDocumento(id, formData);
            if (response.success) {
                handleCloseDocumentoModal();
                fetchLicitacaoDetails();
                setActiveTab('documentos');
            } else {
                console.error("Erro ao anexar documento:", response.message);
                alert(response.message || "Erro ao anexar documento.");
            }
        } catch (error) {
            console.error("Erro ao submeter documento:", error);
            alert("Falha na comunicação ao anexar documento.");
        }
    };

    const handleComentarioSubmit = async (comentarioData) => {
        try {
            const response = await licitacoesService.adicionarComentario(id, comentarioData);
            if (response.success) {
                handleCloseComentarioModal();
                fetchLicitacaoDetails();
                setActiveTab('comentarios');
            } else {
                console.error("Erro ao adicionar comentário:", response.message);
                alert(response.message || "Erro ao adicionar comentário.");
            }
        } catch (error) {
            console.error("Erro ao submeter comentário:", error);
            alert("Falha na comunicação ao adicionar comentário.");
        }
    };

    const handleFabClick = () => {
        // Menu de opções ou ação padrão
        console.log("FAB Clicado - Implementar menu de opções");
    };

    // --- Renderização ---
    if (loading) {
        return <Layout><p>Carregando detalhes da licitação...</p></Layout>;
    }

    if (error) {
        return <Layout><p style={{ color: 'red' }}>Erro: {error}</p></Layout>;
    }

    if (!licitacao) {
        return <Layout><p>Licitação não encontrada.</p></Layout>;
    }

    return (
        <Layout>
            <div className="licitacao-detalhe-header">
                <h1>Licitação: {licitacao.numero_processo || `#${licitacao.id}`}</h1>
                <div className={`status-badge status-${licitacao.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {licitacao.status || 'Status não informado'}
                </div>
            </div>

            {/* Navegação por abas */}
            <div className="tabs">
                <button className={activeTab === 'detalhes' ? 'active' : ''} onClick={() => setActiveTab('detalhes')}>Detalhes</button>
                <button className={activeTab === 'empenhos' ? 'active' : ''} onClick={() => setActiveTab('empenhos')}>Empenhos</button>
                <button className={activeTab === 'documentos' ? 'active' : ''} onClick={() => setActiveTab('documentos')}>Documentos</button>
                <button className={activeTab === 'comentarios' ? 'active' : ''} onClick={() => setActiveTab('comentarios')}>Comentários</button>
            </div>

            {/* Conteúdo das Abas */} 
            <div className="tab-content">
                {/* Aba Detalhes */} 
                {activeTab === 'detalhes' && (
                    <div className="licitacao-details">
                        <div className="detail-section">
                            <h2>Informações Gerais</h2>
                            <p><strong>Órgão Público:</strong> {licitacao.orgao?.nome || 'Não informado'}</p>
                            <p><strong>Empresa:</strong> {licitacao.empresa?.nome_fantasia || 'Não informada'}</p>
                            <p><strong>Número do Processo:</strong> {licitacao.numero_processo || 'Não informado'}</p>
                            <p><strong>Modalidade:</strong> {licitacao.modalidade || 'Não informada'}</p>
                            <p><strong>Objeto:</strong> {licitacao.objeto || 'Não informado'}</p>
                            <p><strong>Data de Abertura:</strong> {licitacao.data_abertura ? new Date(licitacao.data_abertura).toLocaleDateString() : 'Não informada'}</p>
                            <p><strong>Data de Encerramento:</strong> {licitacao.data_encerramento ? new Date(licitacao.data_encerramento).toLocaleDateString() : 'Não informada'}</p>
                            <p><strong>Valor Estimado:</strong> {licitacao.valor_estimado ? `R$ ${parseFloat(licitacao.valor_estimado).toFixed(2).replace('.', ',')}` : 'Não informado'}</p>
                        </div>
                        <div className="detail-section">
                            <h2>Prazos e Datas</h2>
                            <p><strong>Próxima Entrega:</strong> {licitacao.proxima_entrega ? new Date(licitacao.proxima_entrega).toLocaleDateString() : 'Não informada'}</p>
                            <p><strong>Prazo de Vigência:</strong> {licitacao.prazo_vigencia ? `${licitacao.prazo_vigencia} dias` : 'Não informado'}</p>
                            <p><strong>Observações:</strong> {licitacao.observacoes || 'Nenhuma observação'}</p>
                            <button className="action-button" onClick={handleUpdatePrazosClick}>Atualizar Prazos</button>
                        </div>
                    </div>
                )}

                {/* Aba Empenhos */} 
                {activeTab === 'empenhos' && (
                    <div>
                        <h2>Empenhos</h2>
                        {licitacao.empenhos && licitacao.empenhos.length > 0 ? (
                            <div className="empenhos-list">
                                {licitacao.empenhos.map(empenho => (
                                    <div key={empenho.id} className="empenho-item">
                                        <p><strong>Número:</strong> {empenho.numero}</p>
                                        <p><strong>Data:</strong> {new Date(empenho.data).toLocaleDateString()}</p>
                                        <p><strong>Valor:</strong> R$ {parseFloat(empenho.valor).toFixed(2).replace('.', ',')}</p>
                                        <p><strong>Descrição:</strong> {empenho.descricao}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Nenhum empenho registrado para esta licitação.</p>
                        )}
                        <button className="action-button" onClick={handleAddEmpenhoClick}>Adicionar Novo Empenho</button>
                    </div>
                )}

                {/* Aba Documentos */} 
                {activeTab === 'documentos' && (
                    <div>
                        <h2>Documentos</h2>
                        {licitacao.Documentos && licitacao.Documentos.length > 0 ? (
                            <div className="documentos-list">
                                {licitacao.Documentos.map(doc => (
                                    <div key={doc.id} className="documento-item">
                                        <p><strong>Nome:</strong> {doc.nome}</p>
                                        <p><strong>Tipo:</strong> {doc.tipo}</p>
                                        <p><strong>Data de Upload:</strong> {new Date(doc.data_upload).toLocaleDateString()}</p>
                                        {/* Ajustar a URL conforme a configuração do backend para servir arquivos estáticos */}
                                        <a href={`http://localhost:3001/${doc.caminho_arquivo}`} target="_blank" rel="noopener noreferrer">Visualizar</a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Nenhum documento anexado a esta licitação.</p>
                        )}
                        <button className="action-button" onClick={handleAttachDocumentClick}>Anexar Novo Documento</button>
                    </div>
                )}

                {/* Aba Comentários */} 
                {activeTab === 'comentarios' && (
                    <div>
                        <h2>Comentários</h2>
                        {licitacao.Comentarios && licitacao.Comentarios.length > 0 ? (
                            <div className="comentarios-list">
                                {licitacao.Comentarios.map(comentario => (
                                    <div key={comentario.id} className="comentario-item">
                                        <div className="comentario-header">
                                            <span className="comentario-autor">{comentario.Usuario?.nome || 'Usuário'}</span>
                                            <span className="comentario-data">{new Date(comentario.data).toLocaleString()}</span>
                                        </div>
                                        <div className="comentario-texto">{comentario.texto}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Nenhum comentário para esta licitação.</p>
                        )}
                        <button className="action-button" onClick={handleAddCommentClick}>Adicionar Comentário</button>
                    </div>
                )}
            </div>

            <FAB title="Adicionar Item" onClick={handleFabClick} />

            {/* Modal para Adicionar Empenho */}
            <Modal
                isOpen={isEmpenhoModalOpen}
                onRequestClose={handleCloseEmpenhoModal}
                contentLabel="Adicionar Novo Empenho"
                className="modal"
                overlayClassName="overlay"
            >
                <EmpenhoForm 
                    licitacaoId={id} 
                    onSubmit={handleEmpenhoSubmit} 
                    onCancel={handleCloseEmpenhoModal} 
                />
            </Modal>

            {/* Modal para Atualizar Prazos */}
            <Modal
                isOpen={isPrazosModalOpen}
                onRequestClose={handleClosePrazosModal}
                contentLabel="Atualizar Prazos"
                className="modal"
                overlayClassName="overlay"
            >
                <PrazosForm 
                    licitacaoId={id}
                    prazosAtuais={licitacao}
                    onSubmit={handlePrazosSubmit} 
                    onCancel={handleClosePrazosModal} 
                />
            </Modal>

            {/* Modal para Anexar Documento */}
            <Modal
                isOpen={isDocumentoModalOpen}
                onRequestClose={handleCloseDocumentoModal}
                contentLabel="Anexar Novo Documento"
                className="modal"
                overlayClassName="overlay"
            >
                <DocumentoForm 
                    licitacaoId={id}
                    onSubmit={handleDocumentoSubmit} 
                    onCancel={handleCloseDocumentoModal} 
                />
            </Modal>

            {/* Modal para Adicionar Comentário */}
            <Modal
                isOpen={isComentarioModalOpen}
                onRequestClose={handleCloseComentarioModal}
                contentLabel="Adicionar Comentário"
                className="modal"
                overlayClassName="overlay"
            >
                <ComentarioForm 
                    licitacaoId={id}
                    onSubmit={handleComentarioSubmit} 
                    onCancel={handleCloseComentarioModal} 
                />
            </Modal>
        </Layout>
    );
}

export default LicitacaoDetalhe;
