import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { orgaosService } from '../services/api'; // Importar o serviço de órgãos

// Estilos básicos para o modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '750px', // Aumentar largura para acomodar mais campos
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

function NovaLicitacaoModal({ isOpen, onRequestClose, onSubmit, orgaos: initialOrgaos, empresas, onOrgaoCreated }) {
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
  const [editalFile, setEditalFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isAddingOrgao, setIsAddingOrgao] = useState(false);
  const [newOrgaoData, setNewOrgaoData] = useState({ // Estado para dados do novo órgão
    nome: '',
    cnpj: '',
    // Novos campos:
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    telefone: '',
    email: ''
  });
  const [orgaos, setOrgaos] = useState(initialOrgaos || []);

  useEffect(() => {
    setOrgaos(initialOrgaos || []);
  }, [initialOrgaos]);

  // Resetar formulário e estados quando o modal for fechado/aberto
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
      setEditalFile(null);
      setErrors({});
      setIsAddingOrgao(false);
      setNewOrgaoData({ // Resetar todos os campos do novo órgão
          nome: '', cnpj: '', rua: '', numero: '', complemento: '', bairro: '',
          cidade: '', estado: '', telefone: '', email: ''
      });
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

  const handleOrgaoChange = (e) => {
    const { value } = e.target;
    if (value === 'add_new') {
      setIsAddingOrgao(true);
      setFormData(prevState => ({ ...prevState, orgao_id: '' }));
    } else {
      setIsAddingOrgao(false);
      setFormData(prevState => ({ ...prevState, orgao_id: value }));
      if (errors.orgao_id) {
        setErrors(prev => ({ ...prev, orgao_id: null }));
      }
    }
  };

  const handleNewOrgaoChange = (e) => {
    const { name, value } = e.target;
    setNewOrgaoData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errors[`new_orgao_${name}`]) {
      setErrors(prev => ({ ...prev, [`new_orgao_${name}`]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setEditalFile(file);
      if (errors.edital) {
        setErrors(prev => ({ ...prev, edital: null }));
      }
    } else {
      setEditalFile(null);
      setErrors(prev => ({ ...prev, edital: 'Selecione um arquivo PDF válido.' }));
    }
  };

  const validateMainForm = () => {
    const newErrors = { ...errors };
    if (!formData.numero_licitacao.trim()) newErrors.numero_licitacao = 'Número da licitação é obrigatório';
    if (!isAddingOrgao && !formData.orgao_id) newErrors.orgao_id = 'Selecione um órgão ou adicione um novo';
    if (!formData.modalidade.trim()) newErrors.modalidade = 'Modalidade é obrigatória';
    if (!formData.objeto.trim()) newErrors.objeto = 'Objeto é obrigatório';
    if (!formData.data_abertura) newErrors.data_abertura = 'Data de abertura é obrigatória';
    if (!editalFile) newErrors.edital = 'O upload do edital (PDF) é obrigatório';

    if (formData.valor_total && isNaN(parseFloat(formData.valor_total.replace(',', '.')))) {
        newErrors.valor_total = 'Valor deve ser um número válido';
    }

    Object.keys(formData).forEach(key => {
        if (formData[key] && newErrors[key]) delete newErrors[key];
    });
    if (editalFile && newErrors.edital) delete newErrors.edital;
    if (!isAddingOrgao && formData.orgao_id && newErrors.orgao_id) delete newErrors.orgao_id;

    setErrors(newErrors);
    const mainFormErrorKeys = Object.keys(newErrors).filter(key => !key.startsWith('new_orgao_'));
    return mainFormErrorKeys.length === 0;
  };

    // Validação do sub-formulário de novo órgão com novos campos
    const validateNewOrgaoForm = () => {
        const newOrgaoErrors = {};
        if (!newOrgaoData.nome.trim()) newOrgaoErrors.new_orgao_nome = 'Nome do órgão é obrigatório';
        // Adicionar validação de formato CNPJ (exemplo simples)
        const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        if (!newOrgaoData.cnpj.trim()) {
            newOrgaoErrors.new_orgao_cnpj = 'CNPJ do órgão é obrigatório';
        } else if (!cnpjPattern.test(newOrgaoData.cnpj.trim())) {
            // Comentar ou remover se não quiser validação de formato no frontend
            // newOrgaoErrors.new_orgao_cnpj = 'Formato de CNPJ inválido (use XX.XXX.XXX/XXXX-XX)';
        }
        if (!newOrgaoData.cidade.trim()) newOrgaoErrors.new_orgao_cidade = 'Cidade é obrigatória'; // Obrigatório
        if (!newOrgaoData.estado.trim()) {
            newOrgaoErrors.new_orgao_estado = 'UF é obrigatória';
        } else if (newOrgaoData.estado.trim().length !== 2) {
            newOrgaoErrors.new_orgao_estado = 'UF deve ter 2 letras'; // Obrigatório
        }

        // Limpar erros antigos do subform que foram corrigidos
        const currentSubFormErrors = Object.keys(errors).filter(k => k.startsWith('new_orgao_'));
        currentSubFormErrors.forEach(key => {
            if (!newOrgaoErrors[key]) {
                // Se não há novo erro para esta chave, remove o erro antigo
                delete errors[key];
            }
        });

        setErrors(prev => ({ ...prev, ...newOrgaoErrors }));
        return Object.keys(newOrgaoErrors).length === 0;
    };

    // Função para criar o órgão, agora com endereço estruturado
    const handleCreateOrgao = async () => {
        // Limpar erro geral do formulário antes de tentar criar
        setErrors(prev => {
            const { form, ...rest } = prev;
            return rest;
        });

        if (!validateNewOrgaoForm()) {
            return null;
        }
        try {
            // Montar string de endereço a partir dos campos
            let enderecoCompleto = '';
            if (newOrgaoData.rua) enderecoCompleto += `${newOrgaoData.rua}`;
            if (newOrgaoData.numero) enderecoCompleto += `, ${newOrgaoData.numero}`;
            if (newOrgaoData.complemento) enderecoCompleto += ` - ${newOrgaoData.complemento}`;
            if (newOrgaoData.bairro) enderecoCompleto += `, Bairro: ${newOrgaoData.bairro}`;

            const orgaoPayload = {
                nome: newOrgaoData.nome.trim(),
                cnpj: newOrgaoData.cnpj.trim(), // Enviar CNPJ formatado ou não, dependendo do backend
                cidade: newOrgaoData.cidade.trim(),
                estado: newOrgaoData.estado.trim().toUpperCase(), // Garante UF em maiúsculo e sem espaços extras
                endereco: enderecoCompleto.trim() || null, // Envia null se vazio
                telefone: newOrgaoData.telefone.trim() || null,
                email: newOrgaoData.email.trim() || null
            };

            console.log("Enviando payload para criar órgão:", orgaoPayload); // Log para depuração

            const response = await orgaosService.criarOrgao(orgaoPayload);
            if (response && response.success && response.orgao) {
                const novoOrgao = response.orgao;
                const updatedOrgaos = [...orgaos, novoOrgao].sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena após adicionar
                setOrgaos(updatedOrgaos);
                if (onOrgaoCreated) {
                    onOrgaoCreated(novoOrgao);
                }
                setFormData(prev => ({ ...prev, orgao_id: novoOrgao.id }));
                setIsAddingOrgao(false);
                setNewOrgaoData({ nome: '', cnpj: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', telefone: '', email: '' });
                setErrors(prev => {
                    const cleanedErrors = { ...prev };
                    Object.keys(cleanedErrors).forEach(key => {
                        if (key.startsWith('new_orgao_')) {
                            delete cleanedErrors[key];
                        }
                    });
                    return cleanedErrors;
                });
                return novoOrgao.id;
            } else {
                // Exibe a mensagem de erro específica da API, se disponível
                const errorMessage = response?.message || 'Erro desconhecido ao criar órgão.';
                console.error("API retornou erro ao criar órgão:", errorMessage, response); // Log detalhado
                setErrors(prev => ({ ...prev, form: `Erro ao criar órgão: ${errorMessage}` }));
                return null;
            }
        } catch (error) {
            console.error("Erro na chamada da API para criar órgão:", error); // Log do erro completo
            // Tenta pegar a mensagem de erro da resposta da API
            const apiErrorMessage = error.response?.data?.message || error.message || 'Erro de comunicação ao criar órgão.';
            setErrors(prev => ({ ...prev, form: `Erro: ${apiErrorMessage}` }));
            return null;
        }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalOrgaoId = formData.orgao_id;

    if (isAddingOrgao) {
      const novoOrgaoId = await handleCreateOrgao();
      if (!novoOrgaoId) {
        return;
      }
      finalOrgaoId = novoOrgaoId;
    }

    // Força a atualização do estado antes de validar o formulário principal
    // Isso garante que o orgao_id esteja correto se um novo foi criado
    const updatedFormData = { ...formData, orgao_id: finalOrgaoId };
    setFormData(updatedFormData);

    // Pequeno delay para garantir que o estado foi atualizado antes da validação
    setTimeout(() => {
        if (!validateMainForm()) {
            // Se o formulário principal ainda não for válido
            // Garante que o erro 'Selecione um órgão' seja removido se um novo foi criado.
            if (finalOrgaoId && errors.orgao_id) {
                setErrors(prev => {
                    const { orgao_id, ...rest } = prev;
                    return rest;
                });
            }
            return;
        }

        // Monta o FormData para submissão da licitação
        const submissionData = new FormData();
        submissionData.append('numero_licitacao', updatedFormData.numero_licitacao);
        submissionData.append('orgao_id', finalOrgaoId);
        if (updatedFormData.empresa_id) submissionData.append('empresa_id', updatedFormData.empresa_id);
        submissionData.append('modalidade', updatedFormData.modalidade);
        submissionData.append('objeto', updatedFormData.objeto);
        if (updatedFormData.valor_total) submissionData.append('valor_total', parseFloat(updatedFormData.valor_total.replace(',', '.')));
        submissionData.append('data_abertura', updatedFormData.data_abertura);
        if (updatedFormData.data_encerramento) submissionData.append('data_encerramento', updatedFormData.data_encerramento);
        submissionData.append('status', updatedFormData.status);
        submissionData.append('edital', editalFile);

        // Submete o formulário da licitação
        onSubmit(submissionData);
    }, 100); // Delay de 100ms

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
        {errors.form && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{errors.form}</div>}

        {/* Número da Licitação */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="numero_licitacao">Número da Licitação*</label>
          <input type="text" id="numero_licitacao" name="numero_licitacao" value={formData.numero_licitacao} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          {errors.numero_licitacao && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.numero_licitacao}</span>}
        </div>

        {/* Órgão (Seleção ou Adição) */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="orgao_id">Órgão*</label>
          <select id="orgao_id" name="orgao_id" value={isAddingOrgao ? 'add_new' : formData.orgao_id} onChange={handleOrgaoChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="">Selecione o Órgão</option>
            {orgaos && orgaos.map(orgao => (
              <option key={orgao.id} value={orgao.id}>{orgao.nome}</option>
            ))}
            <option value="add_new">-- Adicionar Novo Órgão --</option>
          </select>
          {errors.orgao_id && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.orgao_id}</span>}
        </div>

        {/* Formulário Condicional para Novo Órgão */}
        {isAddingOrgao && (
          <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '15px', marginBottom: '15px', backgroundColor: '#f9f9f9' }}>
            <h4>Novo Órgão Público</h4>
            {/* Nome e CNPJ */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '60%' }}>
                    <label htmlFor="new_orgao_nome">Nome*</label>
                    <input type="text" id="new_orgao_nome" name="nome" value={newOrgaoData.nome} onChange={handleNewOrgaoChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    {errors.new_orgao_nome && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.new_orgao_nome}</span>}
                </div>
                <div style={{ width: '40%' }}>
                    <label htmlFor="new_orgao_cnpj">CNPJ*</label>
                    <input type="text" id="new_orgao_cnpj" name="cnpj" value={newOrgaoData.cnpj} onChange={handleNewOrgaoChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="00.000.000/0000-00"/>
                    {errors.new_orgao_cnpj && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.new_orgao_cnpj}</span>}
                </div>
            </div>
            {/* Endereço - Rua e Número */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '70%' }}>
                    <label htmlFor="new_orgao_rua">Rua</label>
                    <input type="text" id="new_orgao_rua" name="rua" value={newOrgaoData.rua} onChange={handleNewOrgaoChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ width: '30%' }}>
                    <label htmlFor="new_orgao_numero">Número</label>
                    <input type="text" id="new_orgao_numero" name="numero" value={newOrgaoData.numero} onChange={handleNewOrgaoChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
            </div>
            {/* Endereço - Complemento e Bairro */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '50%' }}>
                    <label htmlFor="new_orgao_complemento">Complemento</label>
                    <input type="text" id="new_orgao_complemento" name="complemento" value={newOrgaoData.complemento} onChange={handleNewOrgaoChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ width: '50%' }}>
                    <label htmlFor="new_orgao_bairro">Bairro</label>
                    <input type="text" id="new_orgao_bairro" name="bairro" value={newOrgaoData.bairro} onChange={handleNewOrgaoChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
            </div>
            {/* Cidade e Estado (UF) */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '70%' }}>
                    <label htmlFor="new_orgao_cidade">Cidade*</label>
                    <input type="text" id="new_orgao_cidade" name="cidade" value={newOrgaoData.cidade} onChange={handleNewOrgaoChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    {errors.new_orgao_cidade && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.new_orgao_cidade}</span>}
                </div>
                <div style={{ width: '30%' }}>
                    <label htmlFor="new_orgao_estado">Estado (UF)*</label>
                    <input type="text" id="new_orgao_estado" name="estado" value={newOrgaoData.estado} onChange={handleNewOrgaoChange} maxLength="2" style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="Ex: SP"/>
                    {errors.new_orgao_estado && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.new_orgao_estado}</span>}
                </div>
            </div>
            {/* Telefone e Email */}
             <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '50%' }}>
                    <label htmlFor="new_orgao_telefone">Telefone</label>
                    <input type="text" id="new_orgao_telefone" name="telefone" value={newOrgaoData.telefone} onChange={handleNewOrgaoChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ width: '50%' }}>
                    <label htmlFor="new_orgao_email">Email</label>
                    <input type="email" id="new_orgao_email" name="email" value={newOrgaoData.email} onChange={handleNewOrgaoChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
            </div>

            <button type="button" onClick={() => setIsAddingOrgao(false)} style={{ padding: '8px 12px', marginRight: '10px', marginTop: '10px' }}>Cancelar Adição</button>
          </div>
        )}

        {/* Empresa (Opcional) */}
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="empresa_id">Empresa (Opcional)</label>
            <select id="empresa_id" name="empresa_id" value={formData.empresa_id} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
              <option value="">Selecione a Empresa (se aplicável)</option>
              {empresas && empresas.map(empresa => (
                <option key={empresa.id} value={empresa.id}>{empresa.nome_fantasia}</option>
              ))}
            </select>
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

        {/* Upload Edital */}
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

