import { Link, useNavigate } from 'react-router-dom'
import logoBellify from '../assets/logo-bellify.png'
import { IconAgendamentos, IconUser, IconHome, IconSair } from './Dashboard'
import { logout } from '../services/auth'
import './Dashboard.css'

/* ---- Ícone próprio da área do profissional ---- */

const IconRelogio = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
)

/* ---- Layout reaproveitável da área do profissional ---- */

function ProfSidebar({ active }) {
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <Link to="/profissional/horarios" className="sidebar-brand">
        <img src={logoBellify} alt="Bellify" className="sidebar-logo-img" />
      </Link>

      <nav className="sidebar-nav">
        <Link
          to="/profissional"
          className={`sidebar-item ${active === 'inicio' ? 'sidebar-item--ativo' : ''}`}
        >
          <IconHome />
          Início
        </Link>

        <span className="sidebar-section">Atendimento</span>

        <Link
          to="/profissional/horarios"
          className={`sidebar-item ${active === 'horarios' ? 'sidebar-item--ativo' : ''}`}
        >
          <IconRelogio />
          Meus horários
        </Link>

        <Link
          to="/profissional/agenda"
          className={`sidebar-item ${active === 'agenda' ? 'sidebar-item--ativo' : ''}`}
        >
          <IconAgendamentos />
          Minha agenda
        </Link>
      </nav>

      <button type="button" className="sidebar-sair" onClick={sair}>
        <IconSair />
        Sair
      </button>
    </aside>
  )
}

function ProfTopbar({ title }) {
  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-user">
        <IconUser />
        <span>Profissional</span>
      </div>
    </header>
  )
}

export { ProfSidebar, ProfTopbar, IconRelogio }
