import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Topbar, IconCheck } from './Dashboard'
import './Profissionais.css'

const inicial = { nome: '', email: '', telefone: '', especialidade: '' }

const ESPECIALIDADES = [
  'Cabeleireiro(a)',
  'Manicure',
  'Esteticista',
  'Maquiador(a)',
  'Barbeiro',
  'Depilador(a)',
  'Massoterapeuta',
  'Outro',
]

export default function ProfissionaisNovo() {
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

    if (!form.nome.trim()) {
      novosErros.nome = 'Nome e obrigatorio.'
    } else if (form.nome.trim().length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres.'
    }

    if (!form.email.trim()) {
      novosErros.email = 'E-mail e obrigatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      novosErros.email = 'Informe um e-mail valido.'
    }

    if (!form.telefone.trim()) {
      novosErros.telefone = 'Telefone e obrigatorio.'
    } else {
      const numeros = form.telefone.replace(/\D/g, '')
      if (numeros.length < 10 || numeros.length > 11) {
        novosErros.telefone = 'Informe um telefone valido (DDD + numero).'
      }
    }

    if (!form.especialidade.trim()) {
      novosErros.especialidade = 'Especialidade e obrigatoria.'
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
      // TODO: integrar com API - POST /api/profissionais
      console.log('Cadastrar profissional:', {
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        especialidade: form.especialidade,
      })
      setSucesso(true)
    } catch (err) {
      const msg =
        err.response?.data?.mensagem ||
        'Erro ao cadastrar profissional. Tente novamente.'
      setErroServidor(msg)
    } finally {
      setEnviando(false)
    }
  }

  function resetForm() {
    setForm(inicial)
    setErros({})
    setErroServidor('')
    setEnviando(false)
    setSucesso(false)
  }

  return (
    <div className="layout-admin">
      <Sidebar active="profissionais" />

      <div className="layout-main">
        <Topbar title="Profissionais" />

        <div className="layout-content">
          <div className="prof-form-wrapper">
            <Link to="/admin/profissionais" className="prof-voltar">
              Voltar para profissionais
            </Link>

            {sucesso ? (
              <div className="prof-sucesso">
                <IconCheck />
                <h2>Profissional cadastrado!</h2>
                <p>
                  <strong>{form.nome}</strong> foi adicionado a equipe do salao.
                </p>
                <div className="prof-sucesso-acoes">
                  <button onClick={resetForm} className="btn btn-outline">
                    Cadastrar outro
                  </button>
                  <Link to="/admin/profissionais" className="btn btn-primary">
                    Ver profissionais
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h2>Novo profissional</h2>
                <p className="prof-subtitle">
                  Adicione um profissional a equipe do salao.
                </p>

                {erroServidor && (
                  <div className="alerta alerta-erro" role="alert">
                    {erroServidor}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className={`campo ${erros.nome ? 'campo--erro' : ''}`}>
                    <label htmlFor="nome">Nome completo</label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      placeholder="Nome do profissional"
                      value={form.nome}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                    {erros.nome && <span className="campo-msg">{erros.nome}</span>}
                  </div>

                  <div className={`campo ${erros.email ? 'campo--erro' : ''}`}>
                    <label htmlFor="email">E-mail</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@exemplo.com"
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
                      {ESPECIALIDADES.map((e) => (
                        <option key={e} value={e.toLowerCase()}>{e}</option>
                      ))}
                    </select>
                    {erros.especialidade && (
                      <span className="campo-msg">{erros.especialidade}</span>
                    )}
                  </div>

                  <div className="prof-acoes">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={enviando}
                    >
                      {enviando ? 'Salvando...' : 'Cadastrar profissional'}
                    </button>
                    <Link to="/admin/profissionais" className="btn btn-outline">
                      Cancelar
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
