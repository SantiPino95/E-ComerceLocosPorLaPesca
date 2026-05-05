import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import FormProducto from '../Components/Formproductos'
import ListaProductos from '../Components/ListaProductos'
import Tabs from '../Components/Tabs'
import Stock from '../Components/Stock'
import Ventas from '../Components/Ventas'

import { useAuth } from '../Context/AuthContext'
function Admin() {
  const [actualizar, setActualizar] = useState(0)
const [tabActiva, setTabActiva] = useState('Productos')
  const { session, loading } = useAuth()
  const navigate = useNavigate()

  console.log('Admin - loading:', loading, '| session:', session ? 'existe' : 'null')

  useEffect(() => {
    console.log('Admin useEffect - loading:', loading, '| session:', session ? 'existe' : 'null')
    if (!loading && !session) {
      console.log('REDIRIGIENDO AL LOGIN')
      navigate('/login')
    }
  }, [session, loading, navigate])

  if (loading) return <p>Cargando...</p>
  if (!session) return null
console.log("Hola")
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>⚙️ Panel Admin</h1>
        <Link to="/" style={{ textDecoration: 'none' }}>← Volver a la tienda</Link>
        <button 
          onClick={async () => { 
            await supabase.auth.signOut()
            navigate('/login')
          }} 
          style={{
            background: '#e63946', 
            color: 'white',
            border: 'none', 
            padding: '8px 16px',
            borderRadius: '6px', 
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </div>
      <p>Bienvenido, {session.user.email}</p>
      <hr />
      <Tabs tabs={['Productos', 'Ventas', 'Stock' ]}
      activo={tabActiva}
      onChange={setTabActiva}/>
      {tabActiva=== 'Productos' && ( <>
      <FormProducto onProductoGuardado={() => setActualizar(a => a + 1)} />
      <ListaProductos actualizar={actualizar} />
      </>
      )}

 {tabActiva === 'Ventas' && <Ventas/>
       
      }

      {tabActiva === 'Stock' && <Stock/>}

    </div>
  )
}

export default Admin