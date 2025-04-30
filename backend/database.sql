DROP TABLE IF EXISTS historico_interacoes CASCADE;
DROP TABLE IF EXISTS alertas CASCADE;
DROP TABLE IF EXISTS pagamentos CASCADE;
DROP TABLE IF EXISTS entregas CASCADE;
DROP TABLE IF EXISTS notas_fiscais CASCADE;
DROP TABLE IF EXISTS itens_empenhoCASCADE;
DROP TABLE IF EXISTS empenhos CASCADE;
DROP TABLE IF EXISTS atas_registro CASCADE;
DROP TABLE IF EXISTS licitacoes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS empresas CASCADE;
DROP TABLE IF EXISTS orgaos_publicos CASCADE;


CREATE TABLE orgaos_publicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    endereco TEXT,
    cidade VARCHAR(100),
    estado CHAR(2),
    telefone VARCHAR(20),
    email VARCHAR(255)
);

CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    nome_fantasia VARCHAR(255) NOT NULL,
    razao_social VARCHAR(255),
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    inscricao_estadual VARCHAR(50),
    endereco TEXT,
    cidade VARCHAR(100),
    estado CHAR(2),
    telefone VARCHAR(20),
    email VARCHAR(255),
    responsavel_legal VARCHAR(255)
);

CREATE TABLE licitacoes (
    id SERIAL PRIMARY KEY,
    numero_licitacao VARCHAR(100) NOT NULL,
    orgao_id INTEGER REFERENCES orgaos_publicos(id) ON DELETE CASCADE,
    empresa_id INTEGER REFERENCES empresas(id),
    modalidade VARCHAR(100), 
    objeto TEXT,
    valor_total DECIMAL(18,2),
    data_abertura DATE,
    status VARCHAR(50),       
    edital_arquivo TEXT       
);

CREATE TABLE atas_registro (
    id SERIAL PRIMARY KEY,
    licitacao_id INTEGER REFERENCES licitacoes(id) ON DELETE CASCADE,
    numero_ata VARCHAR(100),
    data_assinatura DATE,
    validade DATE,          
    valor_total DECIMAL(18,2),
    arquivo TEXT           
);

CREATE TABLE empenhos (
    id SERIAL PRIMARY KEY,
    licitacao_id INTEGER REFERENCES licitacoes(id) ON DELETE CASCADE,
    numero_empenho VARCHAR(100),
    data_empenho DATE,
    valor_empenhado DECIMAL(18,2),
    arquivo TEXT           
);

CREATE TABLE itens_empenho (
    id SERIAL PRIMARY KEY,
    empenho_id INTEGER REFERENCES empenhos(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_unitario NUMERIC(12,2) NOT NULL,
    valor_total NUMERIC(14,2) GENERATED ALWAYS AS (quantidade * valor_unitario) STORED
);

CREATE TABLE notas_fiscais (
    id SERIAL PRIMARY KEY,
    licitacao_id INTEGER REFERENCES licitacoes(id) ON DELETE CASCADE,
    numero_nf VARCHAR(100),
    data_emissao DATE,
    valor_nf DECIMAL(18,2),
    arquivo TEXT           
);

CREATE TABLE pagamentos (
    id SERIAL PRIMARY KEY,
    nota_fiscal_id INTEGER REFERENCES notas_fiscais(id) ON DELETE CASCADE,
    data_pagamento DATE,
    valor_pago DECIMAL(18,2),
    forma_pagamento VARCHAR(50),
    comprovante TEXT       
);

CREATE TABLE entregas (
    id SERIAL PRIMARY KEY,
    licitacao_id INTEGER REFERENCES licitacoes(id) ON DELETE CASCADE,
    data_entrega DATE,
    local_entrega TEXT,
    status_entrega VARCHAR(50),  
    comprovante TEXT            
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    tipo_usuario VARCHAR(50), 
    ativo BOOLEAN DEFAULT TRUE,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id)
);

CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255),
    descricao TEXT,
    data_alerta DATE,
    tipo_alerta VARCHAR(50), 
    licitacao_id INTEGER REFERENCES licitacoes(id),
    usuario_id INTEGER REFERENCES usuarios(id),
    visualizado BOOLEAN DEFAULT FALSE
);

CREATE TABLE historico_interacoes (
    id SERIAL PRIMARY KEY,
    licitacao_id INTEGER REFERENCES licitacoes(id) ON DELETE CASCADE,
    data_interacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    canal VARCHAR(50),   
    descricao TEXT,        
    usuario_id INTEGER REFERENCES usuarios(id)
);
