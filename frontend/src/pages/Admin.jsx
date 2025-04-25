import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import UserItem from '../components/UserItem';
import FAB from '../components/FAB';

function Admin() {
    const [users, setUsers] = useState([]);

    // Simulação de carregamento de dados
    useEffect(() => {
        // Lógica para buscar usuários da API
        console.log('Buscando usuários...');
        const dadosExemplo = [
            { id: 1, nome: 'Nome Completo do Funcionário', email: 'funcionario@empresa.com', permissao: 'Admin' },
            { id: 2, nome: 'Outro Usuário', email: 'outro.usuario@empresa.com', permissao: 'Usuário Padrão' },
        ];
        setUsers(dadosExemplo);
    }, []);

    const handleAddUserClick = () => {
        console.log('Adicionar Novo Usuário Clicado!');
        // Lógica para abrir modal ou navegar para tela de adição de usuário
    };

    return (
        <Layout>
            <h1>Administração</h1>
            <p>Gerenciamento de usuários do sistema.</p>

            <div className="user-list">
                {users.length > 0 ? (
                    users.map(user => (
                        <UserItem
                            key={user.id}
                            nome={user.nome}
                            email={user.email}
                            permissao={user.permissao}
                        />
                    ))
                ) : (
                    <p>Nenhum usuário encontrado.</p>
                )}
            </div>

            <FAB title="Adicionar Novo Usuário" onClick={handleAddUserClick} />
        </Layout>
    );
}

export default Admin;