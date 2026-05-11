function ProductoModal({ producto, onCerrar, onAgregar }) {
  if (!producto) return null

  return (
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: '16px',
          width: '500px', maxWidth: '90vw', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        {/* Imagen */}
        {producto.imagen_url
          ? <img src={producto.imagen_url} alt={producto.nombre}
              style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
          : <div style={{
              width: '100%', height: '280px',
              background: 'linear-gradient(135deg, #e8f4fd, #0077b6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '80px' }}>🎣</span>
            </div>
        }

        {/* Contenido */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{
                background: '#e8f4fd', color: '#0077b6',
                padding: '2px 10px', borderRadius: '20px',
                fontSize: '11px', fontWeight: 'bold', textTransform: 'capitalize'
              }}>
                {producto.categoria}
              </span>
              <h2 style={{ margin: '8px 0 4px 0', color: '#1a1a2e' }}>{producto.nombre}</h2>
            </div>
            <button onClick={onCerrar} style={{
              background: 'none', border: 'none',
              fontSize: '24px', cursor: 'pointer', color: '#aaa'
            }}>✕</button>
          </div>

          <p style={{ color: '#666', lineHeight: '1.6', margin: '12px 0' }}>
            {producto.descripcion || 'Sin descripción'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontWeight: 'bold', color: '#0077b6', fontSize: '28px' }}>
              ${producto.precio}
            </span>
            <span style={{
              color: producto.stock <= 3 && producto.stock > 0 ? '#f4a261' : producto.stock === 0 ? '#e63946' : '#2a9d8f',
              fontWeight: 'bold', fontSize: '14px'
            }}>
              {producto.stock === 0 ? '❌ Sin stock' : producto.stock <= 3 ? `⚠️ Últimas ${producto.stock} unidades` : `✅ Stock: ${producto.stock}`}
            </span>
          </div>

          <button
            onClick={() => { if (producto.stock > 0) { onAgregar(producto); onCerrar() } }}
            disabled={producto.stock === 0}
            style={{
              background: producto.stock === 0 ? '#ddd' : '#0077b6',
              color: producto.stock === 0 ? '#aaa' : 'white',
              border: 'none', padding: '14px',
              borderRadius: '10px', cursor: producto.stock === 0 ? 'not-allowed' : 'pointer',
              width: '100%', fontSize: '16px', fontWeight: 'bold'
            }}
          >
            {producto.stock === 0 ? 'Sin stock' : '🛒 Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductoModal