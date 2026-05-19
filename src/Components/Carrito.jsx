import { useState } from 'react'
import { useCarrito } from '../Context/CarritoContext'
import { supabase } from '../Lib/supabase'

function Carrito() {
  const { carrito, eliminarDelCarrito, vaciarCarrito, total, setPedidoConfirmado } = useCarrito()
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [pedidoEnviado, setPedidoEnviado] = useState(false)

  if (carrito.length === 0 && !pedidoEnviado) return null

  const notificarAdmin = async (pedido) => {
    // const telefonoAdmin = 'TELEFONO_ADMIN'
    // const apiKey = 'TU_API_KEY_CALLMEBOT'
    // const mensajeAdmin = `🛒 NUEVO PEDIDO #${pedido.id}\n👤 ${nombre}\n📞 ${telefono}\n💰 Total: $${total}\n\nProductos:\n${carrito.map(p => `• ${p.nombre} x${p.cantidad}`).join('\n')}`
    // const url = `https://api.callmebot.com/whatsapp.php?phone=${telefonoAdmin}&text=${encodeURIComponent(mensajeAdmin)}&apikey=${apiKey}`
    // await fetch(url)

    
  }

  const confirmarPedido = async () => {
    if (!nombre || !telefono) {
      alert('Por favor ingresá tu nombre y teléfono')
      return
    }

    setEnviando(true)

    const { data: pedido, error: errorPedido } = await supabase
      .from('pedidos')
      .insert([{ nombre_cliente: nombre, telefono_cliente: telefono, total, estado: 'pendiente' }])
      .select()
      .single()

    if (errorPedido) {
      alert('Error al procesar el pedido, intentá de nuevo')
      setEnviando(false)
      return
    }

    const detalles = carrito.map(p => ({
      pedido_id: pedido.id,
      producto_id: p.id,
      cantidad: p.cantidad,
      precio_unitario: p.precio
    }))
    await supabase.from('detalle_pedido').insert(detalles)

    for (const p of carrito) {
      const { data: prod } = await supabase
        .from('productos').select('stock').eq('id', p.id).single()
      const nuevoStock = Math.max(0, prod.stock - p.cantidad)
      await supabase.from('productos').update({ stock: nuevoStock }).eq('id', p.id)
    }

    await notificarAdmin(pedido)

    vaciarCarrito()
    setPedidoConfirmado(p => p + 1)
    setEnviando(false)
    setPedidoEnviado(true)
  }

  // Pantalla de gracias
  if (pedidoEnviado) {
    return (
      <div style={{
        position: 'fixed', bottom: '20px', right: '20px',
        background: 'white', border: '1px solid #2a9d8f',
        padding: '24px', borderRadius: '8px', width: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', textAlign: 'center'
      }}>
        <span style={{ fontSize: '40px' }}>🎣</span>
        <h3 style={{ color: '#2a9d8f' }}>¡Gracias por tu compra!</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Nos contactaremos pronto al <strong>{telefono}</strong> para confirmar tu pedido.
        </p>
        <button onClick={() => setPedidoEnviado(false)} style={{
          background: '#0077b6', color: 'white',
          border: 'none', padding: '10px 16px',
          borderRadius: '6px', cursor: 'pointer', width: '100%'
        }}>
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px',
      background: 'white', border: '1px solid #ccc',
      padding: '16px', borderRadius: '8px', width: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <h3>🛒 Tu pedido</h3>
      {carrito.map(p => (
        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>{p.nombre} x{p.cantidad}</span>
          <span>${p.precio * p.cantidad}</span>
          <button onClick={() => eliminarDelCarrito(p.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}>✕</button>
        </div>
      ))}
      <hr />
      <p><strong>Total: ${total}</strong></p>

      {!mostrarForm ? (
        <button onClick={() => setMostrarForm(true)} style={{
          background: '#0077b6', color: 'white',
          border: 'none', padding: '10px 16px',
          borderRadius: '6px', cursor: 'pointer', width: '100%'
        }}>
          Confirmar pedido
        </button>
      ) : (
        <div>
          <input placeholder="Tu nombre" value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input placeholder="Tu teléfono" value={telefono}
            onChange={e => setTelefono(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
          <button onClick={confirmarPedido} disabled={enviando} style={{
            background: '#0077b6', color: 'white',
            border: 'none', padding: '10px 16px',
            borderRadius: '6px', cursor: 'pointer', width: '100%', marginBottom: '8px'
          }}>
            {enviando ? 'Procesando...' : '✅ Confirmar'}
          </button>
          <button onClick={() => setMostrarForm(false)} style={{
            background: '#eee', color: '#333',
            border: 'none', padding: '8px 16px',
            borderRadius: '6px', cursor: 'pointer', width: '100%'
          }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}

export default Carrito