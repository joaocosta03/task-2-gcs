function validarCamposTarefa(tarefa) {
  const { descricao, data_prevista, situacao } = tarefa;

  if (!descricao || descricao.trim() === '') return false;
  if (!data_prevista || !/^\d{4}-\d{2}-\d{2}$/.test(data_prevista)) return false;
  if (!['pendente', 'concluída'].includes(situacao)) return false;

  return true;
}

module.exports = { validarCamposTarefa };
