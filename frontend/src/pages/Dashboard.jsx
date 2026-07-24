import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoBellify from '../assets/logo-bellify.png'
import bannerHome from '../assets/banner-admin.jpg'
import { obterIndicadores } from '../services/indicadores'
import { logout } from '../services/auth'
import './Dashboard.css'

/* ---- Ícones SVG inline ---- */

const IconServicos = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l-2 2 2 2"/><path d="M18 9l2 2-2 2"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/>
  </svg>
)

const IconProfissionais = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const IconAgendamentos = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><rect x="8" y="14" width="3" height="3" rx="0.5"/><rect x="13" y="14" width="3" height="3" rx="0.5"/>
  </svg>
)

const IconPlus = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)

const IconUserPlus = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
)

const IconList = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconCheck = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sucesso-check">
    <circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>
  </svg>
)

/* ---- Componentes de layout reaproveitáveis ---- */

const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const IconSair = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

function Sidebar({ active }) {
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <Link to="/admin" className="sidebar-brand">
        <img src={logoBellify} alt="Bellify" className="sidebar-logo-img" />
      </Link>

      <nav className="sidebar-nav">
        <Link to="/admin" className={`sidebar-item ${active === 'painel' ? 'sidebar-item--ativo' : ''}`}>
          <IconHome />
          Painel
        </Link>

        <span className="sidebar-section">Gestão</span>

        <Link to="/admin/servicos" className={`sidebar-item ${active === 'servicos' ? 'sidebar-item--ativo' : ''}`}>
          <IconServicos />
          Serviços
        </Link>

        <Link to="/admin/profissionais" className={`sidebar-item ${active === 'profissionais' ? 'sidebar-item--ativo' : ''}`}>
          <IconProfissionais />
          Profissionais
        </Link>

        <Link to="/admin/agendamentos" className={`sidebar-item ${active === 'agendamentos' ? 'sidebar-item--ativo' : ''}`}>
          <IconAgendamentos />
          Agendamentos
        </Link>
      </nav>

      <button type="button" className="sidebar-sair" onClick={sair}>
        <IconSair />
        Sair
      </button>
    </aside>
  )
}

function Topbar({ title }) {
  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-user">
        <IconUser />
        <span>Admin</span>
      </div>
    </header>
  )
}

/* ---- Página ---- */

const IconMoeda = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

const IconCancelado = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
)

function formatarPreco(v) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Dashboard() {
  const [ind, setInd] = useState(null)

  useEffect(() => {
    obterIndicadores().then(setInd)
  }, [])

  return (
    <div className="layout-admin">
      <Sidebar active="painel" />

      <div className="layout-main">
        <Topbar title="Painel do Salão" />

        <div className="layout-content">
          <div className="dashboard-banner">
            <img src={bannerHome} alt="Bellify" className="dashboard-banner-img" />
          </div>

          <div className="dashboard-indicadores">
            <h2>Indicadores do salão</h2>
            <div className="dashboard-cards">
              <div className="dash-card">
                <div className="dash-card-icon dash-card-icon--roxo">
                  <IconAgendamentos />
                </div>
                <div className="dash-card-info">
                  <span className="dash-card-numero">{ind ? ind.agendamentos : '—'}</span>
                  <span className="dash-card-label">Agendamentos ativos</span>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-icon dash-card-icon--verde">
                  <IconMoeda />
                </div>
                <div className="dash-card-info">
                  <span className="dash-card-numero">
                    {ind ? formatarPreco(ind.faturamento) : '—'}
                  </span>
                  <span className="dash-card-label">Faturamento previsto</span>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-icon dash-card-icon--vermelho">
                  <IconCancelado />
                </div>
                <div className="dash-card-info">
                  <span className="dash-card-numero">{ind ? ind.cancelamentos : '—'}</span>
                  <span className="dash-card-label">Cancelamentos</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-acoes">
            <h2>Ações rápidas</h2>
            <div className="acoes-grid">
              <Link to="/admin/servicos/novo" className="acao-card">
                <IconPlus />
                <span>Cadastrar serviço</span>
              </Link>

              <Link to="/admin/profissionais/novo" className="acao-card">
                <IconUserPlus />
                <span>Cadastrar profissional</span>
              </Link>

              <Link to="/admin/agendamentos" className="acao-card">
                <IconList />
                <span>Ver agendamentos</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Sidebar, Topbar, IconServicos, IconProfissionais, IconAgendamentos, IconPlus, IconUserPlus, IconList, IconUser, IconCheck, IconHome, IconSair }
