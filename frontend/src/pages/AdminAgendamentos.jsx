import { useState, useEffect } from 'react'
import { Sidebar, Topbar } from './Dashboard'
import { listarTodosAgendamentos } from '../services/agendamentos'
import './AdminAgendamentos.css'

const STATUS_LABEL = {
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído',
  pendente: 'Pendente',
}

const FILTROS = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'confirmado', label: 'Confirmados' },
  { valor: 'cancelado', label: 'Cancelados' },
]

function formatarData(iso) {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('pt-BR')
}

export default function AdminAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => {
    listarTodosAgendamentos()
      .then((lista) =>
        setAgendamentos(
          [...lista].sort((a, b) =>
            `${b.data} ${b.hora}`.localeCompare(`${a.data} ${a.hora}`)
          )
        )
      )
      .finally(() => setCarregando(false))
  }, [])

  const filtrados =
    filtro === 'todos'
      ? agendamentos
      : agendamentos.filter((a) => a.status === filtro)

  return (
    <div className="layout-admin">
      <Sidebar active="agendamentos" />

      <div className="layout-main">
        <Topbar title="Agendamentos" />

        <div className="layout-content">
          <div className="adm-agend-header">
            <h2>Todos os agendamentos</h2>
            <div className="adm-agend-filtros">
              {FILTROS.map((f) => (
                <button
                  key={f.valor}
                  type="button"
                  className={`adm-agend-filtro ${filtro === f.valor ? 'adm-agend-filtro--ativo' : ''}`}
                  onClick={() => setFiltro(f.valor)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {carregando ? (
            <p className="adm-agend-info">Carregando...</p>
          ) : filtrados.length === 0 ? (
            <div className="adm-agend-vazio">
              <p className="adm-agend-vazio-titulo">Nenhum agendamento</p>
              <p className="adm-agend-vazio-desc">
                Os agendamentos feitos pelos clientes aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="adm-agend-tabela-wrapper">
              <table className="adm-agend-tabela">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Cliente</th>
                    <th>Serviço</th>
                    <th>Profissional</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((a) => (
                    <tr key={a.id}>
                      <td>{formatarData(a.data)}</td>
                      <td className="adm-agend-hora">{a.hora}</td>
                      <td>{a.cliente || 'Cliente'}</td>
                      <td>{a.servico?.nome}</td>
                      <td>{a.profissional?.nome}</td>
                      <td>
                        <span className={`adm-agend-badge adm-agend-badge--${a.status}`}>
                          {STATUS_LABEL[a.status] || a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
