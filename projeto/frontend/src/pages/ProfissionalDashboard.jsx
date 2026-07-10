import { useState, useEffect } from 'react'
import { ProfSidebar, ProfTopbar } from './ProfissionalLayout'
import { listarTodosAgendamentos } from '../services/agendamentos'
import './ProfissionalDashboard.css'

const STATUS_LABEL = {
  confirmado: 'Confirmado',
  pendente: 'Pendente',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

function primeiroNome() {
  try {
    const usuario = JSON.parse(localStorage.getItem('bellify_usuario') || '{}')
    if (usuario.nome) return usuario.nome.trim().split(' ')[0]
  } catch {
    // ignora conteúdo inválido no localStorage
  }
  return 'Profissional'
}

function hojeISO() {
  const hoje = new Date()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${hoje.getFullYear()}-${mes}-${dia}`
}

function dataHojeExtenso() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export default function ProfissionalDashboard() {
  const nome = primeiroNome()
  const [agenda, setAgenda] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const hoje = hojeISO()
    listarTodosAgendamentos()
      .then((lista) =>
        setAgenda(
          lista
            .filter((a) => a.data === hoje && a.status !== 'cancelado')
            .sort((a, b) => a.hora.localeCompare(b.hora))
        )
      )
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div className="layout-admin">
      <ProfSidebar active="inicio" />

      <div className="layout-main">
        <ProfTopbar title="Início" />

        <div className="layout-content">
          <div className="prof-inicio-boas-vindas">
            <h2>Bem-vindo(a), {nome}!</h2>
            <p className="prof-inicio-data">{dataHojeExtenso()}</p>
          </div>

          <section className="prof-agenda">
            <h3 className="prof-agenda-titulo">Agenda de hoje</h3>

            {carregando ? (
              <p className="prof-agenda-info">Carregando...</p>
            ) : agenda.length === 0 ? (
              <div className="prof-agenda-vazio">
                <p className="prof-agenda-vazio-titulo">Nenhum agendamento para hoje</p>
                <p className="prof-agenda-vazio-desc">
                  Quando um cliente marcar um horário com você, ele aparecerá aqui.
                </p>
              </div>
            ) : (
              <div className="prof-agenda-tabela-wrapper">
                <table className="prof-agenda-tabela">
                  <thead>
                    <tr>
                      <th>Horário</th>
                      <th>Cliente</th>
                      <th>Serviço</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agenda.map((a) => (
                      <tr key={a.id}>
                        <td className="prof-agenda-hora">{a.hora}</td>
                        <td>{a.cliente || 'Cliente'}</td>
                        <td>{a.servico?.nome}</td>
                        <td>
                          <span className={`prof-badge prof-badge--${a.status}`}>
                            {STATUS_LABEL[a.status] || a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
