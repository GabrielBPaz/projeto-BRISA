import React, { useState } from 'react';

function PrazosForm({ licitacaoId, prazosAtuais, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    data_abertura: prazosAtuais?.data_abertura ? new Date(prazosAtuais.data_abertura).toISOString().split('T')[0] : '',
    data_encerramento: prazosAtuais?.data_encerramento ? new Date(prazosAtuais.data_encerramento).toISOString().split('T')[0] : '',
    proxima_entrega: prazosAtuais?.proxima_entrega ? new Date(prazosAtuais.proxima_entrega).toISOString().split('T')[0] : '',
    prazo_vigencia: prazosAtuais?.prazo_vigencia || '',
    observacoes: prazosAtuais?.observacoes || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar data de abertura
    if (!formData.data_abertura) {
      newErrors.data_abertura = 'Data de abertura é obrigatória';
    }
    
    // Validar data de encerramento (se fornecida, deve ser posterior à data de abertura)
    if (formData.data_encerramento && formData.data_abertura) {
      const abertura = new Date(formData.data_abertura);
      const encerramento = new Date(formData.data_encerramento);
      
      if (encerramento < abertura) {
        newErrors.data_encerramento = 'Data de encerramento deve ser posterior à data de abertura';
      }
    }
    
    // Validar próxima entrega (se fornecida, deve ser posterior à data atual)
    if (formData.proxima_entrega) {
      const hoje = new Date();
      const proximaEntrega = new Date(formData.proxima_entrega);
      
      if (proximaEntrega < hoje) {
        newErrors.proxima_entrega = 'Próxima entrega deve ser uma data futura';
      }
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
      await onSubmit({
        ...formData,
        licitacao_id: parseInt(licitacaoId)
      });
    } catch (error) {
      console.error('Erro ao atualizar prazos:', error);
      setErrors({ submit: 'Erro ao atualizar os prazos. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="prazos-form-container">
      <h2>Atualizar Prazos da Licitação</h2>
      
      <form onSubmit={handleSubmit} className="prazos-form">
        <div className="form-group">
          <label htmlFor="data_abertura">Data de Abertura*</label>
          <input
            type="date"
            id="data_abertura"
            name="data_abertura"
            value={formData.data_abertura}
            onChange={handleChange}
            className={errors.data_abertura ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.data_abertura && <span className="error-message">{errors.data_abertura}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="data_encerramento">Data de Encerramento</label>
          <input
            type="date"
            id="data_encerramento"
            name="data_encerramento"
            value={formData.data_encerramento}
            onChange={handleChange}
            className={errors.data_encerramento ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.data_encerramento && <span className="error-message">{errors.data_encerramento}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="proxima_entrega">Próxima Entrega</label>
          <input
            type="date"
            id="proxima_entrega"
            name="proxima_entrega"
            value={formData.proxima_entrega}
            onChange={handleChange}
            className={errors.proxima_entrega ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.proxima_entrega && <span className="error-message">{errors.proxima_entrega}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="prazo_vigencia">Prazo de Vigência (em dias)</label>
          <input
            type="number"
            id="prazo_vigencia"
            name="prazo_vigencia"
            value={formData.prazo_vigencia}
            onChange={handleChange}
            min="1"
            className={errors.prazo_vigencia ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.prazo_vigencia && <span className="error-message">{errors.prazo_vigencia}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea
            id="observacoes"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows="4"
            className={errors.observacoes ? 'error' : ''}
            disabled={isSubmitting}
          ></textarea>
          {errors.observacoes && <span className="error-message">{errors.observacoes}</span>}
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
            {isSubmitting ? 'Salvando...' : 'Atualizar Prazos'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PrazosForm;
