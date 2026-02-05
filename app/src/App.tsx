import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { MusicProvider } from './contexts/MusicContext'
import { AppRoutes } from './AppRoutes'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MusicProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </MusicProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
