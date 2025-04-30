import React, { useState } from 'react';

function ComentarioForm({ licitacaoId, onSubmit, onCancel }) {
  const [texto, setTexto] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setTexto(e.target.value);
    // Limpar erro ao digitar
    if (errors.texto) {
      setErrors(prev => ({ ...prev, texto: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!texto.trim()) {
      newErrors.texto = 'O comentário não pode estar vazio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ texto, licitacao_id: parseInt(licitacaoId) });
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      setErrors({ submit: 'Erro ao salvar o comentário. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comentario-form-container">
      <h2>Adicionar Comentário</h2>
      <form onSubmit={handleSubmit} className="comentario-form">
        <div className="form-group">
          <label htmlFor="texto">Comentário*</label>
          <textarea
            id="texto"
            name="texto"
            value={texto}
            onChange={handleChange}
            rows="5"
            className={errors.texto ? 'error' : ''}
            disabled={isSubmitting}
            placeholder="Digite seu comentário aqui..."
          ></textarea>
          {errors.texto && <span className="error-message">{errors.texto}</span>}
        </div>
        
        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel} 
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Adicionar Comentário'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ComentarioForm;
