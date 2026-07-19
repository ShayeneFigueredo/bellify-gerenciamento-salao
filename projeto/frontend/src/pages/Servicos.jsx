import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Topbar, IconServicos, IconPlus } from './Dashboard'
import { listarServicos } from '../services/servicos'
import './Servicos.css'

function formatarPreco(v) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Servicos() {
  const [servicos, setServicos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarServicos()
      .then(setServicos)
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div className="layout-admin">
      <Sidebar active="servicos" />

      <div className="layout-main">
        <Topbar title="Serviços" />

        <div className="layout-content">
          <div className="servico-header">
            <h2>Todos os serviços</h2>
            <Link to="/admin/servicos/novo" className="btn btn-primary">
              <IconPlus />
              Novo serviço
            </Link>
          </div>

          {carregando ? (
            <p className="servico-info">Carregando serviços...</p>
          ) : servicos.length === 0 ? (
            <div className="servico-vazio">
              <div className="servico-vazio-icon">
                <IconServicos />
              </div>
              <p className="servico-vazio-titulo">Nenhum serviço cadastrado</p>
              <p className="servico-vazio-desc">
                Cadastre os serviços oferecidos pelo salão para que os clientes possam agendar.
              </p>
              <Link to="/admin/servicos/novo" className="btn btn-primary">
                <IconPlus />
                Cadastrar primeiro serviço
              </Link>
            </div>
          ) : (
            <div className="servico-tabela-wrapper">
              <table className="servico-tabela">
                <thead>
                  <tr>
                    <th>Serviço</th>
                    <th>Duração</th>
                    <th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {servicos.map((s) => (
                    <tr key={s.id}>
                      <td className="servico-nome">{s.nome}</td>
                      <td>{s.duracao} min</td>
                      <td>{formatarPreco(s.preco)}</td>
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
