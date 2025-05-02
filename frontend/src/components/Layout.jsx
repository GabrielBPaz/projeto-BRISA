import React, { useState } from 'react';
import Sidebar from './Sidebar';
import FAB from './FAB'; // Importar o FAB
import NovaLicitacaoModal from './NovaLicitacaoModal'; // Importar o Modal
import { licitacoesService } from '../services/api'; // Importar o serviço da API

// Este componente envolve as páginas que precisam da sidebar
function Layout({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Função para lidar com a submissão do formulário do modal
    const handleNovaLicitacaoSubmit = async (formData) => {
        console.log("Enviando dados da nova licitação para a API:", formData);
        try {
            const response = await licitacoesService.criarLicitacao(formData);
            if (response.id || response.success) { // Ajustar condição conforme a resposta real da API
                console.log("Licitação criada com sucesso:", response.data || response);
                alert("Licitação criada com sucesso!");
                closeModal();
                // Opcional: Atualizar a lista de licitações ou redirecionar
                // window.location.reload(); 
            } else {
                console.error("Erro ao criar licitação (resposta da API):");
                alert(response.message || "Erro ao criar licitação. Verifique os dados e tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao submeter nova licitação (catch):");
            let errorMessage = "Falha na comunicação ao criar licitação.";
            if (error.response && error.response.data && error.response.data.erro) {
                errorMessage = error.response.data.erro; // Usar mensagem de erro do backend se disponível
            }
            alert(errorMessage);
        }
    };

    return (
        <div className="app-container" style={{ display: 'flex', position: 'relative', minHeight: '100vh' }}> {/* Adicionado display flex e position relative */}
            <Sidebar />
            <main className="main-content" style={{ flexGrow: 1, padding: '20px' }}> {/* Adicionado padding e flexGrow */}
                {children} {/* Aqui entra o conteúdo específico da página */}
            </main>
            
            {/* Botão FAB para abrir o modal */}
            <FAB title="Adicionar Nova Licitação" onClick={openModal} />

            {/* Modal para adicionar nova licitação */}
            <NovaLicitacaoModal 
                isOpen={isModalOpen} 
                onRequestClose={closeModal} 
                onSubmit={handleNovaLicitacaoSubmit} 
            />
        </div>
    );
}

export default Layout;

