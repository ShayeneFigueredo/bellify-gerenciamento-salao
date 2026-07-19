import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Topbar, IconCheck } from './Dashboard'
import { criarServico } from '../services/servicos'
import './Servicos.css'

const inicial = { nome: '', duracao: '', preco: '' }

export default function ServicosNovo() {
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
      novosErros.nome = 'Nome do serviço é obrigatório.'
    }

    if (!form.duracao.trim()) {
      novosErros.duracao = 'Duração é obrigatória.'
    } else {
      const minutos = Number(form.duracao)
      if (isNaN(minutos) || minutos <= 0 || !Number.isInteger(minutos)) {
        novosErros.duracao = 'Informe a duração em minutos (ex: 60).'
      }
    }

    if (!form.preco.trim()) {
      novosErros.preco = 'Preço é obrigatório.'
    } else {
      const valor = Number(form.preco.replace(',', '.'))
      if (isNaN(valor) || valor <= 0) {
        novosErros.preco = 'Informe um preço válido (ex: 80).'
      }
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
      await criarServico({
        nome: form.nome.trim(),
        duracao: Number(form.duracao),
        preco: Number(form.preco.replace(',', '.')),
      })
      setSucesso(true)
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.mensagem ||
        'Erro ao cadastrar serviço. Tente novamente.'
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
      <Sidebar active="servicos" />

      <div className="layout-main">
        <Topbar title="Serviços" />

        <div className="layout-content">
          <div className="servico-form-wrapper">
            <Link to="/admin/servicos" className="servico-voltar">
              ← Voltar para serviços
            </Link>

            {sucesso ? (
              <div className="servico-sucesso">
                <IconCheck />
                <h2>Serviço cadastrado!</h2>
                <p>
                  <strong>{form.nome}</strong> — {form.duracao} min — R$ {form.preco}
                </p>
                <div className="servico-sucesso-acoes">
                  <button onClick={resetForm} className="btn btn-outline">
                    Cadastrar outro
                  </button>
                  <Link to="/admin/servicos" className="btn btn-primary">
                    Ver serviços
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h2>Novo serviço</h2>
                <p className="servico-subtitle">
                  Adicione os serviços oferecidos pelo salão.
                </p>

                {erroServidor && (
                  <div className="alerta alerta-erro" role="alert">
                    {erroServidor}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className={`campo ${erros.nome ? 'campo--erro' : ''}`}>
                    <label htmlFor="nome">Nome do serviço</label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      placeholder="Ex: Corte feminino, Manicure, Hidratação..."
                      value={form.nome}
                      onChange={handleChange}
                    />
                    {erros.nome && <span className="campo-msg">{erros.nome}</span>}
                  </div>

                  <div className="servico-linha">
                    <div className={`campo ${erros.duracao ? 'campo--erro' : ''}`}>
                      <label htmlFor="duracao">Duração (minutos)</label>
                      <input
                        id="duracao"
                        name="duracao"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Ex: 60"
                        value={form.duracao}
                        onChange={handleChange}
                      />
                      {erros.duracao && <span className="campo-msg">{erros.duracao}</span>}
                    </div>

                    <div className={`campo ${erros.preco ? 'campo--erro' : ''}`}>
                      <label htmlFor="preco">Preço (R$)</label>
                      <input
                        id="preco"
                        name="preco"
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex: 80"
                        value={form.preco}
                        onChange={handleChange}
                      />
                      {erros.preco && <span className="campo-msg">{erros.preco}</span>}
                    </div>
                  </div>

                  <div className="servico-acoes">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={enviando}
                    >
                      {enviando ? 'Salvando...' : 'Cadastrar serviço'}
                    </button>
                    <Link to="/admin/servicos" className="btn btn-outline">
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
