import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClienteLayout } from './ClienteLayout'
import { listarServicos } from '../services/servicos'
import './ClienteServicos.css'

function primeiroNome() {
  try {
    const usuario = JSON.parse(localStorage.getItem('bellify_usuario') || '{}')
    if (usuario.nome) return usuario.nome.trim().split(' ')[0]
  } catch {
    // ignora conteúdo inválido no localStorage
  }
  return 'Cliente'
}

function formatarPreco(preco) {
  return Number(preco).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export default function ClienteServicos() {
  const [servicos, setServicos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let ativo = true
    listarServicos()
      .then((lista) => {
        if (ativo) setServicos(lista)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  const filtrados = servicos.filter((s) =>
    s.nome.toLowerCase().includes(busca.trim().toLowerCase())
  )

  function escolher() {
    const servico = servicos.find((s) => s.id === selecionado)
    if (!servico) return
    // Guarda a escolha para a próxima etapa (agendamento — SCRUM 21).
    localStorage.setItem('bellify_servico_escolhido', JSON.stringify(servico))
    navigate('/cliente/agendamento')
  }

  return (
    <ClienteLayout>
      <div className="servicos-cliente">
        <div className="servicos-cliente-cabecalho">
          <h2>Bem-vindo(a), {primeiroNome()}!</h2>
          <p className="servicos-cliente-subtitle">
            Escolha o serviço que você deseja agendar.
          </p>
        </div>

        <div className="servicos-busca">
          <input
            type="search"
            placeholder="Buscar serviço..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar serviço"
          />
        </div>

        {carregando ? (
          <p className="servicos-estado">Carregando serviços...</p>
        ) : filtrados.length === 0 ? (
          <div className="servicos-vazio">
            <p className="servicos-vazio-titulo">
              {servicos.length === 0
                ? 'Nenhum serviço disponível'
                : 'Nenhum serviço encontrado'}
            </p>
            <p className="servicos-vazio-desc">
              {servicos.length === 0
                ? 'Assim que o salão cadastrar serviços, eles aparecerão aqui.'
                : 'Tente buscar por outro nome.'}
            </p>
          </div>
        ) : (
          <div className="servicos-grid">
            {filtrados.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`servico-card ${selecionado === s.id ? 'servico-card--selecionado' : ''}`}
                onClick={() => setSelecionado(s.id)}
                aria-pressed={selecionado === s.id}
              >
                <span className="servico-card-nome">{s.nome}</span>
                <span className="servico-card-meta">
                  <span className="servico-card-duracao">{s.duracao} min</span>
                  <span className="servico-card-preco">{formatarPreco(s.preco)}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {selecionado && (
          <div className="servicos-rodape">
            <button type="button" className="btn btn-primary" onClick={escolher}>
              Escolher e continuar
            </button>
          </div>
        )}
      </div>
    </ClienteLayout>
  )
}
