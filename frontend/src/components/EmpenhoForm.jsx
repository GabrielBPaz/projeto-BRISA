import React, { useState } from 'react';

function EmpenhoForm({ licitacaoId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    numero: '',
    data: '',
    valor: '',
    descricao: '',
    licitacao_id: licitacaoId
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
    
    if (!formData.numero.trim()) {
      newErrors.numero = 'Número do empenho é obrigatório';
    }
    
    if (!formData.data) {
      newErrors.data = 'Data do empenho é obrigatória';
    }
    
    if (!formData.valor || isNaN(parseFloat(formData.valor))) {
      newErrors.valor = 'Valor válido é obrigatório';
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
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
      // Formatar os dados antes de enviar
      const empenhoData = {
        ...formData,
        valor: parseFloat(formData.valor.replace(',', '.')),
        licitacao_id: parseInt(licitacaoId)
      };
      
      await onSubmit(empenhoData);
    } catch (error) {
      console.error('Erro ao salvar empenho:', error);
      setErrors({ submit: 'Erro ao salvar o empenho. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="empenho-form-container">
      <h2>Adicionar Novo Empenho</h2>
      
      <form onSubmit={handleSubmit} className="empenho-form">
        <div className="form-group">
          <label htmlFor="numero">Número do Empenho*</label>
          <input
            type="text"
            id="numero"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            className={errors.numero ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.numero && <span className="error-message">{errors.numero}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="data">Data do Empenho*</label>
          <input
            type="date"
            id="data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            className={errors.data ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.data && <span className="error-message">{errors.data}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="valor">Valor (R$)*</label>
          <input
            type="text"
            id="valor"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            placeholder="0,00"
            className={errors.valor ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.valor && <span className="error-message">{errors.valor}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="descricao">Descrição*</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="4"
            className={errors.descricao ? 'error' : ''}
            disabled={isSubmitting}
          ></textarea>
          {errors.descricao && <span className="error-message">{errors.descricao}</span>}
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
            {isSubmitting ? 'Salvando...' : 'Salvar Empenho'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmpenhoForm;
