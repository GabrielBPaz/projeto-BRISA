import React from 'react';

// Recebe dados do usuário como props
function UserItem({ nome, email, permissao }) {
    return (
        <div className="user-item">
            <div className="info">
                <strong>{nome}</strong>
                <span>{email}</span>
            </div>
            <div className="permissions">
                <span>{permissao}</span>
            </div>
            {/* Poderia adicionar botões de Editar/Remover aqui */}
        </div>
    );
}

export default UserItem;