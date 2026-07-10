import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminAgendamentos from './pages/AdminAgendamentos'
import Servicos from './pages/Servicos'
import ServicosNovo from './pages/ServicosNovo'
import Profissionais from './pages/Profissionais'
import ProfissionaisNovo from './pages/ProfissionaisNovo'
import ProfissionalDashboard from './pages/ProfissionalDashboard'
import ProfissionalHorarios from './pages/ProfissionalHorarios'
import ProfissionalAgenda from './pages/ProfissionalAgenda'
import ClienteServicos from './pages/ClienteServicos'
import ClienteAgendamento from './pages/ClienteAgendamento'
import ClienteAgendamentos from './pages/ClienteAgendamentos'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/agendamentos" element={<AdminAgendamentos />} />
      <Route path="/admin/servicos" element={<Servicos />} />
      <Route path="/admin/servicos/novo" element={<ServicosNovo />} />
      <Route path="/admin/profissionais" element={<Profissionais />} />
      <Route path="/admin/profissionais/novo" element={<ProfissionaisNovo />} />
      <Route path="/profissional" element={<ProfissionalDashboard />} />
      <Route path="/profissional/horarios" element={<ProfissionalHorarios />} />
      <Route path="/profissional/agenda" element={<ProfissionalAgenda />} />
      <Route path="/cliente" element={<Navigate to="/cliente/servicos" replace />} />
      <Route path="/cliente/servicos" element={<ClienteServicos />} />
      <Route path="/cliente/agendamento" element={<ClienteAgendamento />} />
      <Route path="/cliente/agendamentos" element={<ClienteAgendamentos />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
