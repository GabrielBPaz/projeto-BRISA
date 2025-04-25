import React from 'react';

// Adicionamos uma prop 'variant' para controlar a cor da borda
function StatCard({ title, value, details, variant = '' }) {
    // Mapeia variantes para classes CSS (definidas no style.css)
    const variantClass = {
        prazos: 'prazos',
        atraso: 'atraso',
        concluidas: 'concluidas',
    }[variant] || '';

    return (
        <div className={`stat-card ${variantClass}`}>
            <h3>{title}</h3>
            <div className="value">{value}</div>
            <div className="details">{details}</div>
        </div>
    );
}

export default StatCard;