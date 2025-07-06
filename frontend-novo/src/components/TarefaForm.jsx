import React, { useState } from "react";
import api from "../api.js";

const TarefaForm = ({ onSuccess }) => {
    const [descricao, setDescricao] = useState("");
    const [situacao, setSituacao] = useState("pendente");
    const [dataPrevista, setDataPrevista] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        try{
            await api.post(
                "/tarefas",
                {
                    descricao,
                    situacao,
                    data_criacao: new Date().toISOString().split("T")[0],
                    data_prevista: dataPrevista,
                },
                {
                    headers: {
                    Authorization: `Bearer ${token}`, // <-- enviar no header
                    },
                }
                );
            setDescricao("");
            setSituacao("pendente");
            setDataPrevista("");
            onSuccess(); 
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: "1rem" }}>
            <h2>Criar Tarefa</h2>
            <div>
                <label>Descrição:</label>
                <input
                    type="text"
                    placeholder="Descrição da tarefa"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Situação:</label>
                <select
                    value={situacao}
                    onChange={(e) => setSituacao(e.target.value)}
                >
                    <option value="pendente">Pendente</option>
                    <option value="em andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                </select>
            </div>
            <div>
                <label>Data Prevista:</label>
                <input
                    type="date"
                    value={dataPrevista}
                    onChange={(e) => setDataPrevista(e.target.value)}
                />
            </div>
            <button type="submit">Criar Tarefa</button>
        </form>
    );
};

export default TarefaForm;