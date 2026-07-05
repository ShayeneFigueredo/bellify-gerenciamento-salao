import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Servicos from './pages/Servicos'
import ServicosNovo from './pages/ServicosNovo'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/servicos" element={<Servicos />} />
      <Route path="/admin/servicos/novo" element={<ServicosNovo />} />
    </Routes>
  )
}

export default App
