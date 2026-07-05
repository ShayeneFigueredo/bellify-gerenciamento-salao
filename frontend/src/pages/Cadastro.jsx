import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cadastrar } from '../services/auth'
import logoBellify from '../assets/logo-bellify.png'
import './Cadastro.css'

const PERFIS = [
  { value: 'admin', label: 'Administrador', desc: 'Gerenciar meu salão' },
  { value: 'profissional', label: 'Profissional', desc: 'Atender clientes' },
]

const inicial = {
  perfil: 'cliente',
  nome: '',
  salao: '',
  email: '',
  telefone: '',
  endereco: '',
  especialidade: '',
  senha: '',
  confirmarSenha: '',
}

export default function Cadastro() {
  const [form, setForm] = useState(inicial)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [erroServidor, setErroServidor] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [escolhendoPerfil, setEscolhendoPerfil] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (erros[name]) setErros((prev) => ({ ...prev, [name]: '' }))
    if (erroServidor) setErroServidor('')
  }

  function selecionarPerfil(perfil) {
    setForm((f) => ({ ...inicial, perfil }))
    setErros({})
    setErroServidor('')
    setEscolhendoPerfil(false)
  }

  function validar() {
    const novosErros = {}

    if (form.perfil === 'cliente' || form.perfil === 'profissional') {
      if (!form.nome.trim()) {
        novosErros.nome = 'Nome é obrigatório.'
      } else if (form.nome.trim().length < 3) {
        novosErros.nome = 'Nome deve ter pelo menos 3 caracteres.'
      }
    }

    if (form.perfil === 'admin') {
      if (!form.salao.trim()) {
        novosErros.salao = 'Nome do salão é obrigatório.'
      }
      if (!form.endereco.trim()) {
        novosErros.endereco = 'Endereço do salão é obrigatório.'
      }
    }

    if (form.perfil === 'profissional') {
      if (!form.especialidade.trim()) {
        novosErros.especialidade = 'Especialidade é obrigatória.'
      }
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
        perfil: form.perfil,
        nome: form.nome.trim(),
        salao: form.salao.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        endereco: form.endereco.trim(),
        especialidade: form.especialidade.trim(),
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
    const nomeExibicao = form.perfil === 'admin' ? form.salao : form.nome
    return (
      <div className="page cadastro">
        <main className="cadastro-main">
          <div className="cadastro-card cadastro-sucesso">
            <div className="sucesso-icone">✅</div>
            <h2>Cadastro realizado!</h2>
            <p>
              <strong>{nomeExibicao}</strong>, sua conta foi criada com sucesso.
              Agora é só fazer login e começar a usar o Bellify.
            </p>
            <Link to="/login" className="btn btn-primary">
              Ir para o Login
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // --- Tela de escolha (admin / profissional) ---
  if (escolhendoPerfil) {
    return (
      <div className="page cadastro">
        <main className="cadastro-main">
          <div className="cadastro-card">
            <div className="cadastro-brand">
              <img src={logoBellify} alt="Bellify" className="cadastro-logo-img" />
            </div>

            <h2>Criar sua conta</h2>
            <p className="cadastro-subtitle">
              Selecione o perfil para continuar.
            </p>

            <div className="perfis">
              {PERFIS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className="perfil-card"
                  onClick={() => selecionarPerfil(p.value)}
                >
                  <span className="perfil-card-label">{p.label}</span>
                  <span className="perfil-card-desc">{p.desc}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-outline btn-full"
              style={{ marginTop: 20 }}
              onClick={() => {
                setForm((f) => ({ ...inicial, perfil: 'cliente' }))
                setEscolhendoPerfil(false)
              }}
            >
              Voltar
            </button>

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

  // --- Formulário de cadastro (único, adapta por perfil) ---
  const subtitulos = {
    cliente: 'Cadastre-se e comece a agendar.',
    admin: 'Registre seu salão no Bellify.',
    profissional: 'Cadastre-se para atender clientes.',
  }

  return (
    <div className="page cadastro">
      <main className="cadastro-main">
        <div className="cadastro-card">
          <div className="cadastro-brand">
            <img src={logoBellify} alt="Bellify" className="cadastro-logo-img" />
          </div>

          <h2>Criar sua conta</h2>
          <p className="cadastro-subtitle">{subtitulos[form.perfil]}</p>

          {erroServidor && (
            <div className="alerta alerta-erro" role="alert">
              {erroServidor}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Nome — cliente e profissional */}
            {(form.perfil === 'cliente' || form.perfil === 'profissional') && (
              <div className={`campo ${erros.nome ? 'campo--erro' : ''}`}>
                <label htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder={form.perfil === 'cliente' ? 'Seu nome completo' : 'Seu nome profissional'}
                  value={form.nome}
                  onChange={handleChange}
                  autoComplete="name"
                />
                {erros.nome && <span className="campo-msg">{erros.nome}</span>}
              </div>
            )}

            {/* Admin — salão + endereço */}
            {form.perfil === 'admin' && (
              <>
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

                <div className={`campo ${erros.endereco ? 'campo--erro' : ''}`}>
                  <label htmlFor="endereco">Endereço do salão</label>
                  <input
                    id="endereco"
                    name="endereco"
                    type="text"
                    placeholder="Rua, número, bairro, cidade"
                    value={form.endereco}
                    onChange={handleChange}
                    autoComplete="street-address"
                  />
                  {erros.endereco && <span className="campo-msg">{erros.endereco}</span>}
                </div>
              </>
            )}

            {/* Profissional — especialidade */}
            {form.perfil === 'profissional' && (
              <div className={`campo ${erros.especialidade ? 'campo--erro' : ''}`}>
                <label htmlFor="especialidade">Especialidade</label>
                <select
                  id="especialidade"
                  name="especialidade"
                  value={form.especialidade}
                  onChange={handleChange}
                  className="campo-select"
                >
                  <option value="">Selecione...</option>
                  <option value="cabeleireiro">Cabeleireiro(a)</option>
                  <option value="manicure">Manicure</option>
                  <option value="esteticista">Esteticista</option>
                  <option value="maquiador">Maquiador(a)</option>
                  <option value="barbeiro">Barbeiro</option>
                  <option value="depilador">Depilador(a)</option>
                  <option value="massoterapeuta">Massoterapeuta</option>
                  <option value="outro">Outro</option>
                </select>
                {erros.especialidade && <span className="campo-msg">{erros.especialidade}</span>}
              </div>
            )}

            {/* Campos comuns */}
            <div className={`campo ${erros.email ? 'campo--erro' : ''}`}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
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

          {/* Link "Não sou cliente" só aparece no cadastro de cliente */}
          {form.perfil === 'cliente' && (
            <p className="cadastro-outro-perfil">
              <button
                type="button"
                className="link-btn"
                onClick={() => setEscolhendoPerfil(true)}
              >
                Não sou cliente
              </button>
            </p>
          )}

          {/* Botão Voltar para admin/profissional */}
          {form.perfil !== 'cliente' && (
            <button
              type="button"
              className="btn btn-outline btn-full"
              style={{ marginTop: 24 }}
              onClick={() => setEscolhendoPerfil(true)}
            >
              Voltar
            </button>
          )}

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
