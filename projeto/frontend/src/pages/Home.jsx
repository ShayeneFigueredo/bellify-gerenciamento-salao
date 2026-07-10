import { Link } from 'react-router-dom'
import logoBellify from '../assets/logo-bellify.png'
import './Home.css'

export default function Home() {
  return (
    <div className="page home">
      <main className="home-main">
        <div className="home-card">
          <img src={logoBellify} alt="Bellify" className="home-logo-img" />

          <h2>Bem-vinda(o)</h2>
          <p className="home-description">
            Encontre os melhores profissionais, escolha seu serviço e agende no
            horário que preferir. Tudo em um só lugar.
          </p>

          <div className="home-actions">
            <Link to="/cadastro" className="btn btn-primary btn-full">
              Criar minha conta
            </Link>
            <Link to="/login" className="btn btn-outline btn-full">
              Já tenho conta — Entrar
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
