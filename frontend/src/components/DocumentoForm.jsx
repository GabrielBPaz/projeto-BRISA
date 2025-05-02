import React, { useState } from 'react';

function DocumentoForm({ licitacaoId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'contrato', // Valor padrão
    descricao: '',
    licitacao_id: licitacaoId
  });
  
  const [arquivo, setArquivo] = useState(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setArquivo(file);
    
    // Limpar erro do arquivo quando o usuário seleciona um novo
    if (errors.arquivo) {
      setErrors(prev => ({
        ...prev,
        arquivo: null
      }));
    }
    
    // Preencher automaticamente o nome do documento com o nome do arquivo
    if (file && !formData.nome) {
      // Remover a extensão do arquivo para o nome
      const fileName = file.name.split('.').slice(0, -1).join('.');
      setFormData(prev => ({
        ...prev,
        nome: fileName
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do documento é obrigatório';
    }
    
    if (!formData.tipo) {
      newErrors.tipo = 'Tipo do documento é obrigatório';
    }
    
    if (!arquivo) {
      newErrors.arquivo = 'Arquivo é obrigatório';
    } else if (arquivo.size > 10 * 1024 * 1024) { // 10MB
      newErrors.arquivo = 'O arquivo deve ter no máximo 10MB';
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
      // Criar FormData para envio do arquivo
      const formDataToSend = new FormData();
      formDataToSend.append('arquivo', arquivo);
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('tipo', formData.tipo);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('licitacao_id', licitacaoId);
      
      await onSubmit(formDataToSend);
    } catch (error) {
      console.error('Erro ao anexar documento:', error);
      setErrors({ submit: 'Erro ao anexar o documento. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="documento-form-container">
      <h2>Anexar Novo Documento</h2>
      
      <form onSubmit={handleSubmit} className="documento-form">
        <div className="form-group">
          <label htmlFor="arquivo">Selecionar Arquivo*</label>
          <input
            type="file"
            id="arquivo"
            name="arquivo"
            onChange={handleFileChange}
            className={errors.arquivo ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.arquivo && <span className="error-message">{errors.arquivo}</span>}
          <small>Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (máx. 10MB)</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="nome">Nome do Documento*</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={errors.nome ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.nome && <span className="error-message">{errors.nome}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="tipo">Tipo de Documento*</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className={errors.tipo ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="contrato">Contrato</option>
            <option value="edital">Edital</option>
            <option value="proposta">Proposta</option>
            <option value="nota_fiscal">Nota Fiscal</option>
            <option value="termo_aditivo">Termo Aditivo</option>
            <option value="ata">Ata</option>
            <option value="ata">Foto</option>
            <option value="outro">Outro</option>
          </select>
          {errors.tipo && <span className="error-message">{errors.tipo}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
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
            {isSubmitting ? 'Enviando...' : 'Anexar Documento'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DocumentoForm;
