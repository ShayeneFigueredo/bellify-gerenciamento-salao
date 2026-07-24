import { Link, NavLink, useNavigate } from 'react-router-dom'
import logoBellify from '../assets/logo-bellify.png'
import { IconUser } from './Dashboard'
import { logout } from '../services/auth'
import './ClienteLayout.css'

function nomeCliente() {
  try {
    const usuario = JSON.parse(localStorage.getItem('bellify_usuario') || '{}')
    if (usuario.nome) return usuario.nome.trim().split(' ')[0]
  } catch {
    // ignora conteúdo inválido no localStorage
  }
  return 'Cliente'
}

function ClienteHeader() {
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <header className="cliente-header">
      <Link to="/cliente/servicos" className="cliente-header-brand">
        <img src={logoBellify} alt="Bellify" className="cliente-header-logo" />
      </Link>

      <nav className="cliente-nav">
        <NavLink
          to="/cliente/servicos"
          className={({ isActive }) =>
            `cliente-nav-item ${isActive ? 'cliente-nav-item--ativo' : ''}`
          }
        >
          Serviços
        </NavLink>
        <NavLink
          to="/cliente/agendamentos"
          className={({ isActive }) =>
            `cliente-nav-item ${isActive ? 'cliente-nav-item--ativo' : ''}`
          }
        >
          Meus agendamentos
        </NavLink>
      </nav>

      <div className="cliente-header-user">
        <IconUser />
        <span>{nomeCliente()}</span>
        <button type="button" className="cliente-header-sair" onClick={sair}>
          Sair
        </button>
      </div>
    </header>
  )
}

function ClienteLayout({ children }) {
  return (
    <div className="cliente-page">
      <ClienteHeader />
      <main className="cliente-main">{children}</main>
    </div>
  )
}

export { ClienteLayout, ClienteHeader }
