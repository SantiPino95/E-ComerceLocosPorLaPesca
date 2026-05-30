import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CarritoProvider } from './Context/CarritoContext.jsx'
import { ClienteProvider } from './Context/ClienteContext.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ClienteProvider>
    <CarritoProvider>
    <App />
    </CarritoProvider>
    </ClienteProvider>
    </AuthProvider>
  </StrictMode>,
)
