import React from 'react';
import Sidebar from './Sidebar';

// Este componente envolve as páginas que precisam da sidebar
function Layout({ children }) {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                {children} {/* Aqui entra o conteúdo específico da página */}
            </main>
        </div>
    );
}

export default Layout;