import { useState } from 'react'
import { useCarrito } from '../Context/CarritoContext'
import { supabase } from '../Lib/supabase'
 

function Carrito() {
  const { carrito, eliminarDelCarrito, vaciarCarrito, total, setPedidoConfirmado } = useCarrito()
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (carrito.length === 0) return null

 const confirmarPedido = async () => {
  if (!nombre || !telefono) {
    alert('Por favor ingresá tu nombre y teléfono')
    return
  }

  // Abrimos WhatsApp
  const numero = '59892927697'
  const mensaje = carrito
    .map(p => `• ${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`)
    .join('\n')
  const mensajeFinal = `Hola! Soy ${nombre} (${telefono}), quiero hacer el siguiente pedido:\n\n${mensaje}\n\nTotal: $${total}`
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensajeFinal)}`
  window.open(url)

  // Mostramos los botones de confirmación
  setEnviando(true)
}

const finalizarPedido = async () => {
  // Guardamos el pedido
  const { data: pedido, error: errorPedido } = await supabase
    .from('pedidos')
    .insert([{ nombre_cliente: nombre, telefono_cliente: telefono, total, estado: 'pendiente' }])
    .select()
    .single()

  if (errorPedido) {
    alert('Error al guardar el pedido')
    setEnviando(false)
    return
  }

  // Guardamos el detalle
  const detalles = carrito.map(p => ({
    pedido_id: pedido.id,
    producto_id: p.id,
    cantidad: p.cantidad,
    precio_unitario: p.precio
  }))
  await supabase.from('detalle_pedido').insert(detalles)

  // Bajamos el stock
  for (const p of carrito) {
    const { data: prod } = await supabase
      .from('productos').select('stock').eq('id', p.id).single()
    const nuevoStock = Math.max(0, prod.stock - p.cantidad)
    await supabase.from('productos').update({ stock: nuevoStock }).eq('id', p.id)
  }

  // Limpiamos todo
  vaciarCarrito()
  setMostrarForm(false)
  setNombre('')
  setTelefono('')
  setEnviando(false)
  setPedidoConfirmado(p => p + 1)
  alert('¡Pedido registrado! Gracias.')

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
    background: '#25D366', color: 'white',
    border: 'none', padding: '10px 16px',
    borderRadius: '6px', cursor: 'pointer', width: '100%'
  }}>
    Enviar por WhatsApp
  </button>
) : !enviando ? (
  <div>
    <input
      placeholder="Tu nombre"
      value={nombre}
      onChange={e => setNombre(e.target.value)}
      style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
    />
    <input
      placeholder="Tu teléfono"
      value={telefono}
      onChange={e => setTelefono(e.target.value)}
      style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
    />
    <button onClick={confirmarPedido} style={{
      background: '#25D366', color: 'white',
      border: 'none', padding: '10px 16px',
      borderRadius: '6px', cursor: 'pointer', width: '100%', marginBottom: '8px'
    }}>
      Abrir WhatsApp
    </button>
    <button onClick={() => setMostrarForm(false)} style={{
      background: '#eee', color: '#333',
      border: 'none', padding: '8px 16px',
      borderRadius: '6px', cursor: 'pointer', width: '100%'
    }}>
      Cancelar
    </button>
  </div>
) : (
  <div style={{ textAlign: 'center' }}>
    <p>¿Enviaste el mensaje en WhatsApp?</p>
    <button onClick={finalizarPedido} style={{
      background: '#25D366', color: 'white',
      border: 'none', padding: '10px 16px',
      borderRadius: '6px', cursor: 'pointer', width: '100%', marginBottom: '8px'
    }}>
      ✅ Sí, lo envié
    </button>
    <button onClick={() => setEnviando(false)} style={{
      background: '#e63946', color: 'white',
      border: 'none', padding: '8px 16px',
      borderRadius: '6px', cursor: 'pointer', width: '100%'
    }}>
      ❌ No lo envié
    </button>
  </div>
  
  )}
  </div>
  )}

export default Carrito