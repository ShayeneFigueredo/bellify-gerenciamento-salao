import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClienteLayout } from './ClienteLayout'
import { listarMeusAgendamentos, cancelarAgendamento } from '../services/agendamentos'
import './ClienteAgendamento.css'

const STATUS_LABEL = {
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído',
}

function formatarData(iso) {
  if (!iso) return ''
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function ehPassado(data, hora) {
  const [a, m, d] = data.split('-').map(Number)
  const [h, min] = hora.split(':').map(Number)
  return new Date(a, m - 1, d, h, min) < new Date()
}

export default function ClienteAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [confirmando, setConfirmando] = useState(null)
  const [cancelando, setCancelando] = useState(false)

  useEffect(() => {
    listarMeusAgendamentos()
      .then(setAgendamentos)
      .finally(() => setCarregando(false))
  }, [])

  async function confirmarCancelamento() {
    if (!confirmando) return
    setCancelando(true)
    try {
      await cancelarAgendamento(confirmando.id)
      setAgendamentos((lista) =>
        lista.map((a) =>
          a.id === confirmando.id ? { ...a, status: 'cancelado' } : a
        )
      )
      setConfirmando(null)
    } finally {
      setCancelando(false)
    }
  }

  return (
    <ClienteLayout>
      <div className="meus-agend">
        <div className="meus-agend-cabecalho">
          <h2>Meus agendamentos</h2>
          <Link to="/cliente/servicos" className="btn btn-primary">
            Novo agendamento
          </Link>
        </div>

        {carregando ? (
          <p className="agendamento-info">Carregando...</p>
        ) : agendamentos.length === 0 ? (
          <div className="meus-agend-vazio">
            <p className="meus-agend-vazio-titulo">Você ainda não tem agendamentos</p>
            <p className="meus-agend-vazio-desc">
              Escolha um serviço para marcar seu primeiro horário.
            </p>
            <Link to="/cliente/servicos" className="btn btn-primary">
              Ver serviços
            </Link>
          </div>
        ) : (
          <div className="agend-lista">
            {agendamentos.map((a) => {
              const podeCancelar = a.status === 'confirmado' && !ehPassado(a.data, a.hora)
              return (
                <div
                  key={a.id}
                  className={`agend-card ${a.status === 'cancelado' ? 'agend-card--cancelado' : ''}`}
                >
                  <div className="agend-card-info">
                    <span className="agend-card-servico">{a.servico?.nome}</span>
                    <span className="agend-card-prof">com {a.profissional?.nome}</span>
                    <span className="agend-card-quando">
                      {formatarData(a.data)} · {a.hora}
                    </span>
                  </div>
                  <div className="agend-card-lado">
                    <span className={`agend-badge agend-badge--${a.status}`}>
                      {STATUS_LABEL[a.status] || a.status}
                    </span>
                    {podeCancelar && (
                      <button
                        type="button"
                        className="agend-cancelar"
                        onClick={() => setConfirmando(a)}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {confirmando && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>Cancelar agendamento?</h3>
            <p>
              Tem certeza que deseja cancelar{' '}
              <strong>{confirmando.servico?.nome}</strong> com{' '}
              {confirmando.profissional?.nome} em {formatarData(confirmando.data)} às{' '}
              {confirmando.hora}?
            </p>
            <div className="modal-acoes">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setConfirmando(null)}
                disabled={cancelando}
              >
                Voltar
              </button>
              <button
                type="button"
                className="btn btn-perigo"
                onClick={confirmarCancelamento}
                disabled={cancelando}
              >
                {cancelando ? 'Cancelando...' : 'Sim, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ClienteLayout>
  )
}
