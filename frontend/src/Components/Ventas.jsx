import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'

function Ventas() {
  console.log('Ventas - renderizando')
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [pedidoAbierto, setPedidoAbierto] = useState(null)

  useEffect(() => {
    obtenerPedidos()
  }, [])

  const obtenerPedidos = async () => {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, detalle_pedido(*, productos(nombre))')
      .order('created_at', { ascending: false })

    if (!error) setPedidos(data)
    setCargando(false)
  }

  const cambiarEstado = async (id, estado) => {
    await supabase.from('pedidos').update({ estado }).eq('id', id)
    obtenerPedidos()
  }

  if (cargando) return <p>Cargando ventas...</p>
  if (pedidos.length === 0) return <p>No hay pedidos todavía.</p>

  return (
    <div>
      <h3>📋 Registro de Ventas</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#0077b6', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Cliente</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Teléfono</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <>
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{p.id}</td>
                <td style={{ padding: '8px' }}>{p.nombre_cliente}</td>
                <td style={{ padding: '8px' }}>{p.telefono_cliente}</td>
                <td style={{ padding: '8px' }}>${p.total}</td>
                <td style={{ padding: '8px' }}>
                  <select
                    value={p.estado}
                    onChange={e => cambiarEstado(p.id, e.target.value)}
                    style={{
                      padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc',
                      background: p.estado === 'entregado' ? '#2a9d8f' : p.estado === 'cancelado' ? '#e63946' : '#f4a261',
                      color: 'white', cursor: 'pointer'
                    }}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
                <td style={{ padding: '8px' }}>
                  {new Date(p.created_at).toLocaleDateString('es-UY')}
                </td>
                <td style={{ padding: '8px' }}>
                  <button
                    onClick={() => setPedidoAbierto(pedidoAbierto === p.id ? null : p.id)}
                    style={{
                      background: '#0077b6', color: 'white',
                      border: 'none', padding: '4px 10px',
                      borderRadius: '4px', cursor: 'pointer'
                    }}
                  >
                    {pedidoAbierto === p.id ? 'Cerrar' : 'Ver'}
                  </button>
                </td>
              </tr>
              {pedidoAbierto === p.id && (
                <tr>
                  <td colSpan="7" style={{ padding: '8px', background: '#f8f9fa' }}>
                    <strong>Productos:</strong>
                    <ul>
                      {p.detalle_pedido.map(d => (
                        <li key={d.id}>
                          {d.productos.nombre} x{d.cantidad} — ${d.precio_unitario * d.cantidad}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Ventas