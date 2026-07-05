import api from './api'

/**
 * Cadastra um novo salão.
 * @param {{ salao: string, email: string, telefone: string, senha: string }} dados
 * @returns {Promise<{ id: number, salao: string, email: string }>}
 */
export async function cadastrar(dados) {
  const response = await api.post('/auth/cadastro', dados)
  return response.data
}

/**
 * Faz login do salão.
 * @param {{ email: string, senha: string }} dados
 * @returns {Promise<{ token: string, salao: { id: number, nome: string, email: string } }>}
 */
export async function login(dados) {
  const response = await api.post('/auth/login', dados)
  return response.data
}
