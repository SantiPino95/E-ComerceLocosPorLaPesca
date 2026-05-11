import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext'
import Tienda from './Pages/Tienda'
import Login from './Pages/Login'
import Admin from './Pages/Admin'

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path='/login' element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
      </AuthProvider>
  )
}

export default App