import api from './api'

/**
 * Horários livres do profissional na data (YYYY-MM-DD).
 * @returns {Promise<string[]>}
 */
export async function horariosLivres(profissionalId, data) {
  try {
    const { data: resp } = await api.get('/agendamentos/horarios-livres', {
      params: { profissional: profissionalId, data },
    })
    return Array.isArray(resp) ? resp : []
  } catch {
    return []
  }
}

/**
 * Cria um agendamento.
 */
export async function criarAgendamento(payload) {
  const { data } = await api.post('/agendamentos', payload)
  return data
}

/**
 * Lista os agendamentos do cliente logado.
 */
export async function listarMeusAgendamentos() {
  try {
    const { data } = await api.get('/agendamentos', { params: { cliente: 'me' } })
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/**
 * Cancela um agendamento pelo id.
 */
export async function cancelarAgendamento(id) {
  await api.patch(`/agendamentos/${id}`, { status: 'cancelado' })
  return true
}

/**
 * Todos os agendamentos do salão — usado na agenda e no painel do admin.
 */
export async function listarTodosAgendamentos() {
  try {
    const { data } = await api.get('/agendamentos')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
