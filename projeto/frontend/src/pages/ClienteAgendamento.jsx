import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClienteLayout } from './ClienteLayout'
import { listarProfissionais } from '../services/profissionais'
import { horariosLivres, criarAgendamento } from '../services/agendamentos'
import './ClienteAgendamento.css'

function servicoEscolhido() {
  try {
    return JSON.parse(localStorage.getItem('bellify_servico_escolhido') || 'null')
  } catch {
    return null
  }
}

function nomeCliente() {
  try {
    const usuario = JSON.parse(localStorage.getItem('bellify_usuario') || '{}')
    if (usuario.nome) return usuario.nome
  } catch {
    // ignora conteúdo inválido
  }
  return 'Cliente'
}

function formatarPreco(v) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(iso) {
  if (!iso) return ''
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function hojeISO() {
  const hoje = new Date()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${hoje.getFullYear()}-${mes}-${dia}`
}

export default function ClienteAgendamento() {
  const servico = servicoEscolhido()
  const navigate = useNavigate()

  const [etapa, setEtapa] = useState(1)
  const [profissionais, setProfissionais] = useState([])
  const [profissional, setProfissional] = useState(null)
  const [data, setData] = useState('')
  const [slots, setSlots] = useState([])
  const [carregandoSlots, setCarregandoSlots] = useState(false)
  const [hora, setHora] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    listarProfissionais().then(setProfissionais)
  }, [])

  useEffect(() => {
    if (!profissional || !data) {
      setSlots([])
      return
    }
    let ativo = true
    setCarregandoSlots(true)
    setHora('')
    horariosLivres(profissional.id, data)
      .then((livres) => {
        if (ativo) setSlots(livres)
      })
      .finally(() => {
        if (ativo) setCarregandoSlots(false)
      })
    return () => {
      ativo = false
    }
  }, [profissional, data])

  if (!servico) {
    return (
      <ClienteLayout>
        <div className="agendamento-vazio">
          <p>Você ainda não escolheu um serviço.</p>
          <Link to="/cliente/servicos" className="btn btn-primary">
            Ver serviços
          </Link>
        </div>
      </ClienteLayout>
    )
  }

  async function confirmar() {
    setSalvando(true)
    try {
      await criarAgendamento({ servico, profissional, data, hora, cliente: nomeCliente() })
      setSucesso(true)
    } finally {
      setSalvando(false)
    }
  }

  if (sucesso) {
    return (
      <ClienteLayout>
        <div className="agendamento-sucesso">
          <div className="agendamento-sucesso-icone">✓</div>
          <h2>Agendamento confirmado!</h2>
          <p>
            <strong>{servico.nome}</strong> com <strong>{profissional.nome}</strong>
            <br />
            {formatarData(data)} às {hora}
          </p>
          <div className="agendamento-sucesso-acoes">
            <Link to="/cliente/agendamentos" className="btn btn-primary">
              Meus agendamentos
            </Link>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/cliente/servicos')}
            >
              Agendar outro
            </button>
          </div>
        </div>
      </ClienteLayout>
    )
  }

  return (
    <ClienteLayout>
      <div className="agendamento">
        <Link to="/cliente/servicos" className="agendamento-voltar">
          ← Voltar para serviços
        </Link>

        <div className="agendamento-servico">
          <span className="agendamento-servico-nome">{servico.nome}</span>
          <span className="agendamento-servico-meta">
            {servico.duracao} min · {formatarPreco(servico.preco)}
          </span>
        </div>

        <div className="agendamento-passos">
          <span className={`passo ${etapa >= 1 ? 'passo--ativo' : ''}`}>1. Profissional</span>
          <span className={`passo ${etapa >= 2 ? 'passo--ativo' : ''}`}>2. Data e hora</span>
          <span className={`passo ${etapa >= 3 ? 'passo--ativo' : ''}`}>3. Confirmar</span>
        </div>

        {etapa === 1 && (
          <div className="agendamento-bloco">
            <h3>Escolha o profissional</h3>
            {profissionais.length === 0 ? (
              <p className="agendamento-info">Nenhum profissional disponível.</p>
            ) : (
              <div className="prof-lista">
                {profissionais.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`prof-opcao ${profissional?.id === p.id ? 'prof-opcao--sel' : ''}`}
                    onClick={() => setProfissional(p)}
                  >
                    <span className="prof-opcao-nome">{p.nome}</span>
                    <span className="prof-opcao-esp">{p.especialidade}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="agendamento-nav">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!profissional}
                onClick={() => setEtapa(2)}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div className="agendamento-bloco">
            <h3>Escolha data e horário</h3>
            <div className="agendamento-campo">
              <label htmlFor="data">Data</label>
              <input
                id="data"
                type="date"
                min={hojeISO()}
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            {data &&
              (carregandoSlots ? (
                <p className="agendamento-info">Carregando horários...</p>
              ) : slots.length === 0 ? (
                <p className="agendamento-info">
                  Nenhum horário livre nesse dia. Tente outra data.
                </p>
              ) : (
                <div className="slots">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`slot ${hora === s ? 'slot--sel' : ''}`}
                      onClick={() => setHora(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ))}

            <div className="agendamento-nav">
              <button type="button" className="btn btn-outline" onClick={() => setEtapa(1)}>
                Voltar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!data || !hora}
                onClick={() => setEtapa(3)}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="agendamento-bloco">
            <h3>Confirme seu agendamento</h3>
            <div className="resumo">
              <div className="resumo-linha">
                <span>Serviço</span>
                <strong>{servico.nome}</strong>
              </div>
              <div className="resumo-linha">
                <span>Profissional</span>
                <strong>{profissional.nome}</strong>
              </div>
              <div className="resumo-linha">
                <span>Data</span>
                <strong>{formatarData(data)}</strong>
              </div>
              <div className="resumo-linha">
                <span>Horário</span>
                <strong>{hora}</strong>
              </div>
              <div className="resumo-linha">
                <span>Valor</span>
                <strong>{formatarPreco(servico.preco)}</strong>
              </div>
            </div>
            <div className="agendamento-nav">
              <button type="button" className="btn btn-outline" onClick={() => setEtapa(2)}>
                Voltar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={salvando}
                onClick={confirmar}
              >
                {salvando ? 'Confirmando...' : 'Confirmar agendamento'}
              </button>
            </div>
          </div>
        )}
      </div>
    </ClienteLayout>
  )
}
