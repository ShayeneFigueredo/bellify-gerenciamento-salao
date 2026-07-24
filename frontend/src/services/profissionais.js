import api from './api'

/**
 * Lista os profissionais. Os dados vêm do backend.
 * @returns {Promise<Array<{ id: number, nome: string, especialidade: string }>>}
 */
export async function listarProfissionais() {
  try {
    const { data } = await api.get('/profissionais')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/**
 * Cadastra um novo profissional.
 * @param {{ nome: string, email: string, telefone: string, especialidade: string }} dados
 */
export async function criarProfissional(dados) {
  const { data } = await api.post('/profissionais', dados)
  return data
}

/**
 * Carrega a grade semanal de horários do profissional.
 */
export async function carregarHorarios(profissionalId) {
  const { data } = await api.get(`/profissionais/${profissionalId}/horarios`)
  return data
}

/**
 * Salva a grade semanal de horários do profissional.
 */
export async function salvarHorarios(profissionalId, horarios) {
  await api.put(`/profissionais/${profissionalId}/horarios`, horarios)
}
