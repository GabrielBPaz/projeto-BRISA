import React, { useEffect, useState } from 'react';
import api from '../../api/api'; // O axios configurado com baseURL

function ListarOrgaos() {
  const [orgaos, setOrgaos] = useState([]);

  // Chama a API ao montar o componente
  useEffect(() => {
    api.get('/orgaos')
      .then(response => setOrgaos(response.data))
      .catch(error => alert('Erro ao buscar órgãos públicos'));
  }, []);

  return (
    <div>
      <h2>Órgãos Públicos (Banco de Dados)</h2>
      <ul>
        {orgaos.map(orgao => (
          <li key={orgao.id}>
            <strong>{orgao.nome}</strong> - UF: {orgao.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListarOrgaos;
