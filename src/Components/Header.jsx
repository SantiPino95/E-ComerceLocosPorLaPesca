import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

function Header({ onBuscar }) {
  const navigate = useNavigate()
  const { session } = useAuth()

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 24px', background: '#0077b6',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        onClick={() => navigate('/')}>
        <span style={{ fontSize: '32px' }}>🎣</span>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
          Locos por la Pesca
        </span>
      </div>

      <input
        type="text"
        placeholder="Buscar productos..."
        onChange={e => onBuscar(e.target.value)}
        style={{
          padding: '8px 16px', borderRadius: '20px',
          border: 'none', width: '280px', fontSize: '14px'
        }}
      />

      {session ? (
        <button
          onClick={() => navigate('/admin')}
          style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.4)',
            color: 'white', padding: '6px 10px', borderRadius: '6px',
            cursor: 'pointer', fontSize: '16px'
          }}
          title="Ir al panel admin"
        >
          ⚙️
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.4)',
            color: 'white', padding: '6px 10px', borderRadius: '6px',
            cursor: 'pointer', fontSize: '16px'
          }}
          title="Acceso administrador"
        >
          🔐
        </button>
      )}

    </header>
  )
}

export default Header