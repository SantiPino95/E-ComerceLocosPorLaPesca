import { useState } from 'react'
import { useCliente } from '../Context/ClienteContext'

function LoginCliente({ onCerrar }) {
  const { login, registro } = useCliente()
  const [modo, setModo] = useState('login') // 'login' o 'registro'
  const [cedula, setCedula] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async () => {
    if (!cedula) { setError('Ingresá tu cédula'); return }
    setCargando(true)
    setError('')
    const result = await login(cedula)
    if (!result.ok) setError(result.mensaje)
    else onCerrar()
    setCargando(false)
  }

  const handleRegistro = async () => {
    if (!nombre || !apellido || !telefono || !cedula) {
      setError('Completá todos los campos')
      return
    }
    setCargando(true)
    setError('')
    const result = await registro(nombre, apellido, telefono, cedula)
    if (!result.ok) setError(result.mensaje)
    else onCerrar()
    setCargando(false)
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div style={{
        background: 'white', borderRadius: '16px',
        padding: '32px', width: '360px', maxWidth: '90vw'
      }}>
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>
          {modo === 'login' ? '👤 Iniciar sesión' : '📝 Registrarse'}
        </h2>

        {modo === 'registro' && (
          <>
            <input placeholder="Nombre" value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input placeholder="Apellido" value={apellido}
              onChange={e => setApellido(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input placeholder="Teléfono" value={telefono}
              onChange={e => setTelefono(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} />
          </>
        )}

        <input placeholder="Cédula" value={cedula}
          onChange={e => setCedula(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} />

        {error && <p style={{ color: 'red', fontSize: '14px', margin: '0 0 10px 0' }}>{error}</p>}

        <button
          onClick={modo === 'login' ? handleLogin : handleRegistro}
          disabled={cargando}
          style={{
            width: '100%', padding: '12px', background: '#0077b6',
            color: 'white', border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 'bold', marginBottom: '12px'
          }}
        >
          {cargando ? 'Procesando...' : modo === 'login' ? 'Entrar' : 'Registrarse'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', margin: '0 0 12px 0' }}>
          {modo === 'login'
            ? <>¿No tenés cuenta? <span onClick={() => setModo('registro')} style={{ color: '#0077b6', cursor: 'pointer', fontWeight: 'bold' }}>Registrate</span></>
            : <>¿Ya tenés cuenta? <span onClick={() => setModo('login')} style={{ color: '#0077b6', cursor: 'pointer', fontWeight: 'bold' }}>Iniciá sesión</span></>
          }
        </p>

        <button onClick={onCerrar} style={{
          width: '100%', padding: '10px', background: '#eee',
          color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default LoginCliente