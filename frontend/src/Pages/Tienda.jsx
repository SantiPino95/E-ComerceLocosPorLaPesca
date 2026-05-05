import { useEffect, useState } from "react";
import { supabase } from '../Lib/supabase';
import { useCarrito } from '../Context/CarritoContext';
import Carrito from '../Components/Carrito';
import Header from '../Components/Header';

function Tienda() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const { agregarAlCarrito, pedidoConfirmado} = useCarrito()
 

  useEffect(() => {
    console.log('recargando productos, pedidoConfirmado:', pedidoConfirmado)
    obtenerProductos()
  }, [pedidoConfirmado])

  const obtenerProductos = async () => {
    const { data, error } = await supabase.from('productos').select('*').eq('activo', true)
    if (error) {
      console.error('Error:', error)
    } else {
      setProductos(data)
    }
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (cargando) return <p>Cargando productos...</p>

  return (
    <div>
      <Header onBuscar={setBusqueda} />
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {productosFiltrados.map(producto => (
            <div key={producto.id} style={{
              border: '1px solid #ccc', padding: '16px',
              width: '200px', borderRadius: '8px'
            }}>
              {producto.imagen_url && (
                <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%' }} />
              )}
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p><strong>${producto.precio}</strong></p>
             <button 
  onClick={() => producto.stock > 0 && agregarAlCarrito(producto)} 
  disabled={producto.stock === 0}
  style={{
    background: producto.stock === 0 ? '#aaa' : '#0077b6', 
    color: 'white',
    border: 'none', padding: '8px 12px',
    borderRadius: '6px', 
    cursor: producto.stock === 0 ? 'not-allowed' : 'pointer', 
    width: '100%'
  }}
>
  {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
</button>
            </div>
          ))}
        </div>
      </div>
      <Carrito />
    </div>
  )
}

export default Tienda