import React from 'react';
import { Link } from 'react-router-dom';

// Recebe dados da licitação como props
function LicitacaoItem({ id, orgao, cidadeUF, proximaEntrega }) {
    return (
        // Link para a página de detalhes, passando o ID na URL
        <Link to={`/licitacoes/${id}`} className="licitacao-item">
            <div className="info">
                <strong>{orgao}</strong>
                <span>{cidadeUF}</span>
            </div>
            <div className="prazo">
                <strong>Próxima Entrega:</strong>
                <span>{proximaEntrega}</span>
            </div>
        </Link>
    );
}

export default LicitacaoItem;