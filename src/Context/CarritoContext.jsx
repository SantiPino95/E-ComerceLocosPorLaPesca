import { createContext, useContext, useState } from 'react'

const CarritoContext = createContext()

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([])
  const [pedidoConfirmado, setPedidoConfirmado] = useState(0)

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id)
      if (existe) {

        if(existe.cantidad >= producto.stock) {

          alert(`Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}`)
        return prev
        }
        return prev.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p)
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id))
  }


  const vaciarCarrito = () => setCarrito([])

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, total, pedidoConfirmado, setPedidoConfirmado }}>
      {children}
    </CarritoContext.Provider>
  )
}

export const useCarrito = () => useContext(CarritoContext)