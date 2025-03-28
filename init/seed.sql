CREATE TABLE tarefa (
    id SERIAL PRIMARY KEY,
     descricao VARCHAR(255) NOT NULL,
     situacao CHAR(1) NOT NULL,
     data_criacao DATE NOT NULL,
     data_prevista DATE,
     data_encerramento DATE    
);

INSERT INTO tarefa (id, descricao, situacao, data_criacao, data_prevista, data_encerramento) VALUES
(1, 'Estudar PostgreSQL', 'A', '2021-01-01', '2021-01-10', NULL),
(2, 'Estudar Node.js', 'A', '2021-01-01', '2021-01-10', NULL),
(3, 'Estudar React', 'A', '2021-01-01', '2021-01-10', NULL),
(4, 'Estudar Docker', 'A', '2021-01-01', '2021-01-10', NULL),
(5, 'Estudar Kubernetes', 'A', '2021-01-01', '2021-01-10', NULL),
(6, 'Estudar AWS', 'A', '2021-01-01', '2021-01-10', NULL),
(7, 'Estudar GCP', 'A', '2021-01-01', '2021-01-10', NULL),
(8, 'Estudar Azure', 'A', '2021-01-01', '2021-01-10', NULL),
(9, 'Estudar Java', 'A', '2021-01-01', '2021-01-10', NULL),
(10, 'Estudar Python', 'A', '2021-01-01', '2021-01-10', NULL);