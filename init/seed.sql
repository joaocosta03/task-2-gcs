CREATE TABLE tarefa (
    id SERIAL PRIMARY KEY,
     descricao VARCHAR(255) NOT NULL,
     situacao VARCHAR(30) NOT NULL,
     data_criacao DATE NOT NULL,
     data_prevista DATE,
     data_encerramento DATE    
);

INSERT INTO tarefa (descricao, situacao, data_criacao, data_prevista, data_encerramento) VALUES
('Estudar PostgreSQL', 'Concluído', '2021-01-01', '2021-01-10', NULL),
('Estudar Node.js', 'Concluído', '2021-01-01', '2021-01-10', NULL),
('Estudar React', 'Concluído', '2021-01-01', '2021-01-10', NULL),
('Estudar Docker', 'Em andamento', '2021-01-01', '2021-01-10', NULL),
('Estudar Kubernetes', 'Em andamento', '2021-01-01', '2021-01-10', NULL),
('Estudar AWS', 'Pendente', '2021-01-01', '2021-01-10', NULL),
('Estudar GCP', 'Concluído', '2021-01-01', '2021-01-10', NULL),
('Estudar Azure', 'Concluído', '2021-01-01', '2021-01-10', NULL),
('Estudar Java', 'Concluído', '2021-01-01', '2021-01-10', NULL),
('Estudar Python', 'Em andamento', '2021-01-01', '2021-01-10', NULL);

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, 
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuario (nome, email, senha)
VALUES 
  ('João Pedro', 'admin@exemplo.com', 'admin123');