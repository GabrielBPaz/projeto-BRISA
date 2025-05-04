import React from 'react';
import { useNavigate } from 'react-router-dom';

// Adicionamos props 'variant' para cor e 'filterParam' para navegação
function StatCard({ title, value, details, variant = '', filterParam = null }) {
    const navigate = useNavigate();

    // Mapeia variantes para classes CSS
    const variantClass = {
        prazos: 'prazos',
        atraso: 'atraso',
        concluidas: 'concluidas',
    }[variant] || '';

    // Função para navegar ao clicar, se houver filterParam
    const handleClick = () => {
        if (filterParam) {
            // Navega diretamente com o filterParam, que já deve ser o status correto
            navigate(`/licitacoes?status=${filterParam}`);
        }
    };

    // Adiciona cursor pointer e onClick se for clicável
    const cardStyle = {
        cursor: filterParam ? 'pointer' : 'default'
    };

    return (
        <div 
            className={`stat-card ${variantClass}`}
            style={cardStyle}
            onClick={handleClick}
        >
            <h3>{title}</h3>
            <div className="value">{value}</div>
            <div className="details">{details}</div>
        </div>
    );
}

export default StatCard;

