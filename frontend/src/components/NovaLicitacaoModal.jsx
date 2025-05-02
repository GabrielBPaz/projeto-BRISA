import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

// Estilos básicos para o modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '600px', // Aumentar largura para acomodar novo campo
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '20px',
    borderRadius: '8px'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000
  }
};

Modal.setAppElement('#root');

function NovaLicitacaoModal({ isOpen, onRequestClose, onSubmit, orgaos, empresas }) {
  const [formData, setFormData] = useState({
    numero_licitacao: '',
    orgao_id: '',
    empresa_id: '',
    modalidade: '',
    objeto: '',
    valor_total: '',
    data_abertura: '',
    data_encerramento: '',
    status: 'Em Aberto',
  });
  const [editalFile, setEditalFile] = useState(null); // Estado para o arquivo do edital
  const [errors, setErrors] = useState({});

  // Resetar formulário e arquivo quando o modal for fechado/aberto
  useEffect(() => {
    if (isOpen) {
      setFormData({
        numero_licitacao: '',
        orgao_id: '',
        empresa_id: '',
        modalidade: '',
        objeto: '',
        valor_total: '',
        data_abertura: '',
        data_encerramento: '',
        status: 'Em Aberto',
      });
      setEditalFile(null); // Limpar arquivo selecionado
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handler para o input de arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setEditalFile(file);
      if (errors.edital) {
        setErrors(prev => ({ ...prev, edital: null }));
      }
    } else {
      setEditalFile(null);
      // Opcional: mostrar erro se não for PDF
      setErrors(prev => ({ ...prev, edital: 'Selecione um arquivo PDF válido.' }));
    }
  };

  // Validação incluindo o campo de edital
  const validateForm = () => {
    const newErrors = {};
    if (!formData.numero_licitacao.trim()) newErrors.numero_licitacao = 'Número da licitação é obrigatório';
    if (!formData.orgao_id) newErrors.orgao_id = 'Órgão é obrigatório';
    if (!formData.modalidade.trim()) newErrors.modalidade = 'Modalidade é obrigatória';
    if (!formData.objeto.trim()) newErrors.objeto = 'Objeto é obrigatório';
    if (!formData.data_abertura) newErrors.data_abertura = 'Data de abertura é obrigatória';
    if (!editalFile) newErrors.edital = 'O upload do edital (PDF) é obrigatório'; // Validação do edital

    if (formData.valor_total && isNaN(parseFloat(formData.valor_total.replace(',', '.')))) {
        newErrors.valor_total = 'Valor deve ser um número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Modificar handleSubmit para enviar FormData
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Criar FormData
    const submissionData = new FormData();

    // Adicionar campos do formulário ao FormData
    submissionData.append('numero_licitacao', formData.numero_licitacao);
    submissionData.append('orgao_id', formData.orgao_id);
    if (formData.empresa_id) submissionData.append('empresa_id', formData.empresa_id);
    submissionData.append('modalidade', formData.modalidade);
    submissionData.append('objeto', formData.objeto);
    if (formData.valor_total) submissionData.append('valor_total', parseFloat(formData.valor_total.replace(',', '.')));
    submissionData.append('data_abertura', formData.data_abertura);
    if (formData.data_encerramento) submissionData.append('data_encerramento', formData.data_encerramento);
    submissionData.append('status', formData.status);

    // Adicionar o arquivo do edital
    submissionData.append('edital', editalFile); // O nome 'edital' deve corresponder ao esperado pelo backend (multer)

    onSubmit(submissionData); // Enviar FormData
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Nova Licitação"
    >
      <h2>Nova Licitação</h2>
      <button onClick={onRequestClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
      <form onSubmit={handleSubmit}>

        {/* Campos existentes... (Número, Órgão, Empresa, Modalidade, Status, Objeto) */}
        {/* Número da Licitação */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="numero_licitacao">Número da Licitação*</label>
          <input type="text" id="numero_licitacao" name="numero_licitacao" value={formData.numero_licitacao} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          {errors.numero_licitacao && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.numero_licitacao}</span>}
        </div>

        {/* Órgão e Empresa */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', gap: '10px' }}>
          <div style={{ width: '48%' }}>
            <label htmlFor="orgao_id">Órgão*</label>
            <select id="orgao_id" name="orgao_id" value={formData.orgao_id} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
              <option value="">Selecione o Órgão</option>
              {orgaos && orgaos.map(orgao => (
                <option key={orgao.id} value={orgao.id}>{orgao.nome}</option>
              ))}
            </select>
            {errors.orgao_id && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.orgao_id}</span>}
          </div>
          <div style={{ width: '48%' }}>
            <label htmlFor="empresa_id">Empresa (Opcional)</label>
            <select id="empresa_id" name="empresa_id" value={formData.empresa_id} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
              <option value="">Selecione a Empresa (se aplicável)</option>
              {empresas && empresas.map(empresa => (
                <option key={empresa.id} value={empresa.id}>{empresa.nome_fantasia}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Modalidade e Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', gap: '10px' }}>
            <div style={{ width: '48%' }}>
                <label htmlFor="modalidade">Modalidade*</label>
                <input type="text" id="modalidade" name="modalidade" value={formData.modalidade} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                {errors.modalidade && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.modalidade}</span>}
            </div>
            <div style={{ width: '48%' }}>
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                    <option value="Em Aberto">Em Aberto</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluída">Concluída</option>
                    <option value="Cancelada">Cancelada</option>
                    <option value="Suspensa">Suspensa</option>
                </select>
            </div>
        </div>

        {/* Objeto */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="objeto">Objeto*</label>
          <textarea id="objeto" name="objeto" value={formData.objeto} onChange={handleChange} rows="3" style={{ width: '100%', padding: '8px', marginTop: '5px' }}></textarea>
          {errors.objeto && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.objeto}</span>}
        </div>

        {/* NOVO CAMPO: Upload Edital */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="edital">Edital (PDF)*</label>
          <input
            type="file"
            id="edital"
            name="edital"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.edital && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.edital}</span>}
        </div>

        {/* Campos existentes... (Datas, Valor Total) */}
        {/* Datas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', gap: '10px' }}>
          <div style={{ width: '48%' }}>
            <label htmlFor="data_abertura">Data de Abertura*</label>
            <input type="date" id="data_abertura" name="data_abertura" value={formData.data_abertura} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            {errors.data_abertura && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.data_abertura}</span>}
          </div>
          <div style={{ width: '48%' }}>
            <label htmlFor="data_encerramento">Data de Encerramento (Opcional)</label>
            <input type="date" id="data_encerramento" name="data_encerramento" value={formData.data_encerramento} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
        </div>

        {/* Valor Total */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="valor_total">Valor Total (R$) (Opcional)</label>
          <input type="text" id="valor_total" name="valor_total" value={formData.valor_total} onChange={handleChange} placeholder="0,00" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
           {errors.valor_total && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.valor_total}</span>}
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" onClick={onRequestClose} style={{ padding: '10px 15px' }}>Cancelar</button>
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Criar Licitação</button>
        </div>
      </form>
    </Modal>
  );
}

export default NovaLicitacaoModal;

