import { useState } from 'react'
import { supabase } from '../Lib/supabase'
import imageCompression from 'browser-image-compression'

function FormProducto({ onProductoGuardado }) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [imagen, setImagen] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')
const [categoria, setCategoria] = useState('general')

  const handleGuardar = async () => {
    if (!nombre || !precio) {
      setMensaje('Nombre y precio son obligatorios')
      return
    }

    setCargando(true)
    setMensaje('')

    let imagen_url = null
    





    // Si hay imagen la subimos a Supabase Storage
  if (imagen) {
  const opciones = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 2050,
    useWebWorker: true
  }
  const imagenComprimida = await imageCompression(imagen, opciones)
  
  const nombreArchivo = `${Date.now()}_${imagen.name}`
  const { error: errorStorage } = await supabase.storage
    .from('productos')
    .upload(nombreArchivo, imagenComprimida)

  if (errorStorage) {
    setMensaje('Error al subir la imagen')
    setCargando(false)
    return
  }

  const urlData = supabase.storage
    .from('productos')
    .getPublicUrl(nombreArchivo)

  imagen_url = urlData.data.publicUrl
}





    // Guardamos el producto en la tabla
    const { error } = await supabase.from('productos').insert([{
  nombre,
  descripcion,
  precio: parseFloat(precio),
  imagen_url,
  categoria,
  activo: true
}])

    if (error) {
      setMensaje('Error al guardar el producto')
    } else {
      setMensaje('✅ Producto guardado!')
      setNombre('')
      setDescripcion('')
      setPrecio('')
      setImagen(null)
      setCategoria('')
      if (onProductoGuardado) onProductoGuardado()
    }

    setCargando(false)
  }





  return (
    <div style={{
      border: '1px solid #ccc', padding: '24px',
      borderRadius: '8px', maxWidth: '400px',
      margin: '0 auto'
    }}>
      <h3>➕ Nuevo Producto</h3>

      <div style={{ marginBottom: '12px' }}>
        <label>Nombre *</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>Descripción</label>
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', height: '80px' }} />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>Precio *</label>
        <input type="number" value={precio} onChange={e => setPrecio(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }} />
      </div>


      <div style={{ marginBottom: '12px' }}>
  <label>Categoría</label>
  <select value={categoria} onChange={e => setCategoria(e.target.value)}
    style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}>
    <option value="general">General</option>
    <option value="cañas">Cañas</option>
    <option value="anzuelos">Anzuelos</option>
    <option value="materiales">Materiales</option>
    <option value="camping">Camping</option>
    <option value="ropa">Ropa</option>
  </select>
</div>

      <div style={{ marginBottom: '16px' }}>
        <label>Imagen</label>
        <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])}
          style={{ width: '100%', marginTop: '4px' }} />
      </div>

      {mensaje && <p style={{ color: mensaje.includes('✅') ? 'green' : 'red' }}>{mensaje}</p>}

      <button onClick={handleGuardar} disabled={cargando} style={{
        background: '#0077b6', color: 'white',
        border: 'none', padding: '10px 16px',
        borderRadius: '6px', cursor: 'pointer', width: '100%'
      }}>
        {cargando ? 'Guardando...' : 'Guardar Producto'}
      </button>
    </div>
  )
}

export default FormProducto