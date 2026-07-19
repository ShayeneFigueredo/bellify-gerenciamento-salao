import api from './api'

/**
 * Indicadores do salão para o painel do admin (agregados pelo backend).
 * @returns {Promise<{ agendamentos: number, cancelamentos: number, faturamento: number, total: number }>}
 */
export async function obterIndicadores() {
  try {
    const { data } = await api.get('/relatorios/indicadores')
    if (data && typeof data === 'object') {
      return {
        agendamentos: data.agendamentos ?? 0,
        cancelamentos: data.cancelamentos ?? 0,
        faturamento: data.faturamento ?? 0,
        total: data.total ?? 0,
      }
    }
  } catch {
    // sem backend ainda — retorna zerado
  }
  return { agendamentos: 0, cancelamentos: 0, faturamento: 0, total: 0 }
}
