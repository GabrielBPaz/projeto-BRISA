import React, { useState, useEffect } from 'react';

// Lista de UFs para o dropdown
const ufs = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR",
  "SC", "SP", "SE", "TO"
];

function EmpenhoForm({ licitacaoId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    numero: '',
    data: '',
    valor: '',
    descricao: '', // Mantido no estado local, mas não enviado
    cidade: '', // Novo campo Cidade
    uf: '',     // Novo campo UF
    licitacao_id: licitacaoId
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resetar form quando abrir/fechar (opcional, mas boa prática)
  useEffect(() => {
    setFormData({
        numero: '',
        data: '',
        valor: '',
        descricao: '',
        cidade: '',
        uf: '',
        licitacao_id: licitacaoId
    });
    setErrors({});
  }, [licitacaoId]); // Resetar se o licitacaoId mudar (caso o modal seja reutilizado)

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
    const valorNumerico = parseFloat(formData.valor.replace(',', '.'));
    if (!formData.valor || isNaN(valorNumerico)) {
      newErrors.valor = 'Valor válido é obrigatório';
    }
    if (!formData.cidade.trim()) { // Validação Cidade
        newErrors.cidade = 'Cidade é obrigatória';
    }
    if (!formData.uf) { // Validação UF
        newErrors.uf = 'UF é obrigatória';
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
      // Mapear os nomes dos campos e incluir cidade/uf
      const empenhoDataParaEnviar = {
        numero_empenho: formData.numero,
        data_empenho: formData.data,
        valor_empenhado: parseFloat(formData.valor.replace(',', '.')), // Garantir que o valor seja numérico
        cidade: formData.cidade, // Incluir cidade
        uf: formData.uf,         // Incluir UF
        licitacao_id: parseInt(licitacaoId)
        // O campo 'descricao' não é enviado
      };

      await onSubmit(empenhoDataParaEnviar); // Enviar os dados mapeados
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
        {/* Número e Data */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', gap: '10px' }}>
            <div style={{ width: '48%' }}>
                <label htmlFor="numero">Número do Empenho*</label>
                <input
                    type="text"
                    id="numero"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className={errors.numero ? 'error' : ''}
                    disabled={isSubmitting}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
                {errors.numero && <span className="error-message" style={{ color: 'red', fontSize: '0.8em' }}>{errors.numero}</span>}
            </div>
            <div style={{ width: '48%' }}>
                <label htmlFor="data">Data do Empenho*</label>
                <input
                    type="date"
                    id="data"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    className={errors.data ? 'error' : ''}
                    disabled={isSubmitting}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
                {errors.data && <span className="error-message" style={{ color: 'red', fontSize: '0.8em' }}>{errors.data}</span>}
            </div>
        </div>

        {/* Valor */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
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
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.valor && <span className="error-message" style={{ color: 'red', fontSize: '0.8em' }}>{errors.valor}</span>}
        </div>

        {/* Cidade e UF */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', gap: '10px' }}>
          <div style={{ width: '70%' }}>
            <label htmlFor="cidade">Cidade (Entrega)*</label>
            <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className={errors.cidade ? 'error' : ''}
                disabled={isSubmitting}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
            {errors.cidade && <span className="error-message" style={{ color: 'red', fontSize: '0.8em' }}>{errors.cidade}</span>}
          </div>
          <div style={{ width: '25%' }}>
            <label htmlFor="uf">UF*</label>
            <select
                id="uf"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                className={errors.uf ? 'error' : ''}
                disabled={isSubmitting}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">UF</option>
              {ufs.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
            {errors.uf && <span className="error-message" style={{ color: 'red', fontSize: '0.8em' }}>{errors.uf}</span>}
          </div>
        </div>

        {/* Descrição (Opcional, não salva no DB) */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="descricao">Descrição (Opcional)</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="3"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          ></textarea>
        </div>

        {errors.submit && <div className="error-message submit-error" style={{ color: 'red', marginBottom: '15px' }}>{errors.submit}</div>}

        {/* Botões */}
        <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={isSubmitting}
            style={{ padding: '10px 15px' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Empenho'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmpenhoForm;

