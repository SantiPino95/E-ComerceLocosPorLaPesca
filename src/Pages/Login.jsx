import { useState } from "react";
import { supabase } from "../Lib/supabase";
import { useNavigate, Link} from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setCargando(true)
    setError('')
const emailreal = `${email}@locosporlapesca.com`
    const { error } = await supabase.auth.signInWithPassword({ email: emailreal, password })

    if (error) {
      setError('Email o contraseña incorrectos')
      setCargando(false)
    } else {
      navigate('/admin')
    }
  }

  return (
     
    <div style={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', height: '100vh'
    }}>
      <div style={{
        border: '1px solid #ccc', padding: '32px',
        borderRadius: '8px', width: '320px'
      }}>
        <h2 style={{ textAlign: 'center' }}>🔐 Panel Admin</h2>
        <div style={{ marginBottom: '16px' }}>
          <label>Usuario</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
        <button
          onClick={handleLogin}
          disabled={cargando}
          style={{
            width: '100%', padding: '10px',
            background: '#0077b6', color: 'white',
            border: 'none', borderRadius: '6px', cursor: 'pointer'
          }}
        >
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
        <Link to="/" style={{
  color: 'white',
  padding: '8px 16px', borderRadius: '6px',
  textDecoration: 'none'
}}>
  ← Volver a la tienda
</Link>
      </div>
    </div>
  )
}

export default Login