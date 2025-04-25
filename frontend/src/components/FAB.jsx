import React from 'react';

function FAB({ title, onClick }) {
    return (
        <button className="fab" title={title} onClick={onClick}>
            +
        </button>
    );
}

export default FAB;