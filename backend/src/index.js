import express from 'express'
import cors from 'cors'
import db from './db.js'
import bcrypt from 'bcryptjs'
import clientesRouter from './routes/clientes.js'
import loginRouter from './routes/login.js'
import servicosRouter from './routes/servicos.js'
import profissionaisRouter from './routes/profissionais.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares globais
app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/clientes', clientesRouter)
app.use('/api/login', loginRouter)
app.use('/api/servicos', servicosRouter)
app.use('/api/profissionais', profissionaisRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Seed: cria admin padrão se não existir
function seed() {
  const adminExiste = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('admin@bellify.com')
  if (!adminExiste) {
    const hash = bcrypt.hashSync('admin123', 10)
    db.prepare(
      'INSERT INTO usuarios (nome, email, telefone, senha, tipo) VALUES (?, ?, ?, ?, ?)'
    ).run('Administrador', 'admin@bellify.com', '(11) 00000-0000', hash, 'admin')
    console.log('✅ Admin padrão criado: admin@bellify.com / admin123')
  }

  // Serviços de exemplo
  const temServicos = db.prepare('SELECT COUNT(*) as total FROM servicos').get()
  if (temServicos.total === 0) {
    const servicos = [
      ['Corte Feminino', 'Corte modelagem e finalização', 80.0, 60],
      ['Corte Masculino', 'Corte tesoura ou máquina', 50.0, 40],
      ['Coloração', 'Tintura completa com produtos profissionais', 150.0, 120],
      ['Manicure', 'Unhas das mãos — cutilagem e esmaltação', 40.0, 45],
      ['Pedicure', 'Unhas dos pés — cutilagem e esmaltação', 45.0, 50],
    ]
    const stmt = db.prepare(
      'INSERT INTO servicos (nome, descricao, preco, duracao_minutos) VALUES (?, ?, ?, ?)'
    )
    for (const s of servicos) {
      stmt.run(...s)
    }
    console.log('✅ Serviços de exemplo criados.')
  }

  // Profissionais de exemplo
  const temProfissionais = db.prepare('SELECT COUNT(*) as total FROM profissionais').get()
  if (temProfissionais.total === 0) {
    const profissionais = [
      ['Ana Silva', 'ana.silva@bellify.com', '(11) 91234-5678', 'Cabeleireira'],
      ['Beatriz Oliveira', 'beatriz.oliveira@bellify.com', '(11) 92345-6789', 'Manicure'],
      ['Carlos Santos', 'carlos.santos@bellify.com', '(11) 93456-7890', 'Barbeiro'],
    ]
    const stmt = db.prepare(
      'INSERT INTO profissionais (nome, email, telefone, especialidade) VALUES (?, ?, ?, ?)'
    )
    for (const p of profissionais) {
      stmt.run(...p)
    }
    console.log('✅ Profissionais de exemplo criados.')
  }
}

seed()

app.listen(PORT, () => {
  console.log(`🚀 Servidor Bellify rodando em http://localhost:${PORT}`)
})
