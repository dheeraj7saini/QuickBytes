import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'
import { ShopProvider } from './context/ShopContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ShopProvider>
        <OrderProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </OrderProvider>
      </ShopProvider>
    </AuthProvider>
  </StrictMode>,
)
