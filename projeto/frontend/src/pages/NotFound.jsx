import { Link } from 'react-router-dom'
import logoBellify from '../assets/logo-bellify.png'
import './Home.css'

export default function NotFound() {
  return (
    <div className="page home">
      <main className="home-main">
        <div className="home-card">
          <img src={logoBellify} alt="Bellify" className="home-logo-img" />

          <h2>Página não encontrada</h2>
          <p className="home-description">
            O endereço que você tentou acessar não existe ou foi movido.
          </p>

          <div className="home-actions">
            <Link to="/" className="btn btn-primary btn-full">
              Voltar ao início
            </Link>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <p>Bellify © 2026 — Trabalho Acadêmico</p>
      </footer>
    </div>
  )
}
