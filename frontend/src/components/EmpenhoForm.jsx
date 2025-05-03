import React, { useState, useEffect } from 'react';

// Lista de UFs para o dropdown
const ufs = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR",
  "SC", "SP", "SE", "TO"
];

// Assume que licitacaoDetalhes contém o endereço do órgão da licitação
function EmpenhoForm({ licitacaoId, licitacaoDetalhes, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    numero: '',
    data: '',
    valor: '',
    // Campos de endereço de entrega
    usarEnderecoLicitacao: true, // Default: usar endereço da licitação
    rua: '',
    numeroEndereco: '', // Renomeado para evitar conflito com 'numero' do empenho
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    licitacao_id: licitacaoId
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Popula campos de endereço se 'usarEnderecoLicitacao' for true e detalhes estiverem disponíveis
  useEffect(() => {
    if (formData.usarEnderecoLicitacao && licitacaoDetalhes?.orgao) {
      // Tenta extrair detalhes do endereço do órgão
      // Idealmente, o backend retornaria o endereço do órgão de forma estruturada
      // Por enquanto, vamos assumir que está no campo 'endereco' como texto e cidade/estado separados
      const orgao = licitacaoDetalhes.orgao;
      // Lógica simples para tentar separar rua/numero/bairro (pode precisar de ajuste)
      const enderecoParts = orgao.endereco?.split(',') || [];
      const rua = enderecoParts[0]?.trim() || '';
      const numeroEndereco = enderecoParts[1]?.trim().match(/\d+/)?.[0] || ''; // Pega apenas números
      const bairroMatch = orgao.endereco?.match(/Bairro:\s*(.*)/i);
      const bairro = bairroMatch ? bairroMatch[1].trim() : '';

      setFormData(prev => ({
        ...prev,
        rua: rua,
        numeroEndereco: numeroEndereco,
        complemento: '', // Complemento não costuma vir no endereço principal
        bairro: bairro,
        cidade: orgao.cidade || '',
        uf: orgao.estado || ''
      }));
    } else if (!formData.usarEnderecoLicitacao) {
      // Limpa campos se mudou para não usar endereço da licitação
      // setFormData(prev => ({ ...prev, rua: '', numeroEndereco: '', complemento: '', bairro: '', cidade: '', uf: '' }));
      // Não limpar automaticamente pode ser melhor UX, deixa o usuário decidir
    }
  }, [formData.usarEnderecoLicitacao, licitacaoDetalhes]);

  // Resetar form quando abrir/fechar
  useEffect(() => {
    setFormData({
        numero: '',
        data: '',
        valor: '',
        usarEnderecoLicitacao: true,
        rua: '',
        numeroEndereco: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        licitacao_id: licitacaoId
    });
    setErrors({});
  }, [licitacaoId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
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

    // Valida endereço apenas se não estiver usando o da licitação
    if (!formData.usarEnderecoLicitacao) {
        if (!formData.rua.trim()) newErrors.rua = 'Rua é obrigatória';
        if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
        if (!formData.uf) newErrors.uf = 'UF é obrigatória';
        // Outros campos de endereço podem ser opcionais
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
      // Montar string de endereço de entrega
      let enderecoEntrega = '';
      if (formData.rua) enderecoEntrega += `${formData.rua}`;
      if (formData.numeroEndereco) enderecoEntrega += `, ${formData.numeroEndereco}`;
      if (formData.complemento) enderecoEntrega += ` - ${formData.complemento}`;
      if (formData.bairro) enderecoEntrega += `, Bairro: ${formData.bairro}`;
      if (formData.cidade) enderecoEntrega += ` - ${formData.cidade}`;
      if (formData.uf) enderecoEntrega += `/${formData.uf.toUpperCase()}`;

      const empenhoDataParaEnviar = {
        numero_empenho: formData.numero,
        data_empenho: formData.data,
        valor_empenhado: parseFloat(formData.valor.replace(',', '.')), // Garantir que o valor seja numérico
        licitacao_id: parseInt(licitacaoId),
        // Adicionar campo para endereço de entrega (precisa ser criado no backend)
        endereco_entrega: enderecoEntrega.trim() || null
      };

      await onSubmit(empenhoDataParaEnviar);
    } catch (error) {
      console.error('Erro ao salvar empenho:', error);
      setErrors({ submit: error.response?.data?.message || 'Erro ao salvar o empenho. Tente novamente.' });
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

        {/* Opção de Endereço de Entrega */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>
                <input
                    type="checkbox"
                    name="usarEnderecoLicitacao"
                    checked={formData.usarEnderecoLicitacao}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    style={{ marginRight: '8px' }}
                />
                Usar endereço do órgão da licitação para entrega
            </label>
        </div>

        {/* Campos de Endereço (condicional) */}
        {!formData.usarEnderecoLicitacao && (
            <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '15px', marginBottom: '15px', backgroundColor: '#f9f9f9' }}>
                <h4>Endereço de Entrega</h4>
                {/* Rua e Número */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '70%' }}>
                        <label htmlFor="rua">Rua*</label>
                        <input type="text" id="rua" name="rua" value={formData.rua} onChange={handleChange} disabled={isSubmitting} className={errors.rua ? 'error' : ''} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        {errors.rua && <span className="error-message" style={{ color: 'red', fontSize: '0.8em' }}>{errors.rua}</span>}
                    </div>
                    <div style={{ width: '30%' }}>
                        <label htmlFor="numeroEndereco">Número</label>
                        <input type="text" id="numeroEndereco" name="numeroEndereco" value={formData.numeroEndereco} onChange={handleChange} disabled={isSubmitting} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                </div>
                {/* Complemento e Bairro */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '50%' }}>
                        <label htmlFor="complemento">Complemento</label>
                        <input type="text" id="complemento" name="complemento" value={formData.complemento} onChange={handleChange} disabled={isSubmitting} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                    <div style={{ width: '50%' }}>
                        <label htmlFor="bairro">Bairro</label>
                        <input type="text" id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} disabled={isSubmitting} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                </div>
                {/* Cidade e UF */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '70%' }}>
                        <label htmlFor="cidade">Cidade*</label>
                        <input type="text" id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} disabled={isSubmitting} className={errors.cidade ? 'error' : ''} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        {errors.cidade && <span className="error-message" style={{ color: 'red', fontSize: '0.8em' }}>{errors.cidade}</span>}
                    </div>
                    <div style={{ width: '25%' }}>
                        <label htmlFor="uf">UF*</label>
                        <select id="uf" name="uf" value={formData.uf} onChange={handleChange} disabled={isSubmitting} className={errors.uf ? 'error' : ''} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                            <option value="">UF</option>
                            {ufs.map(uf => (
                                <option key={uf} value={uf}>{uf}</option>
                            ))}
                        </select>
                        {errors.uf && <span className="error-message" style={{ color: 'red', fontSize: '0.8em' }}>{errors.uf}</span>}
                    </div>
                </div>
            </div>
        )}

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

