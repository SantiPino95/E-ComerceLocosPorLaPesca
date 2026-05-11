import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'

function ListaProductos({ actualizar }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerProductos()
  }, [actualizar])

  const obtenerProductos = async () => {
    const { data, error } = await supabase.from('productos').select('*').order('id', { ascending: false })
    if (!error) setProductos(data)
    setCargando(false)
  }

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Seguro que querés eliminar este producto?')
    if (!confirmar) return
    await supabase.from('productos').delete().eq('id', id)
    obtenerProductos()
  }

  const toggleActivo = async (id, activo) => {
    await supabase.from('productos').update({ activo: !activo }).eq('id', id)
    obtenerProductos()
  }

  if (cargando) return <p>Cargando productos...</p>

  return (
    <div style={{ marginTop: '32px' }}>
      <h3>📦 Productos cargados</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#0077b6', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Imagen</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Precio</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Activo</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>
                {p.imagen_url
                  ? <img src={p.imagen_url} alt={p.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  : <span>Sin imagen</span>
                }
              </td>
              <td style={{ padding: '8px' }}>{p.nombre}</td>
              <td style={{ padding: '8px' }}>${p.precio}</td>
              <td style={{ padding: '8px' }}>
                <button onClick={() => toggleActivo(p.id, p.activo)} style={{
                  background: p.activo ? '#2a9d8f' : '#aaa',
                  color: 'white', border: 'none', padding: '4px 10px',
                  borderRadius: '4px', cursor: 'pointer'
                }}>
                  {p.activo ? 'Visible' : 'Oculto'}
                </button>
              </td>
              <td style={{ padding: '8px' }}>
                <button onClick={() => eliminarProducto(p.id)} style={{
                  background: '#e63946', color: 'white',
                  border: 'none', padding: '4px 10px',
                  borderRadius: '4px', cursor: 'pointer'
                }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListaProductos