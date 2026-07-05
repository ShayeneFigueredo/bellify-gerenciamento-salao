import api from './api'

/**
 * Cadastra um novo usuário.
 * @param {{
 *   perfil: 'cliente' | 'admin' | 'profissional',
 *   nome?: string,
 *   salao?: string,
 *   email: string,
 *   telefone: string,
 *   endereco?: string,
 *   especialidade?: string,
 *   senha: string,
 * }} dados
 * @returns {Promise<{ id: number, email: string, perfil: string }>}
 */
export async function cadastrar(dados) {
  const response = await api.post('/auth/cadastro', dados)
  return response.data
}

/**
 * Faz login.
 * @param {{ email: string, senha: string }} dados
 * @returns {Promise<{ token: string, usuario: object }>}
 */
export async function login(dados) {
  const response = await api.post('/auth/login', dados)
  return response.data
}
