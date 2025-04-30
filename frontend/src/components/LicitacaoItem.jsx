import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link para navegação

function LicitacaoItem({ id, orgao, cidadeUF, proximaEntrega, status, empresa }) {
    return (
        // Envolver o item com Link para torná-lo clicável
        <Link to={`/licitacoes/${id}`} className="licitacao-item-link">
            <div className="licitacao-item">
                <div className="licitacao-info">
                    <h3>{orgao}</h3>
                    <p>{cidadeUF}</p>
                    <p>Empresa: {empresa}</p> 
                </div>
                <div className="licitacao-status">
                    <p>Status: <span className={`status-${status?.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span></p>
                    <p>Próxima Abertura/Entrega: {proximaEntrega}</p>
                </div>
            </div>
        </Link>
    );
}

export default LicitacaoItem;