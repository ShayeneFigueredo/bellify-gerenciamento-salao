import { useState, useEffect } from 'react'
import { ProfSidebar, ProfTopbar } from './ProfissionalLayout'
import { listarTodosAgendamentos } from '../services/agendamentos'
import './ProfissionalAgenda.css'

const STATUS_LABEL = {
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído',
  pendente: 'Pendente',
}

function formatarDataLonga(iso) {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export default function ProfissionalAgenda() {
  const [agendamentos, setAgendamentos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarTodosAgendamentos()
      .then((lista) =>
        setAgendamentos(
          [...lista].sort((a, b) =>
            `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`)
          )
        )
      )
      .finally(() => setCarregando(false))
  }, [])

  const grupos = agendamentos.reduce((acc, a) => {
    ;(acc[a.data] ||= []).push(a)
    return acc
  }, {})
  const datas = Object.keys(grupos).sort()

  return (
    <div className="layout-admin">
      <ProfSidebar active="agenda" />

      <div className="layout-main">
        <ProfTopbar title="Minha agenda" />

        <div className="layout-content">
          <div className="agenda-cabecalho">
            <h2>Minha agenda</h2>
            <p className="agenda-subtitle">Todos os seus atendimentos agendados.</p>
          </div>

          {carregando ? (
            <p className="agenda-info">Carregando...</p>
          ) : datas.length === 0 ? (
            <div className="agenda-vazio">
              <p className="agenda-vazio-titulo">Nenhum atendimento agendado</p>
              <p className="agenda-vazio-desc">
                Quando um cliente marcar um horário com você, ele aparecerá aqui.
              </p>
            </div>
          ) : (
            <div className="agenda-grupos">
              {datas.map((d) => (
                <div key={d} className="agenda-grupo">
                  <h3 className="agenda-grupo-data">{formatarDataLonga(d)}</h3>
                  <div className="agenda-itens">
                    {grupos[d].map((a) => (
                      <div
                        key={a.id}
                        className={`agenda-item ${a.status === 'cancelado' ? 'agenda-item--cancelado' : ''}`}
                      >
                        <span className="agenda-item-hora">{a.hora}</span>
                        <div className="agenda-item-info">
                          <span className="agenda-item-servico">{a.servico?.nome}</span>
                          <span className="agenda-item-cliente">{a.cliente || 'Cliente'}</span>
                        </div>
                        <span className={`agenda-badge agenda-badge--${a.status}`}>
                          {STATUS_LABEL[a.status] || a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
