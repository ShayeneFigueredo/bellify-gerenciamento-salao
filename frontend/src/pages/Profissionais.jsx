import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Topbar, IconProfissionais, IconPlus } from './Dashboard'
import './Profissionais.css'

const profissionaisMock = []

export default function Profissionais() {
  const [profissionais] = useState(profissionaisMock)

  return (
    <div className="layout-admin">
      <Sidebar active="profissionais" />

      <div className="layout-main">
        <Topbar title="Profissionais" />

        <div className="layout-content">
          <div className="prof-header">
            <h2>Todos os profissionais</h2>
            <Link to="/admin/profissionais/novo" className="btn btn-primary">
              <IconPlus />
              Novo profissional
            </Link>
          </div>

          {profissionais.length === 0 ? (
            <div className="prof-vazio">
              <div className="prof-vazio-icon">
                <IconProfissionais />
              </div>
              <p className="prof-vazio-titulo">Nenhum profissional cadastrado</p>
              <p className="prof-vazio-desc">
                Cadastre os profissionais que atendem no salao para que os clientes possam agendar.
              </p>
              <Link to="/admin/profissionais/novo" className="btn btn-primary">
                <IconPlus />
                Cadastrar primeiro profissional
              </Link>
            </div>
          ) : (
            <div className="prof-tabela-wrapper">
              <table className="prof-tabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Especialidade</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {profissionais.map((p, i) => (
                    <tr key={i}>
                      <td className="prof-nome">{p.nome}</td>
                      <td>{p.especialidade}</td>
                      <td>{p.email}</td>
                      <td>{p.telefone}</td>
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
