import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { useCliente } from '../Context/ClienteContext'
import { useState } from 'react'
import LoginCliente from '../Pages/LoginCliente'

function Header({ onBuscar }) {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { cliente, logout } = useCliente()
  const [mostrarLogin, setMostrarLogin] = useState(false)

  return (
    <>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', background: '#0077b6',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <span style={{ fontSize: '32px' }}>🎣</span>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
            Locos por la Pesca
          </span>
        </div>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar productos..."
          onChange={e => onBuscar(e.target.value)}
          style={{
            padding: '8px 16px', borderRadius: '20px',
            border: 'none', width: '280px', fontSize: '14px'
          }}
        />

        {/* Derecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {cliente ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'white', fontSize: '14px' }}>
                👤 {cliente.nombre}
              </span>
              <button onClick={logout} style={{
                background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
                color: 'white', padding: '6px 12px', borderRadius: '6px',
                cursor: 'pointer', fontSize: '13px'
              }}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button onClick={() => setMostrarLogin(true)} style={{
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
              color: 'white', padding: '6px 12px', borderRadius: '6px',
              cursor: 'pointer', fontSize: '13px'
            }}>
              👤 Ingresar
            </button>
          )}

          {session ? (
            <button onClick={() => navigate('/admin')} style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.4)',
              color: 'white', padding: '6px 10px', borderRadius: '6px',
              cursor: 'pointer', fontSize: '16px'
            }} title="Ir al panel admin">
              ⚙️
            </button>
          ) : (
            <button onClick={() => navigate('/login')} style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.4)',
              color: 'white', padding: '6px 10px', borderRadius: '6px',
              cursor: 'pointer', fontSize: '16px'
            }} title="Acceso administrador">
              🔐
            </button>
          )}
        </div>
      </header>

      {mostrarLogin && <LoginCliente onCerrar={() => setMostrarLogin(false)} />}
    </>
  )
}

export default Header