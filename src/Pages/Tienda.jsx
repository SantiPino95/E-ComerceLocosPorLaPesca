import { useEffect, useState } from "react";
import { supabase } from '../Lib/supabase';
import { useCarrito } from '../Context/CarritoContext';
import Carrito from '../Components/Carrito';
import Header from '../Components/Header';
import ProductoCard from "../Components/ProductoCard";

const CATEGORIAS = ['Todos', 'Cañas', 'Anzuelos', 'Materiales', 'Camping', 'Ropa', 'General']

function Tienda() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const { agregarAlCarrito, pedidoConfirmado } = useCarrito()

  useEffect(() => {
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

  const productosFiltrados = productos
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(p => categoriaActiva === 'Todos' || p.categoria?.toLowerCase() === categoriaActiva.toLowerCase())

  if (cargando) return <p>Cargando productos...</p>

  return (
    <div>
      <Header onBuscar={setBusqueda} />
      <div style={{ display: 'flex' }}>

        {/* Filtros laterales */}
        <div style={{
          width: '180px', minHeight: '100vh',
          padding: '20px', background: '#f8f9fa',
          borderRight: '1px solid #eee', flexShrink: 0
        }}>
          <h4 style={{ marginTop: 0 }}>Categorías</h4>
          {CATEGORIAS.map(cat => (
            <div key={cat}
              onClick={() => setCategoriaActiva(cat)}
              style={{
                padding: '10px 12px', marginBottom: '6px',
                borderRadius: '6px', cursor: 'pointer',
                background: categoriaActiva === cat ? '#0077b6' : 'transparent',
                color: categoriaActiva === cat ? 'white' : '#333',
                fontWeight: categoriaActiva === cat ? 'bold' : 'normal'
              }}>
              {cat}
            </div>
          ))}
        </div>

        {/* Productos */}
        <div style={{ flex: 1, padding: '20px' }}>
          {productosFiltrados.length === 0 ? (
            <p>No hay productos en esta categoría.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {productosFiltrados.map(producto => (
  <ProductoCard
    key={producto.id}
    producto={producto}
    onAgregar={agregarAlCarrito}
  />
))}
            </div>
          )}
        </div>
      </div>
      <Carrito />
    </div>
  )
}

export default Tienda