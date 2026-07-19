import api from './api'

/**
 * Lista os serviços disponíveis. Os dados vêm do backend.
 * @returns {Promise<Array<{ id: number, nome: string, duracao: number, preco: number }>>}
 */
export async function listarServicos() {
  try {
    const { data } = await api.get('/servicos')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/**
 * Cadastra um novo serviço.
 * @param {{ nome: string, duracao: number, preco: number }} dados
 */
export async function criarServico(dados) {
  const { data } = await api.post('/servicos', dados)
  return data
}
