import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Usamos NavLink para estilo ativo automático

function Sidebar() {
    return (
        <aside className="sidebar">
            <h2>Gestão de Licitações</h2>
            <nav>
                <ul>
                    {/* NavLink adiciona a classe 'active' automaticamente */}
                    <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
                    <li><NavLink to="/licitacoes" className={({ isActive }) => isActive ? "active" : ""}>Licitações</NavLink></li>
                    <li><NavLink to="/relatorios" className={({ isActive }) => isActive ? "active" : ""}>Relatórios</NavLink></li>
                    <li><NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>Administração</NavLink></li>
                </ul>
            </nav>
            {/* Link normal para sair, pode ser um <button> ou <Link> dependendo da lógica de logout */}
            <Link to="/" className="logout-link">Sair</Link>
        </aside>
    );
}

export default Sidebar;