import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cadastrar } from '../services/auth'
import logoBellify from '../assets/logo-bellify.png'
import './Cadastro.css'

const inicial = { salao: '', email: '', telefone: '', senha: '', confirmarSenha: '' }

export default function Cadastro() {
  const [form, setForm] = useState(inicial)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [erroServidor, setErroServidor] = useState('')
  const [sucesso, setSucesso] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (erros[name]) setErros((prev) => ({ ...prev, [name]: '' }))
    if (erroServidor) setErroServidor('')
  }

  function validar() {
    const novosErros = {}

    if (!form.salao.trim()) {
      novosErros.salao = 'Nome do salão é obrigatório.'
    } else if (form.salao.trim().length < 3) {
      novosErros.salao = 'Nome deve ter pelo menos 3 caracteres.'
    }

    if (!form.email.trim()) {
      novosErros.email = 'E-mail é obrigatório.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      novosErros.email = 'Informe um e-mail válido.'
    }

    if (!form.telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório.'
    } else {
      const numeros = form.telefone.replace(/\D/g, '')
      if (numeros.length < 10 || numeros.length > 11) {
        novosErros.telefone = 'Informe um telefone válido (DDD + número).'
      }
    }

    if (!form.senha) {
      novosErros.senha = 'Senha é obrigatória.'
    } else if (form.senha.length < 6) {
      novosErros.senha = 'Senha deve ter pelo menos 6 caracteres.'
    }

    if (!form.confirmarSenha) {
      novosErros.confirmarSenha = 'Confirme sua senha.'
    } else if (form.senha !== form.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não conferem.'
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validar()) return

    setEnviando(true)
    setErroServidor('')

    try {
      await cadastrar({
        salao: form.salao.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        senha: form.senha,
      })
      setSucesso(true)
    } catch (err) {
      const msg =
        err.response?.data?.mensagem ||
        err.response?.data?.error ||
        'Erro ao conectar com o servidor. Tente novamente.'
      setErroServidor(msg)
    } finally {
      setEnviando(false)
    }
  }

  if (sucesso) {
    return (
      <div className="page cadastro">
        <main className="cadastro-main">
          <div className="cadastro-card cadastro-sucesso">
            <div className="sucesso-icone">✅</div>
            <h2>Salão cadastrado!</h2>
            <p>
              O <strong>{form.salao}</strong> foi registrado com sucesso.
              Agora é só fazer login e começar a gerenciar.
            </p>
            <Link to="/login" className="btn btn-primary">
              Ir para o Login
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="page cadastro">
      <main className="cadastro-main">
        <div className="cadastro-card">
          <div className="cadastro-brand">
            <img src={logoBellify} alt="Bellify" className="cadastro-logo-img" />
          </div>

          <h2>Criar conta do salão</h2>
          <p className="cadastro-subtitle">
            Registre seu salão no Bellify e organize tudo em um só lugar.
          </p>

          {erroServidor && (
            <div className="alerta alerta-erro" role="alert">
              {erroServidor}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className={`campo ${erros.salao ? 'campo--erro' : ''}`}>
              <label htmlFor="salao">Nome do salão</label>
              <input
                id="salao"
                name="salao"
                type="text"
                placeholder="Ex: Studio Glamour"
                value={form.salao}
                onChange={handleChange}
                autoComplete="organization"
              />
              {erros.salao && <span className="campo-msg">{erros.salao}</span>}
            </div>

            <div className={`campo ${erros.email ? 'campo--erro' : ''}`}>
              <label htmlFor="email">E-mail do salão</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="contato@studiosalao.com.br"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {erros.email && <span className="campo-msg">{erros.email}</span>}
            </div>

            <div className={`campo ${erros.telefone ? 'campo--erro' : ''}`}>
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="(11) 91234-5678"
                value={form.telefone}
                onChange={handleChange}
                autoComplete="tel"
              />
              {erros.telefone && (
                <span className="campo-msg">{erros.telefone}</span>
              )}
            </div>

            <div className={`campo ${erros.senha ? 'campo--erro' : ''}`}>
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.senha}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {erros.senha && (
                <span className="campo-msg">{erros.senha}</span>
              )}
            </div>

            <div className={`campo ${erros.confirmarSenha ? 'campo--erro' : ''}`}>
              <label htmlFor="confirmarSenha">Confirmar senha</label>
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Repita a senha"
                value={form.confirmarSenha}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {erros.confirmarSenha && (
                <span className="campo-msg">{erros.confirmarSenha}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={enviando}
            >
              {enviando ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>

          <p className="cadastro-login-link">
            Já tem conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </main>

      <footer className="cadastro-footer">
        <p>Bellify © 2026 — Trabalho Acadêmico</p>
      </footer>
    </div>
  )
}
