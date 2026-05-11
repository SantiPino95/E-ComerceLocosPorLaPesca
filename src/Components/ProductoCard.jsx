import { useState } from 'react'
import ProductoModal from './ProductoModal'

function ProductoCard({ producto, onAgregar }) {
  const [hover, setHover] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          border: '1px solid #eee', borderRadius: '12px',
          width: '220px', overflow: 'hidden',
          boxShadow: hover ? '0 8px 24px rgba(0,119,182,0.2)' : '0 2px 8px rgba(0,0,0,0.08)',
          transform: hover ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 0.2s ease',
          background: 'white'
        }}
      >
        {/* Imagen clickeable */}
        <div
          onClick={() => setModalAbierto(true)}
          style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
        >
          {producto.imagen_url
            ? <img src={producto.imagen_url} alt={producto.nombre}
                style={{
                  width: '100%', height: '160px', objectFit: 'cover',
                  transform: hover ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s ease'
                }} />
            : <div style={{
                width: '100%', height: '160px',
                background: 'linear-gradient(135deg, #e8f4fd, #0077b6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: '50px' }}>🎣</span>
              </div>
          }
          {producto.stock <= 3 && producto.stock > 0 && (
            <span style={{
              position: 'absolute', top: '8px', right: '8px',
              background: '#f4a261', color: 'white',
              padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold'
            }}>
              ¡Últimas {producto.stock}!
            </span>
          )}
          {producto.stock === 0 && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Sin stock</span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div style={{ padding: '14px' }}>
          <span style={{
            background: '#e8f4fd', color: '#0077b6',
            padding: '2px 10px', borderRadius: '20px',
            fontSize: '11px', fontWeight: 'bold', textTransform: 'capitalize'
          }}>
            {producto.categoria}
          </span>
          <h4
            onClick={() => setModalAbierto(true)}
            style={{ margin: '8px 0 4px 0', fontSize: '15px', color: '#1a1a2e', cursor: 'pointer' }}
          >
            {producto.nombre}
          </h4>
          <p style={{
            margin: '0 0 10px 0', fontSize: '12px', color: '#888',
            lineHeight: '1.4', height: '34px', overflow: 'hidden'
          }}>
            {producto.descripcion}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#0077b6', fontSize: '18px' }}>
              ${producto.precio}
            </span>
            <span style={{ fontSize: '11px', color: '#aaa' }}>
              Stock: {producto.stock}
            </span>
          </div>
          <button
            onClick={() => producto.stock > 0 && onAgregar(producto)}
            disabled={producto.stock === 0}
            style={{
              background: producto.stock === 0 ? '#ddd' : hover ? '#005f99' : '#0077b6',
              color: producto.stock === 0 ? '#aaa' : 'white',
              border: 'none', padding: '10px 12px',
              borderRadius: '8px', cursor: producto.stock === 0 ? 'not-allowed' : 'pointer',
              width: '100%', fontSize: '13px', fontWeight: 'bold',
              transition: 'background 0.2s ease'
            }}
          >
            {producto.stock === 0 ? 'Sin stock' : '🛒 Agregar al carrito'}
          </button>
        </div>
      </div>

      {modalAbierto && (
        <ProductoModal
          producto={producto}
          onCerrar={() => setModalAbierto(false)}
          onAgregar={onAgregar}
        />
      )}
    </>
  )
}

export default ProductoCard