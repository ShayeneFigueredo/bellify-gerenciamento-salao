import { useState, useEffect } from 'react'
import { ProfSidebar, ProfTopbar } from './ProfissionalLayout'
import { carregarHorarios, salvarHorarios } from '../services/profissionais'
import './ProfissionalHorarios.css'

const DIAS = [
  { key: 'segunda', label: 'Segunda-feira' },
  { key: 'terca', label: 'Terça-feira' },
  { key: 'quarta', label: 'Quarta-feira' },
  { key: 'quinta', label: 'Quinta-feira' },
  { key: 'sexta', label: 'Sexta-feira' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
]

function usuarioId() {
  try {
    const usuario = JSON.parse(localStorage.getItem('bellify_usuario') || '{}')
    return usuario.id ?? null
  } catch {
    return null
  }
}

function gerarInicial() {
  const util = { ativo: true, inicio: '09:00', fim: '18:00' }
  return {
    segunda: { ...util },
    terca: { ...util },
    quarta: { ...util },
    quinta: { ...util },
    sexta: { ...util },
    sabado: { ativo: false, inicio: '09:00', fim: '13:00' },
    domingo: { ativo: false, inicio: '09:00', fim: '18:00' },
  }
}

export default function ProfissionalHorarios() {
  const [horarios, setHorarios] = useState(gerarInicial)
  const [erros, setErros] = useState({})
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erroServidor, setErroServidor] = useState('')

  // Carrega a grade salva do profissional.
  useEffect(() => {
    const id = usuarioId()
    if (!id) return
    carregarHorarios(id)
      .then((grade) => {
        if (grade && typeof grade === 'object') {
          setHorarios((atual) => ({ ...atual, ...grade }))
        }
      })
      .catch(() => {
        // sem backend ainda — mantém a grade padrão
      })
  }, [])

  function limparFeedback(key) {
    if (key && erros[key]) setErros((e) => ({ ...e, [key]: '' }))
    if (sucesso) setSucesso(false)
    if (erroServidor) setErroServidor('')
  }

  function toggleDia(key) {
    setHorarios((h) => ({ ...h, [key]: { ...h[key], ativo: !h[key].ativo } }))
    limparFeedback(key)
  }

  function alterarHora(key, campo, value) {
    setHorarios((h) => ({ ...h, [key]: { ...h[key], [campo]: value } }))
    limparFeedback(key)
  }

  function aplicarDiasUteis() {
    const base = horarios.segunda
    setHorarios((h) => ({
      ...h,
      terca: { ...base },
      quarta: { ...base },
      quinta: { ...base },
      sexta: { ...base },
    }))
    limparFeedback()
  }

  function validar() {
    const novos = {}
    for (const { key } of DIAS) {
      const dia = horarios[key]
      if (!dia.ativo) continue
      if (!dia.inicio || !dia.fim) {
        novos[key] = 'Informe o horário de início e fim.'
      } else if (dia.fim <= dia.inicio) {
        novos[key] = 'O horário de fim deve ser depois do início.'
      }
    }
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validar()) return

    setSalvando(true)
    setErroServidor('')
    try {
      await salvarHorarios(usuarioId(), horarios)
      setSucesso(true)
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.mensagem ||
        'Erro ao salvar os horários. Tente novamente.'
      setErroServidor(msg)
    } finally {
      setSalvando(false)
    }
  }

  const algumDiaAtivo = DIAS.some(({ key }) => horarios[key].ativo)

  return (
    <div className="layout-admin">
      <ProfSidebar active="horarios" />

      <div className="layout-main">
        <ProfTopbar title="Meus horários" />

        <div className="layout-content">
          <div className="horarios-wrapper">
            <div className="horarios-cabecalho">
              <div>
                <h2>Horários de atendimento</h2>
                <p className="horarios-subtitle">
                  Defina os dias e as faixas de horário em que você atende. Os
                  clientes só poderão agendar dentro dessas faixas.
                </p>
              </div>
              <button
                type="button"
                className="horarios-aplicar"
                onClick={aplicarDiasUteis}
              >
                Aplicar segunda aos dias úteis
              </button>
            </div>

            {sucesso && (
              <div className="alerta alerta-sucesso" role="status">
                Horários salvos com sucesso.
              </div>
            )}

            {erroServidor && (
              <div className="alerta alerta-erro" role="alert">
                {erroServidor}
              </div>
            )}

            {!algumDiaAtivo && (
              <div className="alerta alerta-aviso" role="alert">
                Você não atende em nenhum dia. Ative pelo menos um dia para
                receber agendamentos.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="horarios-lista">
                {DIAS.map(({ key, label }) => {
                  const dia = horarios[key]
                  return (
                    <div
                      key={key}
                      className={`horario-item ${dia.ativo ? '' : 'horario-item--inativo'}`}
                    >
                      <div className="horario-linha">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={dia.ativo}
                            onChange={() => toggleDia(key)}
                            aria-label={`Atender ${label}`}
                          />
                          <span className="switch-slider" />
                        </label>

                        <span className="horario-dia">{label}</span>

                        {dia.ativo ? (
                          <div className="horario-intervalo">
                            <input
                              type="time"
                              value={dia.inicio}
                              onChange={(e) => alterarHora(key, 'inicio', e.target.value)}
                              aria-label={`Início ${label}`}
                            />
                            <span className="horario-ate">até</span>
                            <input
                              type="time"
                              value={dia.fim}
                              onChange={(e) => alterarHora(key, 'fim', e.target.value)}
                              aria-label={`Fim ${label}`}
                            />
                          </div>
                        ) : (
                          <span className="horario-fechado">Não atende</span>
                        )}
                      </div>

                      {erros[key] && <span className="campo-msg">{erros[key]}</span>}
                    </div>
                  )
                })}
              </div>

              <div className="horarios-acoes">
                <button type="submit" className="btn btn-primary" disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar horários'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
