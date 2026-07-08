import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../services/auth'
import logoBellify from '../assets/logo-bellify.png'
import './Login.css'

const inicial = { email: '', senha: '' }

export default function Login() {
  const [form, setForm] = useState(inicial)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (erro) setErro('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.email.trim() || !form.senha) {
      setErro('Preencha todos os campos.')
      return
    }

    setEnviando(true)
    try {
      const dados = await login({ email: form.email.trim(), senha: form.senha })
      // TODO: salvar token e redirecionar para o dashboard
      console.log('Login OK:', dados)
    } catch (err) {
      const msg =
        err.response?.data?.mensagem ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Erro ao conectar com o servidor. Tente novamente.'
      setErro(msg)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="page login">
      <main className="login-main">
        <div className="login-card">
          <div className="login-brand">
            <img src={logoBellify} alt="Bellify" className="login-logo-img" />
          </div>

          <h2>Entrar</h2>
          <p className="login-subtitle">
            Acesse sua conta na plataforma.
          </p>

          {erro && (
            <div className="alerta alerta-erro" role="alert">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="campo">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="contato@seusalao.com.br"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="campo">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Sua senha"
                value={form.senha}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={enviando}
            >
              {enviando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="login-cadastro-link">
            Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </main>

      <footer className="login-footer">
        <p>Bellify © 2026 — Trabalho Acadêmico</p>
      </footer>
    </div>
  )
}
