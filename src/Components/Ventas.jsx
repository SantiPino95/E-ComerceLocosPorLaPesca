import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function Ventas() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [pedidoAbierto, setPedidoAbierto] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroPeriodo, setFiltroPeriodo] = useState('todo')

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

  const filtrarPorPeriodo = (pedido) => {
    const fecha = new Date(pedido.created_at)
    const hoy = new Date()
    if (filtroPeriodo === 'semana') {
      const hace7dias = new Date()
      hace7dias.setDate(hoy.getDate() - 7)
      return fecha >= hace7dias
    }
    if (filtroPeriodo === 'mes') {
      return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()
    }
    return true
  }

  const pedidosFiltrados = pedidos
    .filter(p => filtroEstado === 'todos' || p.estado === filtroEstado)
    .filter(filtrarPorPeriodo)

  const totalRecaudado = pedidosFiltrados
    .filter(p => p.estado !== 'cancelado')
    .reduce((acc, p) => acc + parseFloat(p.total), 0)

  const productoMasVendido = () => {
    const conteo = {}
    pedidosFiltrados.forEach(p => {
      p.detalle_pedido.forEach(d => {
        const nombre = d.productos.nombre
        conteo[nombre] = (conteo[nombre] || 0) + d.cantidad
      })
    })
    const max = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]
    return max ? `${max[0]} (${max[1]} unidades)` : 'Sin datos'
  }

  const exportarPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Locos por la Pesca - Reporte de Ventas', 14, 15)
    doc.setFontSize(11)
    doc.text(`Período: ${filtroPeriodo === 'semana' ? 'Esta semana' : filtroPeriodo === 'mes' ? 'Este mes' : 'Todo'}`, 14, 25)
    doc.text(`Total recaudado: $${totalRecaudado.toFixed(2)}`, 14, 32)
    doc.text(`Pedidos: ${pedidosFiltrados.length}`, 14, 39)
    doc.text(`Producto más vendido: ${productoMasVendido()}`, 14, 46)

    autoTable(doc, {
      startY: 55,
      head: [['#', 'Cliente', 'Teléfono', 'Total', 'Estado', 'Fecha']],
      body: pedidosFiltrados.map(p => [
        p.id,
        p.nombre_cliente,
        p.telefono_cliente,
        `$${p.total}`,
        p.estado,
        new Date(p.created_at).toLocaleDateString('es-UY')
      ])
    })

    doc.save(`ventas-${filtroPeriodo}-${new Date().toLocaleDateString('es-UY')}.pdf`)
  }

  if (cargando) return <p>Cargando ventas...</p>

  return (
    <div>
      <h3>📋 Registro de Ventas</h3>

      {/* Resumen */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#0077b6', color: 'white', padding: '16px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px' }}>TOTAL RECAUDADO</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>${totalRecaudado.toFixed(2)}</p>
        </div>
        <div style={{ background: '#2a9d8f', color: 'white', padding: '16px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px' }}>PEDIDOS</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{pedidosFiltrados.length}</p>
        </div>
        <div style={{ background: '#f4a261', color: 'white', padding: '16px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px' }}>MÁS VENDIDO</p>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{productoMasVendido()}</p>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <select value={filtroPeriodo} onChange={e => setFiltroPeriodo(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="todo">Todo</option>
          <option value="semana">Esta semana</option>
          <option value="mes">Este mes</option>
        </select>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <button onClick={exportarPDF} style={{
          background: '#e63946', color: 'white',
          border: 'none', padding: '8px 16px',
          borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto'
        }}>
          📄 Exportar PDF
        </button>
      </div>

      {pedidosFiltrados.length === 0
        ? <p>No hay pedidos para este período.</p>
        : (
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
              {pedidosFiltrados.map(p => (
                <>
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{p.id}</td>
                    <td style={{ padding: '8px' }}>{p.nombre_cliente}</td>
                    <td style={{ padding: '8px' }}>{p.telefono_cliente}</td>
                    <td style={{ padding: '8px' }}>${p.total}</td>
                    <td style={{ padding: '8px' }}>
                      <select value={p.estado} onChange={e => cambiarEstado(p.id, e.target.value)}
                        style={{
                          padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc',
                          background: p.estado === 'entregado' ? '#2a9d8f' : p.estado === 'cancelado' ? '#e63946' : '#f4a261',
                          color: 'white', cursor: 'pointer'
                        }}>
                        <option value="pendiente">Pendiente</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td style={{ padding: '8px' }}>{new Date(p.created_at).toLocaleDateString('es-UY')}</td>
                    <td style={{ padding: '8px' }}>
                      <button onClick={() => setPedidoAbierto(pedidoAbierto === p.id ? null : p.id)}
                        style={{
                          background: '#0077b6', color: 'white',
                          border: 'none', padding: '4px 10px',
                          borderRadius: '4px', cursor: 'pointer'
                        }}>
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
                            <li key={d.id}>{d.productos.nombre} x{d.cantidad} — ${d.precio_unitario * d.cantidad}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
    </div>
  )
}

export default Ventas