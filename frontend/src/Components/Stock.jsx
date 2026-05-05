import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'

function Stock() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerProductos()
  }, [])

  const obtenerProductos = async () => {
    const { data, error } = await supabase.from('productos').select('*').order('nombre')
    if (!error) setProductos(data)
    setCargando(false)
  }

  const actualizarStock = async (id, nuevoStock) => {
    if (nuevoStock < 0) return
    await supabase.from('productos').update({ stock: nuevoStock }).eq('id', id)
    setProductos(prev => prev.map(p => p.id === id ? { ...p, stock: nuevoStock } : p))
  }

  if (cargando) return <p>Cargando stock...</p>

  return (
    <div>
      <h3>📊 Control de Stock</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#0077b6', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Producto</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Stock actual</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{p.nombre}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  fontWeight: 'bold',
                  color: p.stock === 0 ? '#e63946' : p.stock < 5 ? '#f4a261' : '#2a9d8f'
                }}>
                  {p.stock} unidades
                </span>
              </td>
              <td style={{ padding: '10px' }}>
  <input
    type="number"
    value={p.stock}
    min="0"
    onChange={e => actualizarStock(p.id, parseInt(e.target.value) || 0)}
    style={{
      width: '80px', padding: '6px',
      border: '1px solid #ccc', borderRadius: '4px',
      textAlign: 'center', fontSize: '16px'
    }}
  />
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Stock